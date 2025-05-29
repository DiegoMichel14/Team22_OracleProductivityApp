package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Manager;
import com.springboot.MyTodoList.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    // Obtener todos los managers
    @GetMapping(value = "/managers")
    public List<Manager> getAllManagers() {
        return managerService.findAll();
    }

    // Obtener un manager por llave compuesta
    @GetMapping(value = "/managers/{developerId}/{equipoId}")
    public ResponseEntity<Manager> getManagerById(@PathVariable Integer developerId, @PathVariable Integer equipoId) {
        return managerService.getManagerById(developerId, equipoId);
    }

    // Agregar un nuevo manager
    @PostMapping(value = "/managers")
    public ResponseEntity addManager(@RequestBody Manager manager) {
        Manager m = managerService.addManager(manager);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", m.getId().getDeveloperId() + "/" + m.getId().getEquipoId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    // Actualizar un manager existente
    @PutMapping(value = "/managers/{developerId}/{equipoId}")
    public ResponseEntity updateManager(@PathVariable Integer developerId, @PathVariable Integer equipoId, @RequestBody Manager manager) {
        Manager updated = managerService.updateManager(developerId, equipoId, manager);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un manager
    @DeleteMapping(value = "/managers/{developerId}/{equipoId}")
    public ResponseEntity<Boolean> deleteManager(@PathVariable Integer developerId, @PathVariable Integer equipoId) {
        boolean flag = managerService.deleteManager(developerId, equipoId);
        return flag ? new ResponseEntity<>(true, HttpStatus.OK)
                    : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }
}