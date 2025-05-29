package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    public List<Sprint> findAll(){
        return sprintRepository.findAll();
    }

    public ResponseEntity<Sprint> getSprintById(int id){
        Optional<Sprint> sprintData = sprintRepository.findById(id);
        if(sprintData.isPresent()){
            return new ResponseEntity<>(sprintData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Sprint addSprint(Sprint sprint){
        return sprintRepository.save(sprint);
    }

    public Sprint updateSprint(int id, Sprint sprintNuevo){
        Optional<Sprint> sprintData = sprintRepository.findById(id);
        if(sprintData.isPresent()){
            Sprint sprint = sprintData.get();
            sprint.setNombre(sprintNuevo.getNombre());
            sprint.setFechaInicio(sprintNuevo.getFechaInicio());
            sprint.setFechaFin(sprintNuevo.getFechaFin());
            return sprintRepository.save(sprint);
        } else {
            return null;
        }
    }

    public boolean deleteSprint(int id){
        try{
            sprintRepository.deleteById(id);
            return true;
        } catch(Exception e){
            return false;
        }
    }
}