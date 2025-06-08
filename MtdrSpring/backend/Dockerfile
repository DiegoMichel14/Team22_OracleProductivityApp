FROM openjdk:11-jdk-slim

# Set working directory
WORKDIR /tmp/

# Create all necessary wallet directories
RUN mkdir -p /tmp/wallet && \
    mkdir -p /mtdrworkshop/creds

# Copy wallet files (better layer caching)
COPY wallet/ /tmp/wallet/
# Also copy to the kubernetes path used in todolistapp-springboot.yaml
COPY wallet/ /mtdrworkshop/creds/

# Fix permissions PROPERLY - this is the key fix!
RUN chmod -R 755 /tmp/wallet/ && \
    chmod -R 755 /mtdrworkshop/creds/ && \
    ls -la /tmp/wallet/ && \
    ls -la /mtdrworkshop/creds/ && \
    echo "Wallet files copied and permissions set"

# Install debug tools for troubleshooting
RUN apt-get update && apt-get install -y procps net-tools curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify essential files exist and are readable in both locations
RUN test -r /tmp/wallet/tnsnames.ora || (echo "ERROR: tnsnames.ora not readable in /tmp/wallet!" && exit 1)
RUN test -r /mtdrworkshop/creds/tnsnames.ora || (echo "ERROR: tnsnames.ora not readable in /mtdrworkshop/creds!" && exit 1)

# Print wallet contents for debugging
RUN echo "Wallet contents (/tmp/wallet):" && ls -la /tmp/wallet/ && \
    echo "TNS Names content (/tmp/wallet):" && cat /tmp/wallet/tnsnames.ora | grep -i reacttodoia9ge
RUN echo "Wallet contents (/mtdrworkshop/creds):" && ls -la /mtdrworkshop/creds/ && \
    echo "TNS Names content (/mtdrworkshop/creds):" && cat /mtdrworkshop/creds/tnsnames.ora | grep -i reacttodoia9ge

# Copy the JAR file
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar MyTodoList.jar

# Set environment variables (these can be overridden at runtime)
# Set both /tmp/wallet and /mtdrworkshop/creds to ensure app works with both configs
ENV db_url="jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet"
ENV db_user="TODOUSER"
ENV db_password="WELcome__12345"
ENV TNS_ADMIN=/tmp/wallet

# Add the wallet locations to Java options to ensure they're found
ENV WALLET_LOCATION=/mtdrworkshop/creds
ENV WALLET_LOCATION_ALT=/tmp/wallet

# Expose port
EXPOSE 8080

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && apt-get clean

# Add more comprehensive health check using our custom endpoints
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health/db || curl -f http://localhost:8080/actuator/health || exit 1

# Set JVM options for enhanced debugging and wallet visibility
ENV JAVA_OPTS="-Xms256m -Xmx512m -Doracle.net.tns_admin=/tmp/wallet -Djavax.net.debug=ssl,handshake,trustmanager"

# Create a comprehensive startup script with wallet verification and DB connectivity check
RUN echo '#!/bin/sh' > /tmp/start.sh && \
    echo 'echo "=== WALLET VERIFICATION AT STARTUP ==="' >> /tmp/start.sh && \
    echo 'echo "Current directory: $(pwd)"' >> /tmp/start.sh && \
    echo 'echo "Checking wallet directories:"' >> /tmp/start.sh && \
    echo 'ls -la /tmp/wallet/' >> /tmp/start.sh && \
    echo 'ls -la /mtdrworkshop/creds/' >> /tmp/start.sh && \
    echo 'echo "TNS_ADMIN environment variable: $TNS_ADMIN"' >> /tmp/start.sh && \
    echo 'echo "WALLET_LOCATION environment variable: $WALLET_LOCATION"' >> /tmp/start.sh && \
    echo 'echo "Checking tnsnames.ora in both locations:"' >> /tmp/start.sh && \
    echo 'cat /tmp/wallet/tnsnames.ora | grep -i reacttodoia9ge || echo "WARNING: tnsnames.ora in /tmp/wallet/ might be missing reacttodoia9ge entries"' >> /tmp/start.sh && \
    echo 'cat /mtdrworkshop/creds/tnsnames.ora | grep -i reacttodoia9ge || echo "WARNING: tnsnames.ora in /mtdrworkshop/creds/ might be missing reacttodoia9ge entries"' >> /tmp/start.sh && \
    echo 'echo "=== DATABASE CONNECTIVITY CHECK ==="' >> /tmp/start.sh && \
    echo 'apt-get update -qq && apt-get install -qq -y sqlplus >/dev/null 2>&1 || echo "INFO: sqlplus not available, skipping direct connection test"' >> /tmp/start.sh && \
    echo 'if command -v sqlplus >/dev/null 2>&1; then' >> /tmp/start.sh && \
    echo '  echo "Testing direct DB connectivity with sqlplus..."' >> /tmp/start.sh && \
    echo '  export TNS_ADMIN=/tmp/wallet' >> /tmp/start.sh && \
    echo '  echo "exit" | sqlplus -s TODOUSER/WELcome__12345@reacttodoia9ge_tp && echo "✅ Database connection successful!" || echo "⚠️ Database connection failed with TNS_ADMIN=/tmp/wallet"' >> /tmp/start.sh && \
    echo '  export TNS_ADMIN=/mtdrworkshop/creds' >> /tmp/start.sh && \
    echo '  echo "exit" | sqlplus -s TODOUSER/WELcome__12345@reacttodoia9ge_tp && echo "✅ Database connection successful!" || echo "⚠️ Database connection failed with TNS_ADMIN=/mtdrworkshop/creds"' >> /tmp/start.sh && \
    echo 'else' >> /tmp/start.sh && \
    echo '  echo "sqlplus not available, skipping direct connection test. Will attempt connection via application."' >> /tmp/start.sh && \
    echo 'fi' >> /tmp/start.sh && \
    echo 'echo "Setting explicit system properties for wallet locations"' >> /tmp/start.sh && \
    echo 'FINAL_OPTS="$JAVA_OPTS -Doracle.net.tns_admin=/tmp/wallet -Doracle.net.wallet_location=/mtdrworkshop/creds -Doracle.jdbc.fanEnabled=false"' >> /tmp/start.sh && \
    echo 'echo "Starting application with options: $FINAL_OPTS"' >> /tmp/start.sh && \
    echo 'java $FINAL_OPTS -jar MyTodoList.jar' >> /tmp/start.sh && \
    chmod +x /tmp/start.sh

# Start using the script
ENTRYPOINT ["/tmp/start.sh"]