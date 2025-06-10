FROM openjdk:11-jdk-slim

WORKDIR /app

# Create wallet directory at /tmp/wallet (matches your application.properties)
RUN mkdir -p /tmp/wallet

# Copy wallet files
COPY wallet/ /tmp/wallet/
RUN chmod -R 755 /tmp/wallet/

# Copy the JAR file
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar /app/MyTodoList.jar

# Environment variables
ENV TNS_ADMIN=/tmp/wallet
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8080

# Expose port
EXPOSE 8080

# Start application
CMD ["java", \
     "-Xms512m", \
     "-Xmx1024m", \
     "-Djava.security.egd=file:/dev/./urandom", \
     "-Doracle.net.tns_admin=/tmp/wallet", \
     "-Dspring.profiles.active=prod", \
     "-Dserver.port=8080", \
     "-jar", "/app/MyTodoList.jar"]