package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Equipo;
import com.springboot.MyTodoList.service.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EquipoController {

    @Autowired
    private EquipoService equipoService;

    // Obtener todos los equipos
    @GetMapping(value = "/equipos")
    public List<Equipo> getAllEquipos(){
        return equipoService.findAll();
    }

    // Obtener un equipo por ID
    @GetMapping(value = "/equipos/{id}")
    public ResponseEntity<Equipo> getEquipoById(@PathVariable int id){
        return equipoService.getEquipoById(id);
    }

    // Agregar un nuevo equipo
    @PostMapping(value = "/equipos")
    public ResponseEntity addEquipo(@RequestBody Equipo equipo) {
        Equipo e = equipoService.addEquipo(equipo);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + e.getIdEquipo());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    // Actualizar un equipo existente
    @PutMapping(value = "/equipos/{id}")
    public ResponseEntity updateEquipo(@PathVariable int id, @RequestBody Equipo equipo) {
        Equipo updatedEquipo = equipoService.updateEquipo(id, equipo);
        if(updatedEquipo != null){
            return new ResponseEntity<>(updatedEquipo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un equipo
    @DeleteMapping(value = "/equipos/{id}")
    public ResponseEntity<Boolean> deleteEquipo(@PathVariable int id) {
        boolean flag = equipoService.deleteEquipo(id);
        return flag ? new ResponseEntity<>(true, HttpStatus.OK)
                    : new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }
}