FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app
RUN apt update && \
    apt install -y \
    wget \
    unzip \
    curl \
    tor \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm && \
    apt autoremove -y && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*
RUN hash -r
RUN npm install -g n && n install 24
RUN hash -r
ENV PATH="/usr/local/bin:$PATH"
RUN hash -r
RUN npm install -g yarn
RUN hash -r
COPY package.json .
RUN hash -r
COPY AudioSphere AudioSphere/
RUN hash -r
COPY GeminiChat GeminiChat/
RUN hash -r
COPY QuoteGen QuoteGen/
RUN hash -r
ENV DATABASE_URL="file:./local.db"
RUN hash -r
RUN yarn install
RUN hash -r
RUN yarn build
RUN hash -r
EXPOSE 9050 9051
EXPOSE 3001 3002 3003
CMD ["yarn", "start"]