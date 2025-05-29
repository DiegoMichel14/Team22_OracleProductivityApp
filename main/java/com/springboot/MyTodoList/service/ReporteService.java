package com.springboot.MyTodoList.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.repository.SprintRepository;
import com.springboot.MyTodoList.repository.TareaDeveloperRepository;

@Service
public class ReporteService {

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private TareaDeveloperRepository tareaDeveloperRepository;

    /**
     * Reporte de tareas completadas por sprint.
     */
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

    /**
     * KPI de equipo por sprint:
     * [ sprint, sumaHorasEstimadas, sumaHorasReales, numTareas, costoTotal, productividad, %aumento ]
     */
    public List<Object[]> getKPIEquipoPorSprint() {
        double costoPorHora = 25.0;
        AtomicReference<Double> productividadInicial = new AtomicReference<>(0.0);

        return sprintRepository.findAll().stream()
            .sorted((s1, s2) -> s1.getNombre().compareTo(s2.getNombre()))
            .map(sprint -> {
                long tareasCompletadas = sprint.getTareas().stream()
                    .filter(t -> t.getEstado() != null 
                              && "Completada".equalsIgnoreCase(t.getEstado().getEstado()))
                    .count();
                double horasEstimadas = sprint.getTareas().stream()
                    .mapToDouble(t -> t.getHorasEstimadas() != null ? t.getHorasEstimadas() : 0)
                    .sum();
                double horasReales = sprint.getTareas().stream()
                    .mapToDouble(t -> t.getHorasReales() != null ? t.getHorasReales() : 0)
                    .sum();
                double costoTotal = sprint.getTareas().stream()
                    .mapToDouble(t -> t.getHorasReales() != null 
                                    ? t.getHorasReales() * costoPorHora 
                                    : 0)
                    .sum();

                double nuevaProductividad = tareasCompletadas > 0 
                    ? tareasCompletadas / horasReales 
                    : 0;
                double aumentoProductividad = productividadInicial.get() > 0
                    ? ((nuevaProductividad - productividadInicial.get())
                       / productividadInicial.get()) * 100
                    : 0;
                productividadInicial.set(nuevaProductividad);

                return new Object[]{
                    sprint.getNombre(),
                    horasEstimadas,
                    horasReales,
                    tareasCompletadas,
                    costoTotal,
                    nuevaProductividad,
                    aumentoProductividad
                };
            })
            .collect(Collectors.toList());
    }

    /**
     * Tareas completadas agrupadas por sprint y desarrollador.
     * Cada Object[] = [ sprint, developer, count ]
     */
    public List<Object[]> getTareasCompletadasPorDesarrollador() {
        return tareaDeveloperRepository.findAll().stream()
            .filter(td -> td.getTarea().getEstado() != null 
                       && "Completada".equalsIgnoreCase(td.getTarea().getEstado().getEstado()))
            .collect(Collectors.groupingBy(
                td -> td.getTarea().getSprint().getNombre()
                     + "-" + td.getDeveloper().getNombre(),
                Collectors.counting()
            ))
            .entrySet().stream()
            .map(entry -> {
                String[] parts = entry.getKey().split("-", 2);
                return new Object[]{ parts[0], parts[1], entry.getValue() };
            })
            .collect(Collectors.toList());
    }

    /**
     * Cálculo de costo total de desarrollo.
     */
    public double calcularCostoDesarrollo() {
        double costoPorHora = 25.0;
        return sprintRepository.findAll().stream()
            .flatMap(sprint -> sprint.getTareas().stream())
            .mapToDouble(t -> t.getHorasReales() != null 
                            ? t.getHorasReales() * costoPorHora 
                            : 0)
            .sum();
    }
}