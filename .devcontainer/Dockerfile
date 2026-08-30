# Dev Container image for My Island: JDK 25 (LTS) + Node 22 + Maven 3.9
FROM eclipse-temurin:25-jdk

ARG NODE_MAJOR=22
ARG MAVEN_VERSION=3.9.11

# System tooling, Node.js (NodeSource) and a modern Maven (Boot 4 needs Maven 3.9+)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git curl ca-certificates gnupg sudo unzip postgresql-client \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" -o /tmp/maven.tar.gz \
    && tar -xzf /tmp/maven.tar.gz -C /opt \
    && ln -sfn "/opt/apache-maven-${MAVEN_VERSION}" /opt/maven \
    && rm /tmp/maven.tar.gz

ENV MAVEN_HOME=/opt/maven
ENV PATH="/opt/maven/bin:${PATH}"

WORKDIR /workspaces
