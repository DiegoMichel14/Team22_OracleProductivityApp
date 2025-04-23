package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private SprintRepository sprintRepository;

    // Reporte de Tareas completadas por Sprint
    public List<Object[]> getTareasCompletadasPorSprint() {
        return sprintRepository.findAll().stream()
            .map(sprint -> new Object[]{
                sprint.getNombre(),
                sprint.getTareas().stream()
                    .filter(t -> t.getHorasReales() != null)
                    .collect(Collectors.toList())
            })
            .collect(Collectors.toList());
    }

    // KPI: Horas trabajadas y tareas completadas por equipo
    public List<Object[]> getKPIEquipoPorSprint() {
        return sprintRepository.findAll().stream()
            .map(sprint -> new Object[]{
                sprint.getNombre(),
                sprint.getTareas().stream()
                    .mapToDouble(t -> t.getHorasReales() != null ? t.getHorasReales() : 0).sum(),
                sprint.getTareas().size()
            })
            .collect(Collectors.toList());
    }

    // KPI: Cálculo de costos
    public double calcularCostoDesarrollo() {
        double costoPorHora = 25.0;
        return sprintRepository.findAll().stream()
            .flatMap(sprint -> sprint.getTareas().stream())
            .mapToDouble(t -> t.getHorasReales() != null ? t.getHorasReales() * costoPorHora : 0)
            .sum();
    }
}
