package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SprintController {

    @Autowired
    private SprintService sprintService;

    // Obtener todos los sprints
    @GetMapping(value = "/sprints")
    public List<Sprint> getAllSprints(){
        return sprintService.findAll();
    }

    // Obtener un sprint por ID
    @GetMapping(value = "/sprints/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable int id){
        return sprintService.getSprintById(id);
    }

    // Agregar un nuevo sprint
    @PostMapping(value = "/sprints")
    public ResponseEntity addSprint(@RequestBody Sprint sprint) {
        Sprint s = sprintService.addSprint(sprint);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + s.getIdSprint());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    // Actualizar un sprint existente
    @PutMapping(value = "/sprints/{id}")
    public ResponseEntity updateSprint(@PathVariable int id, @RequestBody Sprint sprint) {
        Sprint updatedSprint = sprintService.updateSprint(id, sprint);
        if(updatedSprint != null){
            return new ResponseEntity<>(updatedSprint, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un sprint
    @DeleteMapping(value = "/sprints/{id}")
    public ResponseEntity<Boolean> deleteSprint(@PathVariable int id) {
        boolean flag = sprintService.deleteSprint(id);
        return flag ? new ResponseEntity<>(true, HttpStatus.OK)
                    : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }
}