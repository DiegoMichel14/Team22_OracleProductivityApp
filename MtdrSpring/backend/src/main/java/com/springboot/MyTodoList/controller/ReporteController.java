package com.springboot.MyTodoList.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.springboot.MyTodoList.service.ReporteService;

@RestController
@RequestMapping("/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    /**
     * GET /reportes/tareas-completadas
     */
    @GetMapping("/tareas-completadas")
    public List<Object[]> getTareasCompletadas() {
        return reporteService.getTareasCompletadasPorSprint();
    }

    /**
     * GET /reportes/kpi-equipo
     */
    @GetMapping("/kpi-equipo")
    public List<Object[]> getKPIEquipo() {
        return reporteService.getKPIEquipoPorSprint();
    }

    /**
     * GET /reportes/costo
     */
    @GetMapping("/costo")
    public double getCostoDesarrollo() {
        return reporteService.calcularCostoDesarrollo();
    }

    /**
     * GET /reportes/tareas-por-desarrollador
     */
    @GetMapping("/tareas-por-desarrollador")
    public List<Object[]> getTareasPorDesarrollador() {
        return reporteService.getTareasCompletadasPorDesarrollador();
    }

    @GetMapping("/horas-por-sprint")
    public List<Object[]> getHorasPorSprint() {
        return reporteService.getHorasTrabajadasPorSprint();
    }

    @GetMapping("/horas-por-developer")
    public List<Object[]> getHorasPorDeveloper() {
        return reporteService.getHorasPorDeveloperPorSprint();
    }


}