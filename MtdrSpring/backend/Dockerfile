FROM openjdk:11-jdk-slim

# Set working directory
WORKDIR /tmp/

# Create wallet directory with proper permissions
RUN mkdir -p /tmp/wallet

# Copy wallet files first (better layer caching)
COPY wallet/ /tmp/wallet/

# Set proper permissions for wallet files
RUN chmod -R 644 /tmp/wallet/ && \
    ls -la /tmp/wallet/ && \
    echo "Wallet files copied successfully"

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

# Run as non-root user for security
RUN addgroup --system spring && adduser --system spring --ingroup spring
RUN chown -R spring:spring /tmp/
USER spring:spring

# Set JVM options for better performance
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# Entry point with JVM options
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar MyTodoList.jar"]