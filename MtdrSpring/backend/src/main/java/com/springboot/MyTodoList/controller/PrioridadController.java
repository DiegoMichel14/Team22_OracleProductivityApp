package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Prioridad;
import com.springboot.MyTodoList.service.PrioridadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PrioridadController {

    @Autowired
    private PrioridadService prioridadService;

    // Obtener todas las prioridades
    @GetMapping(value = "/prioridades")
    public List<Prioridad> getAllPrioridades() {
        return prioridadService.findAll();
    }

    // Obtener la prioridad de una tarea por ID_TAREA
    @GetMapping(value = "/prioridades/{idTarea}")
    public ResponseEntity<Prioridad> getPrioridadById(@PathVariable int idTarea) {
        return prioridadService.getPrioridadById(idTarea);
    }

    // Agregar una nueva prioridad
    @PostMapping(value = "/prioridades")
    public ResponseEntity addPrioridad(@RequestBody Prioridad prioridad) {
        Prioridad p = prioridadService.addPrioridad(prioridad);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + p.getTarea().getIdTarea());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    // Actualizar la prioridad de una tarea existente
    @PutMapping(value = "/prioridades/{idTarea}")
    public ResponseEntity updatePrioridad(@PathVariable int idTarea, @RequestBody Prioridad prioridad) {
        Prioridad updated = prioridadService.updatePrioridad(idTarea, prioridad);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar la prioridad de una tarea
    @DeleteMapping(value = "/prioridades/{idTarea}")
    public ResponseEntity<Boolean> deletePrioridad(@PathVariable int idTarea) {
        boolean flag = prioridadService.deletePrioridad(idTarea);
        return flag ? new ResponseEntity<>(true, HttpStatus.OK)
                    : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }
}