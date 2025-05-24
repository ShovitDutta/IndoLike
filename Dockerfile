FROM ubuntu:latest as builder
WORKDIR /app
RUN apt-get update && apt-get install -y nodejs npm && \
    npm install -g yarn
COPY . .
ENV DATABASE_URL="file:./local.db"
RUN yarn install
RUN yarn run together:build
FROM ubuntu:latest
WORKDIR /app
RUN apt-get update && apt-get install -y nodejs npm && \
    npm install -g yarn
ENV PATH="/app/node_modules/.bin:$PATH"
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
