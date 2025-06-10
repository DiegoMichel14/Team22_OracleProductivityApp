package com.springboot.MyTodoList.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.Developer;
import com.springboot.MyTodoList.service.DeveloperService;

@RestController
public class DeveloperController { 

    @Autowired
    private DeveloperService developerService;

    // Obtener todos los developers
    @GetMapping(value = "/developers")
    public List<Developer> getAllDevelopers(){
        return developerService.findAll();
    }

    // Obtener un developer por ID
    @GetMapping(value = "/developers/{id}")
    public ResponseEntity<Developer> getDeveloperById(@PathVariable int id){
        return developerService.getDeveloperById(id);
    }

    // Agregar un nuevo developer
    @PostMapping(value = "/developers")
    public ResponseEntity addDeveloper(@RequestBody Developer developer) {
        Developer dev = developerService.addDeveloper(developer);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dev.getIdDeveloper());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    // Actualizar un developer existente
    @PutMapping(value = "/developers/{id}")
    public ResponseEntity updateDeveloper(@PathVariable int id, @RequestBody Developer developer) {
        Developer updatedDeveloper = developerService.updateDeveloper(id, developer);
        if(updatedDeveloper != null){
            return new ResponseEntity<>(updatedDeveloper, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un developer
    @DeleteMapping(value = "/developers/{id}")
    public ResponseEntity<Boolean> deleteDeveloper(@PathVariable int id) {
        boolean flag = developerService.deleteDeveloper(id);
        return flag ? new ResponseEntity<>(true, HttpStatus.OK)
                    : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }


    // Obtener un developer por teléfono y contraseña
    @GetMapping(value = "/login")
    public ResponseEntity<Developer> login(@RequestParam String telefono, @RequestParam String contrasena) {
        try {
            System.out.println("🔍 Login attempt - telefono: " + telefono + ", contrasena: " + contrasena);
            
            // Test básico de conexión antes del login
            System.out.println("🔍 Testing service availability...");
            
            Developer developer = developerService.findByTelefonoAndContrasena(telefono, contrasena);
            
            if (developer != null) {
                System.out.println("✅ Login successful for: " + telefono);
                return ResponseEntity.ok(developer);
            } else {
                System.out.println("❌ Login failed - no user found for telefono: " + telefono);
                return ResponseEntity.status(401).body(null);
            }
        } catch (Exception e) {
            System.err.println("💥 Login error for telefono " + telefono + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}