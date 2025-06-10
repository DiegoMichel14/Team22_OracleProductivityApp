package com.springboot.MyTodoList.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spring.datasource")
public class DbSettings {
    
    // Valores por defecto en caso de que las variables de entorno estén vacías
    private String url = "jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet";
    private String username = "TODOUSER";
    private String password = "WELcome__12345";
    private String driver_class_name = "oracle.jdbc.OracleDriver";
    
    public String getUrl() {
        // Si la URL está vacía, usa el valor por defecto
        return (url == null || url.trim().isEmpty()) ? 
            "jdbc:oracle:thin:@reacttodoia9ge_tp?TNS_ADMIN=/tmp/wallet" : url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getUsername() {
        return (username == null || username.trim().isEmpty()) ? "TODOUSER" : username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return (password == null || password.trim().isEmpty()) ? "WELcome__12345" : password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getDriver_class_name() {
        return (driver_class_name == null || driver_class_name.trim().isEmpty()) ? 
            "oracle.jdbc.OracleDriver" : driver_class_name;
    }
    
    public void setDriver_class_name(String driver_class_name) {
        this.driver_class_name = driver_class_name;
    }
}