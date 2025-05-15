package com.springboot.MyTodoList.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
/*
    This class configures CORS, and specifies which methods are allowed
    along with which origins and headers
    @author: peter.song@oracle.com

 */
/*@Configuration
public class CorsConfig {
    Logger logger = LoggerFactory.getLogger(CorsConfig.class);
    public CorsFilter corsFilter(){
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000","https://objectstorage.us-phoenix-1.oraclecloud.com",
                "https://petstore.swagger.io"));
        config.setAllowedMethods(List.of("GET","POST","PUT","OPTIONS","DELETE","PATCH"));
        config.setAllowedOrigins(Collections.singletonList("*"));
        config.addAllowedHeader("*");
        config.addExposedHeader("location");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        CorsFilter filter = new CorsFilter(source);
        return filter;
    }

}*/

@Configuration
public class CorsConfig {
    Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowedOrigins(List.of(
            "http://140.84.170.157", // IP pública de tu backend
            "http://localhost:3000" // Para pruebas locales
        ));


        // Métodos permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));

        // Permitir credenciales (si hay autenticación)
        config.setAllowCredentials(true);

        // Configurar cabeceras permitidas explícitamente
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.addExposedHeader("location");

        // Registrar la configuración CORS en todas las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}