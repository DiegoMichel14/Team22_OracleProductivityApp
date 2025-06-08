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
    Logger logger = LoggerFactory.getLogger(DbSettings.class);
    @Autowired
    private DbSettings dbSettings;
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
            // Fall back to application.properties (local testing)
            ds.setDriverType(dbSettings.getDriver_class_name());
            logger.info("Using Driver from properties: " + dbSettings.getDriver_class_name());
            ds.setURL(dbSettings.getUrl());
            logger.info("Using URL from properties: " + dbSettings.getUrl());
            ds.setUser(dbSettings.getUsername());
            logger.info("Using Username from properties: " + dbSettings.getUsername());
            ds.setPassword(dbSettings.getPassword());
            logger.info("Database configuration loaded from application.properties");
        }
        
        return ds;
    }
}
