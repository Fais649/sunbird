<script lang="ts">
	import { onMount } from 'svelte';

	let { src } = $props();
	let canvas: HTMLCanvasElement;

	function resizeCanvas() {
		const dpr = window.devicePixelRatio || 1;
		const width = canvas.clientWidth * dpr;
		const height = canvas.clientHeight * dpr;

		canvas.width = width;
		canvas.height = height;

		context.configure({
			device,
			format,
			alphaMode: 'premultiplied'
		});
	}

	$effect(async () => {
		if (!navigator.gpu) {
			console.warn('WebGPU not supported — falling back to normal image.');
			return;
		}

		const adapter = await navigator.gpu.requestAdapter();
		const device = await adapter.requestDevice();
		const context = canvas.getContext('webgpu');

		const format = navigator.gpu.getPreferredCanvasFormat();
		context.configure({
			device,
			format,
			alphaMode: 'premultiplied'
		});

		const img = new Image();
		img.src = src;
		await img.decode();

		const bitmap = await createImageBitmap(img);

		// Upload to GPU texture
		const texture = device.createTexture({
			size: [bitmap.width, bitmap.height, 1],
			format: 'rgba8unorm',
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT
		});

		device.queue.copyExternalImageToTexture({ source: bitmap }, { texture }, [
			bitmap.width,
			bitmap.height
		]);

		// Simple vertex + fragment shader
		const shaderModule = device.createShaderModule({
			code: `
        @group(0) @binding(0) var mySampler: sampler;
        @group(0) @binding(1) var myTexture: texture_2d<f32>;

        struct VertexOutput {
          @builtin(position) position: vec4f,
          @location(0) uv: vec2f
        }

        @vertex
        fn vsMain(@builtin(vertex_index) VertexIndex: u32) -> VertexOutput {
          var pos = array<vec2f, 6>(
            vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
            vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0)
          );
          var uv = array<vec2f, 6>(
            vec2f(0.0, 1.0), vec2f(1.0, 1.0), vec2f(0.0, 0.0),
            vec2f(0.0, 0.0), vec2f(1.0, 1.0), vec2f(1.0, 0.0)
          );
          var output: VertexOutput;
          output.position = vec4f(pos[VertexIndex], 0.0, 1.0);
          output.uv = uv[VertexIndex];
          return output;
        }

        fn paperNoise(uv: vec2f) -> f32 {
          let n = sin(dot(uv.xy, vec2f(12.9898, 78.233))) * 43758.5453;
          return fract(n);
        }

        @fragment
        fn fsMain(input: VertexOutput) -> @location(0) vec4f {
          let color = textureSample(myTexture, mySampler, input.uv).rgb;

          // Add paper-like noise pattern
          let noise = paperNoise(input.uv * 300.0) * 0.08;
          let light = dot(normalize(vec3f(0.2, 0.4, 0.9)), vec3f(0.0, 0.0, 1.0));
          let shaded = color * (0.95 + light * 0.05) + vec3f(noise);

          return vec4f(shaded, 1.0);
        }
      `
		});

		const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });
		const bindGroupLayout = device.createBindGroupLayout({
			entries: [
				{ binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
				{ binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {} }
			]
		});

		const pipeline = device.createRenderPipeline({
			layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
			vertex: { module: shaderModule, entryPoint: 'vsMain' },
			fragment: { module: shaderModule, entryPoint: 'fsMain', targets: [{ format }] },
			primitive: { topology: 'triangle-list' }
		});

		const bindGroup = device.createBindGroup({
			layout: bindGroupLayout,
			entries: [
				{ binding: 0, resource: sampler },
				{ binding: 1, resource: texture.createView() }
			]
		});

		function frame() {
			const encoder = device.createCommandEncoder();
			const renderPass = encoder.beginRenderPass({
				colorAttachments: [
					{
						view: context.getCurrentTexture().createView(),
						loadOp: 'clear',
						storeOp: 'store',
						clearValue: { r: 1, g: 1, b: 1, a: 1 }
					}
				]
			});
			renderPass.setPipeline(pipeline);
			renderPass.setBindGroup(0, bindGroup);
			renderPass.draw(6, 1, 0, 0);
			renderPass.end();
			device.queue.submit([encoder.finish()]);
			requestAnimationFrame(frame);
		}

		frame();
	});
</script>

<canvas onresize={resizeCanvas} bind:this={canvas} class="aspect-square h-full object-cover"
></canvas>
