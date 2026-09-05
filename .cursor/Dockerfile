########################################################
# Cloud Agent VM: toolchain + Docker-in-Docker.
# Do not COPY the repository; Cursor checks out the commit.
########################################################
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
        iptables \
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

########################################################
# DOCKER INSTALLATION (Cursor recommended DinD setup)
########################################################
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl --retry 3 --retry-delay 5 -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
        > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin \
        fuse-overlayfs \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/docker \
    && printf '%s\n' '{' \
       '  "storage-driver": "fuse-overlayfs"' \
       '}' > /etc/docker/daemon.json \
    && update-alternatives --set iptables /usr/sbin/iptables-legacy \
    && update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy

RUN curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR=/usr/local/bin sh

########################################################
# ubuntu user (uid 1000 on ubuntu:24.04)
########################################################
RUN echo 'PasswordAuthentication no\nChallengeResponseAuthentication no\nUsePAM no' \
        > /etc/ssh/sshd_config.d/disable_password_auth.conf || true \
    && groupadd -f docker \
    && usermod -aG docker ubuntu \
    && usermod -aG sudo ubuntu \
    && echo "ubuntu ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/ubuntu \
    && chmod 0440 /etc/sudoers.d/ubuntu

USER ubuntu
WORKDIR /workspace
