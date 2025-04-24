package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Developer;
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.TareaDeveloper;
import com.springboot.MyTodoList.model.TareaDeveloperId;
import com.springboot.MyTodoList.repository.TareaDeveloperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TareaDeveloperService {

    @Autowired
    private TareaDeveloperRepository tareaDeveloperRepository;

    public List<TareaDeveloper> findAll() {
        return tareaDeveloperRepository.findAll();
    }

    public ResponseEntity<TareaDeveloper> getTareaDeveloperById(Integer tareaId, Integer developerId) {
        TareaDeveloperId compositeId = new TareaDeveloperId(tareaId, developerId);
        Optional<TareaDeveloper> td = tareaDeveloperRepository.findById(compositeId);
        if (td.isPresent()){
            return new ResponseEntity<>(td.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public TareaDeveloper addTareaDeveloper(TareaDeveloper tareaDeveloper) {
        return tareaDeveloperRepository.save(tareaDeveloper);
    }

    public TareaDeveloper updateTareaDeveloper(Integer tareaId, Integer developerId, TareaDeveloper updatedTd) {
        TareaDeveloperId compositeId = new TareaDeveloperId(tareaId, developerId);
        Optional<TareaDeveloper> existing = tareaDeveloperRepository.findById(compositeId);
        if(existing.isPresent()){
            TareaDeveloper td = existing.get();
            td.setTarea(updatedTd.getTarea());
            td.setDeveloper(updatedTd.getDeveloper());
            // Actualizamos la llave compuesta de forma consistente
            td.setId(new TareaDeveloperId(td.getTarea().getIdTarea(), td.getDeveloper().getIdDeveloper()));
            return tareaDeveloperRepository.save(td);
        } else {
            return null;
        }
    }

    public boolean deleteTareaDeveloper(Integer tareaId, Integer developerId) {
        try {
            TareaDeveloperId compositeId = new TareaDeveloperId(tareaId, developerId);
            tareaDeveloperRepository.deleteById(compositeId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<Tarea> findTareasByDeveloperId(Integer developerId) {
        List<TareaDeveloper> asociaciones = tareaDeveloperRepository.findByDeveloper_IdDeveloper(developerId);
        return asociaciones.stream()
                .map(TareaDeveloper::getTarea)
                .toList();
    }
}