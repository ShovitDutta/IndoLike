FROM node:lts as builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run together:build
FROM node:lts
WORKDIR /app
COPY --from=builder /app/QuoteGen ./QuoteGen
COPY --from=builder /app/GeminiChat ./GeminiChat
COPY --from=builder /app/AudioSphere ./AudioSphere
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY index.html .
RUN yarn global add concurrently http-server
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003
CMD ["yarn", "run", "together:start"]
