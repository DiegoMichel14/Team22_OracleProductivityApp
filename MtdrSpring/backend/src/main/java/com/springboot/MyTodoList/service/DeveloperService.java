package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Developer;
import com.springboot.MyTodoList.repository.DeveloperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeveloperService {

    @Autowired
    private DeveloperRepository developerRepository;

    public List<Developer> findAll() {
        return developerRepository.findAll();
    }

    public ResponseEntity<Developer> getDeveloperById(int id) {
        Optional<Developer> developerData = developerRepository.findById(id);
        if (developerData.isPresent()) {
            return new ResponseEntity<>(developerData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Developer addDeveloper(Developer developer) {
        return developerRepository.save(developer);
    }

    public Developer updateDeveloper(int id, Developer dev) {
        Optional<Developer> developerData = developerRepository.findById(id);
        if (developerData.isPresent()) {
            Developer developer = developerData.get();
            developer.setNombre(dev.getNombre());
            developer.setApellidoPaterno(dev.getApellidoPaterno());
            developer.setApellidoMaterno(dev.getApellidoMaterno());
            developer.setEquipo(dev.getEquipo()); // Se actualiza la relación con Equipo
            developer.setEsManager(dev.isEsManager());
            return developerRepository.save(developer);
        } else {
            return null;
        }
    }

    public boolean deleteDeveloper(int id) {
        try {
            developerRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
