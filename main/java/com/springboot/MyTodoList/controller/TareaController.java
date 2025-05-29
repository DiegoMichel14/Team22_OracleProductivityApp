package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TareaController {

    @Autowired
    private TareaService tareaService;

    // Obtener todas las tareas
    @GetMapping(value = "/tareas")
    public List<Tarea> getAllTareas(){
        return tareaService.findAll();
    }

    // Obtener una tarea por ID
    @GetMapping(value = "/tareas/{id}")
    public ResponseEntity<Tarea> getTareaById(@PathVariable int id){
        return tareaService.getTareaById(id);
    }

    // Agregar una nueva tarea
    @PostMapping(value = "/tareas")
    public ResponseEntity addTarea(@RequestBody Tarea tarea) {
        Tarea t = tareaService.addTarea(tarea);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + t.getIdTarea());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    // Actualizar una tarea existente
    @PutMapping(value = "/tareas/{id}")
    public ResponseEntity updateTarea(@PathVariable int id, @RequestBody Tarea tarea){
        Tarea updatedTarea = tareaService.updateTarea(id, tarea);
        if(updatedTarea != null){
            return new ResponseEntity<>(updatedTarea, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar una tarea
    @DeleteMapping(value = "/tareas/{id}")
    public ResponseEntity<Boolean> deleteTarea(@PathVariable int id){
        boolean flag = tareaService.deleteTarea(id);
        return flag ? new ResponseEntity<>(true, HttpStatus.OK) : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }
}