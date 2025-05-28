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
RUN npm install -g n && n install 24
ENV PATH="/usr/local/bin:$PATH"
COPY . /app
ENV DATABASE_URL="file:./local.db"
RUN npm install
RUN npm run build
EXPOSE 9050 9051
EXPOSE 3001 3002 3003
CMD ["npm", "run", "start"]