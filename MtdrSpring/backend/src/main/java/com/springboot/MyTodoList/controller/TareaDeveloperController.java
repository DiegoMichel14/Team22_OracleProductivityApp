package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.TareaDeveloper;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.TareaDeveloperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TareaDeveloperController {

     @Autowired
    private SprintService sprintService; 

    @Autowired
    private TareaDeveloperService tareaDeveloperService;

    // Obtener todas las asociaciones
    @GetMapping(value = "/tarea-developers")
    public List<TareaDeveloper> getAllTareaDevelopers(){
        return tareaDeveloperService.findAll();
    }

    // Obtener una asociación específica por su llave compuesta
    @GetMapping(value = "/tarea-developers/{tareaId}/{developerId}")
    public ResponseEntity<TareaDeveloper> getTareaDeveloperById(
            @PathVariable Integer tareaId,
            @PathVariable Integer developerId){
        return tareaDeveloperService.getTareaDeveloperById(tareaId, developerId);
    }

    // Agregar una nueva asociación
    @PostMapping(value = "/tarea-developers")
    public ResponseEntity addTareaDeveloper(@RequestBody TareaDeveloper tareaDeveloper) {
        TareaDeveloper td = tareaDeveloperService.addTareaDeveloper(tareaDeveloper);
        HttpHeaders responseHeaders = new HttpHeaders();
        // Se puede devolver la llave compuesta en el header "location"
        responseHeaders.set("location", td.getId().getTareaId() + "/" + td.getId().getDeveloperId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    // Actualizar una asociación existente (si es necesario)
    @PutMapping(value = "/tarea-developers/{tareaId}/{developerId}")
    public ResponseEntity updateTareaDeveloper(
            @PathVariable Integer tareaId,
            @PathVariable Integer developerId,
            @RequestBody TareaDeveloper tareaDeveloper) {
        TareaDeveloper updated = tareaDeveloperService.updateTareaDeveloper(tareaId, developerId, tareaDeveloper);
        if(updated != null){
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar una asociación
    @DeleteMapping(value = "/tarea-developers/{tareaId}/{developerId}")
    public ResponseEntity<Boolean> deleteTareaDeveloper(
            @PathVariable Integer tareaId,
            @PathVariable Integer developerId) {
        boolean flag = tareaDeveloperService.deleteTareaDeveloper(tareaId, developerId);
        return flag ? new ResponseEntity<>(true, HttpStatus.OK)
                    : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }

    // Ejemplo para TareaDeveloperController
@GetMapping("/tarea-developers/tareas/{developerId}")
public List<Tarea> getTareasByDeveloperId(@PathVariable Integer developerId) {
    return tareaDeveloperService.findTareasByDeveloperId(developerId);
}

@GetMapping("/sprints/ultimo/developer/{developerId}/tareas")
public List<Tarea> getTareasUltimoSprintByDeveloper(@PathVariable Integer developerId) {
    // Obtener el último sprint (por ID más alto)
    Sprint ultimoSprint = sprintService.findAll()
        .stream()
        .max((s1, s2) -> Integer.compare(s1.getIdSprint(), s2.getIdSprint()))
        .orElse(null);

    if (ultimoSprint == null) {
        return List.of();
    }

    // Obtener todas las tareas del developer
    List<Tarea> tareasDeveloper = tareaDeveloperService.findTareasByDeveloperId(developerId);

    // Filtrar solo las del último sprint
    return tareasDeveloper.stream()
            .filter(t -> t.getSprint() != null && t.getSprint().getIdSprint().equals(ultimoSprint.getIdSprint()))
            .toList();
}
}