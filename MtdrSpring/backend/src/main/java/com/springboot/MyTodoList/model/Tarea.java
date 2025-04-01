package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "TAREA")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TAREA")
    private Integer idTarea;

    @Column(name = "NOMBRE_TAREA")
    private String nombreTarea;

    @Column(name = "FECHA_REGISTRO")
    private LocalDate fechaRegistro;

    @Column(name = "FECHA_FIN")
    private LocalDate fechaFin;

    @Column(name = "ESTADO")
    private String estado;

    @Column(name = "PRIORIDAD")
    private String prioridad;

    @Column(name = "HORAS_ESTIMADAS")
    private Double horasEstimadas;

    // Constructor vacío
    public Tarea() {
    }

    // Constructor completo
    public Tarea(Integer idTarea, String nombreTarea, LocalDate fechaRegistro, LocalDate fechaFin, String estado, String prioridad, Double horasEstimadas) {
        this.idTarea = idTarea;
        this.nombreTarea = nombreTarea;
        this.fechaRegistro = fechaRegistro;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.prioridad = prioridad;
        this.horasEstimadas = horasEstimadas;
    }

    // Getters y setters
    public Integer getIdTarea() {
        return idTarea;
    }

    public void setIdTarea(Integer idTarea) {
        this.idTarea = idTarea;
    }

    public String getNombreTarea() {
        return nombreTarea;
    }

    public void setNombreTarea(String nombreTarea) {
        this.nombreTarea = nombreTarea;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public Double getHorasEstimadas() {
        return horasEstimadas;
    }

    public void setHorasEstimadas(Double horasEstimadas) {
        this.horasEstimadas = horasEstimadas;
    }

    @Override
    public String toString() {
        return "Tarea{" +
                "idTarea=" + idTarea +
                ", nombreTarea='" + nombreTarea + '\'' +
                ", fechaRegistro=" + fechaRegistro +
                ", fechaFin=" + fechaFin +
                ", estado='" + estado + '\'' +
                ", prioridad='" + prioridad + '\'' +
                ", horasEstimadas=" + horasEstimadas +
                '}';
    }
}