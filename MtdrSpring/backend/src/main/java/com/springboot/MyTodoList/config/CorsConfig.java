package com.springboot.MyTodoList.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    Logger logger = LoggerFactory.getLogger(CorsConfig.class);
    
    @Bean  // <-- This was missing!
    public CorsFilter corsFilter(){
        CorsConfiguration config = new CorsConfiguration();
        
        // Add your actual server URL
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://220.158.67.237",      // <-- Add your server
            "http://220.158.67.237:8080", // <-- Add with port too
            "https://220.158.67.237",     // <-- HTTPS version
            "https://objectstorage.us-phoenix-1.oraclecloud.com",
            "https://petstore.swagger.io"
        ));
        
        config.setAllowedMethods(List.of("GET","POST","PUT","OPTIONS","DELETE","PATCH"));
        
        // Remove this line - it was overriding your specific origins!
        // config.setAllowedOrigins(Collections.singletonList("*"));
        
        config.addAllowedHeader("*");
        config.addExposedHeader("location");
        config.setAllowCredentials(true); // <-- Add this for authentication
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        CorsFilter filter = new CorsFilter(source);
        logger.info("CORS filter configured with origins: {}", config.getAllowedOrigins());
        return filter;
    }
}