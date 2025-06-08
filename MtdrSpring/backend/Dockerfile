FROM openjdk:11-jdk-slim

# Set working directory
WORKDIR /tmp/

# Create wallet directory first
RUN mkdir -p /tmp/wallet

# Copy wallet files (better layer caching)
COPY wallet/ /tmp/wallet/

# Fix permissions PROPERLY - this is the key fix!
RUN chmod -R 755 /tmp/wallet/ && \
    ls -la /tmp/wallet/ && \
    echo "Wallet files copied and permissions set"

# Install debug tools for troubleshooting
RUN apt-get update && apt-get install -y procps net-tools curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify essential files exist and are readable
RUN test -r /tmp/wallet/tnsnames.ora || (echo "ERROR: tnsnames.ora not readable!" && exit 1)
RUN echo "Wallet contents:" && ls -la /tmp/wallet/ && \
    echo "TNS Names content:" && cat /tmp/wallet/tnsnames.ora | grep -i reacttodoia9ge

# Copy the JAR file
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar MyTodoList.jar

# Set environment variables (these can be overridden at runtime)
ENV db_url="jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet"
ENV db_user="TODOUSER"
ENV db_password="WELcome__12345"

# Expose port
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://220.158.67.237/actuator/health || exit 1

# Set JVM options for enhanced debugging and wallet visibility
ENV JAVA_OPTS="-Xms256m -Xmx512m -Doracle.net.tns_admin=/tmp/wallet -Djavax.net.debug=ssl,handshake,trustmanager"

# Create a startup script for additional debug information
RUN echo '#!/bin/sh' > /tmp/start.sh && \
    echo 'echo "Current directory: $(pwd)"' >> /tmp/start.sh && \
    echo 'echo "Wallet directory contents:"' >> /tmp/start.sh && \
    echo 'ls -la /tmp/wallet/' >> /tmp/start.sh && \
    echo 'echo "TNS_ADMIN environment variable: $TNS_ADMIN"' >> /tmp/start.sh && \
    echo 'echo "Starting application with JAVA_OPTS: $JAVA_OPTS"' >> /tmp/start.sh && \
    echo 'java $JAVA_OPTS -jar MyTodoList.jar' >> /tmp/start.sh && \
    chmod +x /tmp/start.sh

# Start using the script
ENTRYPOINT ["/tmp/start.sh"]