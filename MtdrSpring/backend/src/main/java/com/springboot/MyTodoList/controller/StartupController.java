package com.springboot.MyTodoList.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StartupController {
    
    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Oracle Productivity App - Spring Boot application is running");
        response.put("timestamp", System.currentTimeMillis());
        response.put("version", "1.0");
        return response;
    }
    
    @GetMapping("/status")
    public Map<String, Object> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("applicationStatus", "RUNNING");
        response.put("serverPort", System.getProperty("server.port", "8080"));
        response.put("javaVersion", System.getProperty("java.version"));
        response.put("springBootVersion", "2.x");
        response.put("timestamp", System.currentTimeMillis());
        
        // Environment variables for debugging
        Map<String, String> envVars = new HashMap<>();
        envVars.put("TNS_ADMIN", System.getenv("TNS_ADMIN"));
        envVars.put("db_url", System.getenv("db_url") != null ? "[CONFIGURED]" : "[NOT SET]");
        envVars.put("db_user", System.getenv("db_user") != null ? "[CONFIGURED]" : "[NOT SET]");
        envVars.put("db_password", System.getenv("db_password") != null ? "[CONFIGURED]" : "[NOT SET]");
        
        response.put("environment", envVars);
        return response;
    }
}
