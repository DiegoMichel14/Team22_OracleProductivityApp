FROM openjdk:11-jdk-slim

WORKDIR /tmp/

# Create wallet directory
RUN mkdir -p /tmp/wallet

# Copy wallet files
COPY wallet/ /tmp/wallet/

# Set proper permissions for wallet files
RUN chmod -R 755 /tmp/wallet/ && \
    echo "Wallet files copied to /tmp/wallet:"  && \
    ls -la /tmp/wallet/

# Make sure tnsnames.ora exists
RUN if [ -f "/tmp/wallet/tnsnames.ora" ]; then \
      echo "✓ tnsnames.ora found" && \
      echo "Connection identifier:" && \
      grep -i reacttodoia9ge /tmp/wallet/tnsnames.ora | head -1; \
    else \
      echo "✗ tnsnames.ora NOT FOUND!" && exit 1; \
    fi

# Copy the JAR file
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar MyTodoList.jar

# Set environment variables
ENV TNS_ADMIN=/tmp/wallet
ENV ORACLE_HOME=/tmp
ENV db_url="jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet"
ENV db_user="TODOUSER"
ENV db_password="WELcome__12345"
ENV dbpassword="WELcome__12345"

# Expose port
EXPOSE 8080

# Startup command with additional JVM options for debugging and stability
CMD ["java", \
     "-Doracle.net.tns_admin=/tmp/wallet", \
     "-Djava.security.egd=file:/dev/./urandom", \
     "-Dspring.jpa.hibernate.ddl-auto=none", \
     "-Dspring.datasource.hikari.initialization-fail-timeout=-1", \
     "-Dserver.port=8080", \
     "-jar", "MyTodoList.jar"]