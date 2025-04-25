package com.springboot.MyTodoList.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.repository.SprintRepository;
import com.springboot.MyTodoList.repository.TareaDeveloperRepository;
import com.springboot.MyTodoList.model.TareaDeveloper;
import com.springboot.MyTodoList.model.Estado;
import com.springboot.MyTodoList.repository.EstadoRepository;
import java.util.concurrent.atomic.AtomicReference;


@Service
public class ReporteService {

    @Autowired
    private SprintRepository sprintRepository;
    @Autowired
    private TareaDeveloperRepository tareaDeveloperRepository;
    @Autowired
    private EstadoRepository estadoRepository; 


    // Reporte de Tareas completadas por Sprint
    public List<Object[]> getTareasCompletadasPorSprint() {
        return sprintRepository.findAll().stream()
            .flatMap(sprint -> sprint.getTareas().stream()
                .filter(t -> t.getHorasReales() != null)
                .map(t -> new Object[]{
                    t.getNombreTarea(),
                    t.getHorasEstimadas(),
                    t.getHorasReales()
                }))
            .collect(Collectors.toList());
    }
    

    // KPI: Horas trabajadas y tareas completadas por equipo
    public List<Object[]> getKPIEquipoPorSprint() {
        double costoPorHora = 25.0;
        AtomicReference<Double> productividadInicial = new AtomicReference<>(0.0);

        return sprintRepository.findAll().stream()
            .sorted((s1, s2) -> s1.getNombre().compareTo(s2.getNombre())) // Ordenar los sprints
            .map(sprint -> {
                long tareasCompletadas = sprint.getTareas().stream()
                    .filter(t -> t.getEstado() != null && t.getEstado().getEstado().equalsIgnoreCase("Completada"))
                    .count();

                double horasReales = sprint.getTareas().stream()
                    .mapToDouble(t -> t.getHorasReales() != null ? t.getHorasReales() : 0).sum();

                // Nueva productividad
                double nuevaProductividad = tareasCompletadas > 0 ? tareasCompletadas / horasReales : 0;

                // Cálculo del aumento de productividad
                double aumentoProductividad = productividadInicial.get() > 0
                    ? ((nuevaProductividad - productividadInicial.get()) / productividadInicial.get()) * 100
                    : 0;

                // Actualizar productividad inicial para el siguiente sprint
                productividadInicial.set(nuevaProductividad);

                return new Object[]{
                    sprint.getNombre(),
                    sprint.getTareas().stream()
                        .mapToDouble(t -> t.getHorasEstimadas() != null ? t.getHorasEstimadas() : 0).sum(),
                    horasReales,
                    tareasCompletadas,
                    sprint.getTareas().stream()
                        .mapToDouble(t -> t.getHorasReales() != null ? t.getHorasReales() * costoPorHora : 0).sum(),
                    nuevaProductividad,
                    aumentoProductividad
                };
            })
            .collect(Collectors.toList());
    }



    
    public List<Object[]> getTareasCompletadasPorDesarrollador() {
        return tareaDeveloperRepository.findAll().stream()
            .filter(td -> td.getTarea().getEstado() != null && td.getTarea().getEstado().getEstado().equalsIgnoreCase("Completada")) // Filtra tareas completadas
            .collect(Collectors.groupingBy(td -> td.getTarea().getSprint().getNombre() + "-" + td.getDeveloper().getNombre(), Collectors.counting())) // Agrupa por Sprint y Desarrollador
            .entrySet().stream()
            .map(entry -> {
                String[] sprintDev = entry.getKey().split("-"); // Separar Sprint y Developer
                return new Object[]{ sprintDev[0], sprintDev[1], entry.getValue() };
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
