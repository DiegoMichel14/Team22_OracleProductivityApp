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

# Verify essential files exist and are readable
RUN test -r /tmp/wallet/tnsnames.ora || (echo "ERROR: tnsnames.ora not readable!" && exit 1)

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

# Set JVM options directly in entrypoint for better clarity
# We've removed the non-root user setup as it sometimes causes permission issues with wallet files
# Start application with explicit memory settings
ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "MyTodoList.jar"]