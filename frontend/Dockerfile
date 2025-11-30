FROM oven/bun:latest as base

WORKDIR /usr/src/app
FROM base AS install

RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM install AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production

RUN bun --bun run vite build

FROM base AS dev
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/package.json .
COPY --from=install /temp/dev/bun.lock .
COPY --from=prerelease /usr/src/app .
USER bun
ENTRYPOINT ["/bin/bash"]


FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build .

USER bun

ENTRYPOINT [ "bun", "--bun", "run", "index.js" ]
