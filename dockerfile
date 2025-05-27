FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app
RUN apt update && \
    apt install -y \
    wget \
    unzip \
    curl \
    tar \
    tor \
    python3 \
    python3-pip \
    python3-venv && \
    apt autoremove -y && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*
ENV NODE_ARCH=linux-x64
ENV NODE_VERSION=node-v22.2.0
RUN curl -sL "https://nodejs.org/dist/${NODE_VERSION}/${NODE_VERSION}-${NODE_ARCH}.tar.xz" | tar -xJf - -C /usr/local --strip-components=1
ENV PATH="/usr/local/bin:$PATH"
RUN npm install -g yarn
COPY package.json .
COPY AudioSphere AudioSphere/
COPY GeminiChat GeminiChat/
COPY QuoteGen QuoteGen/
RUN yarn install
RUN yarn together:build
RUN cp /etc/tor/torrc /etc/tor/torrc.bak && \
    grep -q "SocksPort 9050" /etc/tor/torrc || echo "SocksPort 9050" >> /etc/tor/torrc
EXPOSE 9050
EXPOSE 3001 3002 3003
CMD service tor start && yarn together:start