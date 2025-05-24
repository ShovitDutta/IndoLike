FROM node:lts as builder
WORKDIR /app
COPY . .
RUN npm i -g yarn concurrently http-server forever
ENV DATABASE_URL="file:./local.db"
RUN yarn install
RUN yarn run together:build
FROM node:lts
WORKDIR /app
COPY --from=builder /app/QuoteGen ./QuoteGen
COPY --from=builder /app/GeminiChat ./GeminiChat
COPY --from=builder /app/AudioSphere ./AudioSphere
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY index.html .
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003
CMD ["forever", "start", "yarn", "run", "together:start"]
