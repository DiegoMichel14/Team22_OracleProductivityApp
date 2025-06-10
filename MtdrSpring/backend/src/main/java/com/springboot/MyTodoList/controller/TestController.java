package com.springboot.MyTodoList.controller;
import java.sql.Connection;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @Autowired
    private DataSource dataSource;
    
    @GetMapping("/test-db")
    public ResponseEntity<String> testDB() {
        try {
            Connection conn = dataSource.getConnection();
            boolean isValid = conn.isValid(5);
            conn.close();
            return ResponseEntity.ok("DB Connection: " + (isValid ? "✅ OK" : "❌ FAILED"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("DB Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/test-simple")
    public ResponseEntity<String> testSimple() {
        return ResponseEntity.ok("✅ Backend funcionando correctamente!");
    }
}