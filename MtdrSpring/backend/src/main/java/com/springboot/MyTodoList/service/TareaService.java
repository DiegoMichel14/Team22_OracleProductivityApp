package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service 
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    public List<Tarea> findAll(){
        return tareaRepository.findAll();
    }

    public ResponseEntity<Tarea> getTareaById(int id){
        Optional<Tarea> tareaData = tareaRepository.findById(id);
        if (tareaData.isPresent()){
            return new ResponseEntity<>(tareaData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Tarea addTarea(Tarea tarea){
        return tareaRepository.save(tarea);
    }

    public Tarea updateTarea(int id, Tarea t){
        Optional<Tarea> tareaData = tareaRepository.findById(id);
        if(tareaData.isPresent()){
            Tarea tarea = tareaData.get();
            tarea.setNombreTarea(t.getNombreTarea());
            tarea.setFechaRegistro(t.getFechaRegistro());
            tarea.setFechaFin(t.getFechaFin());
            tarea.setHorasEstimadas(t.getHorasEstimadas());
            tarea.setHorasReales(t.getHorasReales());
            tarea.setSprint(t.getSprint());
            return tareaRepository.save(tarea);
        } else {
            return null;
        }
    }

    public boolean deleteTarea(int id){
        try {
            tareaRepository.deleteById(id);
            return true;
        } catch(Exception e){
            return false;
        }
    }
}