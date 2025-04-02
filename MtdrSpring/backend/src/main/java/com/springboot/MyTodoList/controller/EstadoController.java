package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Estado;
import com.springboot.MyTodoList.service.EstadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EstadoController {

    @Autowired
    private EstadoService estadoService;

    // Obtener todos los estados
    @GetMapping(value = "/estados")
    public List<Estado> getAllEstados() {
        return estadoService.findAll();
    }

    // Obtener el estado de una tarea por ID_TAREA
    @GetMapping(value = "/estados/{idTarea}")
    public ResponseEntity<Estado> getEstadoById(@PathVariable int idTarea) {
        return estadoService.getEstadoById(idTarea);
    }

    // Agregar un nuevo estado
    @PostMapping(value = "/estados")
    public ResponseEntity addEstado(@RequestBody Estado estado) {
        Estado e = estadoService.addEstado(estado);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + e.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    // Actualizar el estado de una tarea existente
    @PutMapping(value = "/estados/{idTarea}")
    public ResponseEntity updateEstado(@PathVariable int idTarea, @RequestBody Estado estado) {
        Estado updated = estadoService.updateEstado(idTarea, estado);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar el estado de una tarea
    @DeleteMapping(value = "/estados/{idTarea}")
    public ResponseEntity<Boolean> deleteEstado(@PathVariable int idTarea) {
        boolean flag = estadoService.deleteEstado(idTarea);
        return flag ? new ResponseEntity<>(true, HttpStatus.OK)
                    : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }
}