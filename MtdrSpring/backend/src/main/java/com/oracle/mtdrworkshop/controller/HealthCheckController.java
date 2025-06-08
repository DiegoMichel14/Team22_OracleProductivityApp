package com.oracle.mtdrworkshop.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthCheckController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> checkDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long startTime = System.nanoTime();
            String result = jdbcTemplate.queryForObject("SELECT 'SUCCESS' FROM dual", String.class);
            long endTime = System.nanoTime();
            long durationMs = TimeUnit.NANOSECONDS.toMillis(endTime - startTime);
            
            response.put("status", "UP");
            response.put("message", "Database connection successful");
            response.put("result", result);
            response.put("responseTimeMs", durationMs);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("message", "Database connection failed");
            response.put("error", e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
    
    @GetMapping("/wallet")
    public ResponseEntity<Map<String, Object>> checkWalletConfiguration() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Boolean> walletStatus = new HashMap<>();
        
        // Check primary wallet path
        String tmpWalletPath = "/tmp/wallet/tnsnames.ora";
        walletStatus.put(tmpWalletPath, checkFileExists(tmpWalletPath));
        
        // Check alternate wallet path
        String mtdrWalletPath = "/mtdrworkshop/creds/tnsnames.ora";
        walletStatus.put(mtdrWalletPath, checkFileExists(mtdrWalletPath));
        
        // Get environment variables
        Map<String, String> envVars = new HashMap<>();
        envVars.put("TNS_ADMIN", System.getenv("TNS_ADMIN"));
        envVars.put("WALLET_LOCATION", System.getenv("WALLET_LOCATION"));
        envVars.put("WALLET_LOCATION_ALT", System.getenv("WALLET_LOCATION_ALT"));
        envVars.put("oracle.net.tns_admin", System.getProperty("oracle.net.tns_admin"));
        envVars.put("oracle.net.wallet_location", System.getProperty("oracle.net.wallet_location"));
        
        response.put("walletFiles", walletStatus);
        response.put("environmentVariables", envVars);
        response.put("status", walletStatus.containsValue(true) ? "UP" : "DOWN");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
    
    private boolean checkFileExists(String path) {
        return new java.io.File(path).canRead();
    }
}
