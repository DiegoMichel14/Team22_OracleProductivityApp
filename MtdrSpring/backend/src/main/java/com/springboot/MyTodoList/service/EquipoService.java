package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Equipo;
import com.springboot.MyTodoList.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipoService {

    @Autowired
    private EquipoRepository equipoRepository;

    // Retorna todos los equipos
    public List<Equipo> findAll(){
        return equipoRepository.findAll();
    }

    // Retorna un equipo por su ID
    public ResponseEntity<Equipo> getEquipoById(int id){
        Optional<Equipo> equipoData = equipoRepository.findById(id);
        if(equipoData.isPresent()){
            return new ResponseEntity<>(equipoData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Agrega un nuevo equipo
    public Equipo addEquipo(Equipo equipo){
        return equipoRepository.save(equipo);
    }

    // Actualiza un equipo existente
    public Equipo updateEquipo(int id, Equipo equipoNuevo){
        Optional<Equipo> equipoData = equipoRepository.findById(id);
        if(equipoData.isPresent()){
            Equipo equipo = equipoData.get();
            equipo.setNombreEquipo(equipoNuevo.getNombreEquipo());
            return equipoRepository.save(equipo);
        } else {
            return null;
        }
    }

    // Elimina un equipo por su ID
    public boolean deleteEquipo(int id){
        try{
            equipoRepository.deleteById(id);
            return true;
        } catch(Exception e){
            return false;
        }
    }
}
