package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Manager;
import com.springboot.MyTodoList.model.ManagerId;
import com.springboot.MyTodoList.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ManagerService {

    @Autowired
    private ManagerRepository managerRepository;

    public List<Manager> findAll() {
        return managerRepository.findAll();
    }

    public ResponseEntity<Manager> getManagerById(Integer developerId, Integer equipoId) {
        ManagerId id = new ManagerId(developerId, equipoId);
        Optional<Manager> managerOpt = managerRepository.findById(id);
        if (managerOpt.isPresent()) {
            return new ResponseEntity<>(managerOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Manager addManager(Manager manager) {
        return managerRepository.save(manager);
    }

    public Manager updateManager(Integer developerId, Integer equipoId, Manager updatedManager) {
        ManagerId id = new ManagerId(developerId, equipoId);
        Optional<Manager> existing = managerRepository.findById(id);
        if (existing.isPresent()) {
            Manager manager = existing.get();
            manager.setDeveloper(updatedManager.getDeveloper());
            manager.setEquipo(updatedManager.getEquipo());
            // Actualizar la llave compuesta 
            manager.setId(new ManagerId(manager.getDeveloper().getIdDeveloper(), manager.getEquipo().getIdEquipo()));
            return managerRepository.save(manager);
        } else {
            return null;
        }
    }

    public boolean deleteManager(Integer developerId, Integer equipoId) {
        try {
            ManagerId id = new ManagerId(developerId, equipoId);
            managerRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
