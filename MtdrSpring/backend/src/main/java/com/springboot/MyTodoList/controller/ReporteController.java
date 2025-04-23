package com.springboot.MyTodoList.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.service.ReporteService;

@RestController
@RequestMapping("/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/tareas-completadas")
    public List<Object[]> getTareasCompletadas() {
        return reporteService.getTareasCompletadasPorSprint();
    }

    @GetMapping("/kpi-equipo")
    public List<Object[]> getKPIEquipo() {
        return reporteService.getKPIEquipoPorSprint();
    }

    @GetMapping("/costo")
    public double getCostoDesarrollo() {
        return reporteService.calcularCostoDesarrollo();
    }
}
