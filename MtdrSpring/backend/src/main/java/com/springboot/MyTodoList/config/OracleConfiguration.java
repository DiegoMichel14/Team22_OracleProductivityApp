package com.springboot.MyTodoList.config;


import java.sql.SQLException;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import oracle.jdbc.pool.OracleDataSource;
///*
//    This class grabs the appropriate values for OracleDataSource,
//    The method that uses env, grabs it from the environment variables set
//    in the docker container. The method that uses dbSettings is for local testing
//    @author: peter.song@oracle.com
// */
//
//
@Configuration
public class OracleConfiguration {
    Logger logger = LoggerFactory.getLogger(OracleConfiguration.class);
    @Autowired
    private Environment env;
    @Bean
    public DataSource dataSource() throws SQLException{
        OracleDataSource ds = new OracleDataSource();
        
        // Use environment variables if available (for Docker/Kubernetes), otherwise use dbSettings (for local testing)
        String dbUrl = env.getProperty("db_url");
        String dbUser = env.getProperty("db_user"); 
        String dbPassword = env.getProperty("db_password");
        String dbPasswordAlt = env.getProperty("dbpassword"); // Kubernetes uses this name
        String driverClass = env.getProperty("driver_class_name");
        
        // Use dbpassword if db_password is not set (for Kubernetes compatibility)
        if (dbPassword == null && dbPasswordAlt != null) {
            dbPassword = dbPasswordAlt;
        }
        
        if (dbUrl != null && dbUser != null && dbPassword != null) {
            // Use environment variables (Docker/Kubernetes deployment)
            if (driverClass != null) {
                ds.setDriverType(driverClass);
                logger.info("Using Driver from env: " + driverClass);
            }
            ds.setURL(dbUrl);
            logger.info("Using URL from env: " + dbUrl);
            ds.setUser(dbUser);
            logger.info("Using Username from env: " + dbUser);
            ds.setPassword(dbPassword);
            logger.info("Database configuration loaded from environment variables");
        } else {
            // Fall back to Spring Boot properties (local testing)
            String fallbackUrl = env.getProperty("spring.datasource.url");
            String fallbackUser = env.getProperty("spring.datasource.username"); 
            String fallbackPassword = env.getProperty("spring.datasource.password");
            String fallbackDriver = env.getProperty("spring.datasource.driver-class-name");
            
            if (fallbackUrl != null && fallbackUser != null && fallbackPassword != null) {
                if (fallbackDriver != null) {
                    ds.setDriverType(fallbackDriver);
                    logger.info("Using Driver from properties: " + fallbackDriver);
                }
                ds.setURL(fallbackUrl);
                logger.info("Using URL from properties: " + fallbackUrl);
                ds.setUser(fallbackUser);
                logger.info("Using Username from properties: " + fallbackUser);
                ds.setPassword(fallbackPassword);
                logger.info("Database configuration loaded from application.properties");
            } else {
                logger.error("No database configuration found in environment variables or properties!");
                throw new SQLException("Database configuration is missing");
            }
        }
        
        return ds;
    }
}
