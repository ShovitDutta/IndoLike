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
RUN npm install -g n && \
    n install 24
ENV PATH="/usr/local/bin:$PATH"
RUN npm install -g yarn
COPY package.json .
COPY AudioSphere AudioSphere/
COPY GeminiChat GeminiChat/
COPY QuoteGen QuoteGen/
RUN yarn install
RUN yarn build
RUN cp /etc/tor/torrc/torrc /etc/tor/torrc.bak && \
    grep -q "SocksPort 9050" /etc/tor/torrc || echo "SocksPort 9050" >> /etc/tor/torrc
EXPOSE 9050 9051
EXPOSE 3001 3002 3003
CMD ["yarn", "build"]