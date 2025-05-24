FROM node:lts as builder
WORKDIR /app
COPY AudioSphere/package.json AudioSphere/yarn.lock ./AudioSphere/
RUN cd AudioSphere && yarn install --frozen-lockfile
COPY GeminiChat/package.json GeminiChat/yarn.lock ./GeminiChat/
RUN cd GeminiChat && yarn install --frozen-lockfile
COPY QuoteGen/package.json QuoteGen/yarn.lock ./QuoteGen/
RUN cd QuoteGen && yarn install --frozen-lockfile
COPY AudioSphere/ ./AudioSphere/
COPY GeminiChat/ ./GeminiChat/
COPY QuoteGen/ ./QuoteGen/
COPY package.json yarn.lock ./
RUN cd AudioSphere && yarn build
RUN cd GeminiChat && yarn build
RUN cd QuoteGen && yarn build
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
CMD ["concurrently", "http-server . -p 3000", "http-server ./AudioSphere/dist -p 3001", "http-server ./GeminiChat/dist -p 3002", "http-server ./QuoteGen/dist -p 3003"]
CMD ["concurrently", "yarn --cwd AudioSphere start -p 3000", "yarn --cwd GeminiChat start -p 3001", "yarn --cwd QuoteGen start -p 3002"]