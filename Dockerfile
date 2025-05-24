FROM ubuntu:latest as builder
WORKDIR /app
RUN apt-get update && apt-get install -y curl xz-utils && \
    curl -fsSL https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64.tar.xz | tar -xJv -C /usr/local --strip-components=1 && \
    npm install -g yarn
ENV PATH="/usr/local/bin:/app/node_modules/.bin:$PATH"
COPY . .
ENV DATABASE_URL="file:./local.db"
RUN yarn install
RUN yarn run together:build
FROM ubuntu:latest
WORKDIR /app
RUN apt-get update && apt-get install -y curl xz-utils && \
    curl -fsSL https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64.tar.xz | tar -xJv -C /usr/local --strip-components=1 && \
    npm install -g yarn
ENV PATH="/usr/local/bin:/app/node_modules/.bin:$PATH"
COPY --from=builder /app/QuoteGen ./QuoteGen
COPY --from=builder /app/GeminiChat ./GeminiChat
COPY --from=builder /app/AudioSphere ./AudioSphere
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY index.html .
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003
CMD ["yarn", "run", "together:start"]
