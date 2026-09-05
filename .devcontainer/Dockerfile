# Workspace image for Dev Containers and `docker compose run workspace`.
# Do not COPY the repository: compose/Dev Containers mount it at /workspace.
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    PIP_BREAK_SYSTEM_PACKAGES=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        gnupg \
        iproute2 \
        jq \
        make \
        nodejs \
        npm \
        openjdk-21-jdk-headless \
        postgresql-client \
        python3 \
        python3-pip \
        python3-venv \
        socat \
        sudo \
        unzip \
        wget \
    && rm -rf /var/lib/apt/lists/*

# Docker CLI only — daemon is the host / Dev Container sibling engine.
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl --retry 3 --retry-delay 5 -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
        > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends docker-ce-cli docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

# uv / uvx for Grafana MCP inside the container.
RUN curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR=/usr/local/bin sh

COPY ops/tests/requirements.txt /tmp/ops-tests-requirements.txt
RUN python3 -m pip install --no-cache-dir -r /tmp/ops-tests-requirements.txt \
    && rm /tmp/ops-tests-requirements.txt

# ubuntu:24.04 already has user ubuntu (uid 1000).
RUN groupadd -f docker \
    && usermod -aG docker ubuntu \
    && usermod -aG sudo ubuntu \
    && echo "ubuntu ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/ubuntu \
    && chmod 0440 /etc/sudoers.d/ubuntu

WORKDIR /workspace
USER ubuntu
