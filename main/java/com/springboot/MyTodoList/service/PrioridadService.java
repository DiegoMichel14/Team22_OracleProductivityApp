package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Prioridad;
import com.springboot.MyTodoList.repository.PrioridadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrioridadService {

    @Autowired
    private PrioridadRepository prioridadRepository;

    public List<Prioridad> findAll() {
        return prioridadRepository.findAll();
    }

    public ResponseEntity<Prioridad> getPrioridadById(int idTarea) {
        Optional<Prioridad> prioridadOpt = prioridadRepository.findById(idTarea);
        if (prioridadOpt.isPresent()) {
            return new ResponseEntity<>(prioridadOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Prioridad addPrioridad(Prioridad prioridad) {
        return prioridadRepository.save(prioridad);
    }

    public Prioridad updatePrioridad(int idTarea, Prioridad updatedPrioridad) {
        Optional<Prioridad> prioridadOpt = prioridadRepository.findById(idTarea);
        if (prioridadOpt.isPresent()) {
            Prioridad existingPrioridad = prioridadOpt.get();
            // Se actualiza el valor de la prioridad; se asume que la relación con Tarea no cambia.
            existingPrioridad.setPrioridad(updatedPrioridad.getPrioridad());
            return prioridadRepository.save(existingPrioridad);
        } else {
            return null;
        }
    }

    public boolean deletePrioridad(int idTarea) {
        try {
            prioridadRepository.deleteById(idTarea);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
