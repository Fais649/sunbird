FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS dev
WORKDIR /app
COPY --from=install --chown=bun:bun /temp/dev/node_modules node_modules
COPY --from=install --chown=bun:bun /temp/dev/package.json package.json
COPY --from=install --chown=bun:bun /temp/dev/bun.lock bun.lock
# COPY --chown=bun:bun . .
USER bun
EXPOSE 5173
CMD [ "bun", "run", "dev", "--host" ]

# BUILD TARGET
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=install --chown=bun:bun /temp/prod/node_modules node_modules
COPY --from=prerelease --chown=bun:bun /usr/src/app/build build
COPY --from=prerelease --chown=bun:bun /usr/src/app/package.json .

USER bun
EXPOSE 3000
CMD [ "bun", "run", "build/index.js" ]
