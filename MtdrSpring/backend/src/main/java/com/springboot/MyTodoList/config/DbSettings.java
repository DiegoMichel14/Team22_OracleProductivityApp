package com.springboot.MyTodoList.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;

@Configuration
@ConfigurationProperties(prefix = "spring.datasource")
public class DbSettings {
    
    private String url;
    private String username;
    private String password;
    private String driver_class_name;
    
    @PostConstruct
    public void init() {
        // FORZAR valores por defecto si están vacíos
        if (url == null || url.trim().isEmpty()) {
            url = "jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet";
            System.out.println("✅ DbSettings: Using DEFAULT URL: " + url);
        } else {
            System.out.println("✅ DbSettings: Using ENV URL: " + url);
        }
        
        if (username == null || username.trim().isEmpty()) {
            username = "TODOUSER";
        }
        
        if (password == null || password.trim().isEmpty()) {
            password = "WELcome__12345";
        }
        
        if (driver_class_name == null || driver_class_name.trim().isEmpty()) {
            driver_class_name = "oracle.jdbc.OracleDriver";
        }
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getDriver_class_name() {
        return driver_class_name;
    }
    
    public void setDriver_class_name(String driver_class_name) {
        this.driver_class_name = driver_class_name;
    }
}