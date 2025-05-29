#FROM openjdk:22
#COPY pom.xml /tmp/
#COPY src /tmp/src/
#WORKDIR /tmp/
#RUN mkdir -p /tmp/wallet
#COPY wallet /tmp/wallet
#ENV db_url="jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet"
#ENV db_user="TODOUSER"
#ENV db_password="WELcome__12345"
#EXPOSE 8080
#COPY target/MyTodoList-0.0.1-SNAPSHOT.jar MyTodoList.jar
#ENTRYPOINT ["java","-jar","MyTodoList.jar"] 



FROM eclipse-temurin:11-jdk-jammy

# Directorio de trabajo
WORKDIR /app

# Copia el JAR empaquetado por Maven
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar MyTodoList.jar

# Copia tu carpeta wallet (que en Windows está en .../MtdrSpring/backend/wallet)
COPY wallet /app/wallet

# Expone el puerto de la aplicación
EXPOSE 8080

# Comando de arranque
ENTRYPOINT ["java", "-jar", "MyTodoList.jar"]
