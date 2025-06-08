package com.springboot.MyTodoList.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Handle static resources
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/static/");
        
        // Handle React Router - forward all non-API routes to index.html
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // If the resource exists, return it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // If it doesn't exist and it's not an API call, return index.html
                        // Exclude all API endpoints from SPA routing
                        if (!resourcePath.startsWith("api/") && 
                            !resourcePath.startsWith("health") && 
                            !resourcePath.startsWith("status") &&
                            !resourcePath.startsWith("todolist") &&
                            !resourcePath.startsWith("developers") &&
                            !resourcePath.startsWith("tareas") &&
                            !resourcePath.startsWith("estados") &&
                            !resourcePath.startsWith("prioridades") &&
                            !resourcePath.startsWith("equipos") &&
                            !resourcePath.startsWith("managers") &&
                            !resourcePath.startsWith("tarea-developers") &&
                            !resourcePath.startsWith("reportes") &&
                            !resourcePath.startsWith("login") &&
                            !resourcePath.contains(".")) { // Exclude file extensions (js, css, etc.)
                            return new ClassPathResource("/static/index.html");
                        }
                        
                        return null;
                    }
                });
    }
}
