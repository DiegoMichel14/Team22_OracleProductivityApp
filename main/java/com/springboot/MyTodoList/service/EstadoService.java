package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Estado;
import com.springboot.MyTodoList.repository.EstadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class EstadoService {

    @Autowired
    private EstadoRepository estadoRepository;

    public List<Estado> findAll() {
        return estadoRepository.findAll();
    }

    public ResponseEntity<Estado> getEstadoById(int idTarea) {
        Optional<Estado> estadoOpt = estadoRepository.findById(idTarea);
        if (estadoOpt.isPresent()) {
            return new ResponseEntity<>(estadoOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public Estado addEstado(Estado estado) {
        return estadoRepository.save(estado);
    }

    public Estado updateEstado(int idTarea, Estado updatedEstado) {
        Optional<Estado> estadoOpt = estadoRepository.findById(idTarea);
        if (estadoOpt.isPresent()) {
            Estado existingEstado = estadoOpt.get();
            // Se actualiza el valor del estado
            existingEstado.setEstado(updatedEstado.getEstado());
            return estadoRepository.save(existingEstado);
        } else {
            return null;
        }
    }

    public boolean deleteEstado(int idTarea) {
        try {
            estadoRepository.deleteById(idTarea);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}