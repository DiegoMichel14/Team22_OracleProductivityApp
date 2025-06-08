# Oracle Productivity App

A full-stack Cloud Native application with React JS frontend and Java Spring Boot backend deployed on Oracle Cloud Infrastructure.

![image](https://user-images.githubusercontent.com/7783295/116454396-cbfb7a00-a814-11eb-8196-ba2113858e8b.png)
  
## MyToDo React JS
The repository hosts the code, scripts and instructions for building and deploying a Cloud Native Application using a Java/Spring Boot backend and React frontend.

## Architecture
The application uses:
- Spring Boot backend with Oracle Database connectivity
- React JS frontend
- Docker containers for deployment
- Kubernetes for orchestration

## Important Documentation
- [Oracle Wallet Configuration Guide](docs/wallet-configuration.md) - How wallet files are configured across environments

### Requirements
The application requires the following software:
* Java 11+
* Maven
* Node.js and npm
* Docker
* Kubernetes (for deployment)
* Oracle Database (with wallet configuration)

## Oracle Database Connectivity
This application connects to an Oracle Database using wallet files for secure connectivity. See our [Oracle Wallet Configuration Guide](docs/wallet-configuration.md) for details on:
- How wallet files are configured
- Where wallet files are stored
- How to troubleshoot wallet connectivity issues
