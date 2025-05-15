package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
<<<<<<< HEAD
import java.time.LocalDate;
=======
import com.fasterxml.jackson.annotation.JsonManagedReference;
>>>>>>> Metricas-Vistas

@Entity
@Table(name = "TAREA")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TAREA", nullable = false)
    private Integer idTarea;

    @Column(name = "NOMBRE_TAREA", length = 200, nullable = false)
    private String nombreTarea;

    @Column(name = "FECHA_REGISTRO", nullable = false)
    private LocalDate fechaRegistro;

    @Column(name = "FECHA_FIN", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "HORAS_ESTIMADAS", nullable = false)
    private Double horasEstimadas;

    @Column(name = "HORAS_REALES")
    private Double horasReales;

    @ManyToOne
    @JoinColumn(name = "ID_SPRINT", nullable = false)
    @JsonBackReference
    private Sprint sprint;

<<<<<<< HEAD
    @OneToOne(mappedBy = "tarea") // Relación con Estado
    private Estado estado;

    // Constructor vacío
    public Tarea() {}

    // Constructor completo
    public Tarea(Integer idTarea, String nombreTarea, LocalDate fechaRegistro, LocalDate fechaFin,
                 Double horasEstimadas, Double horasReales, Sprint sprint, Estado estado) {
=======
    @OneToOne(mappedBy = "tarea", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Estado estado;

    public Tarea() {
    }

    public Tarea(Integer idTarea,
                 String nombreTarea,
                 LocalDate fechaRegistro,
                 LocalDate fechaFin,
                 Double horasEstimadas,
                 Double horasReales,
                 Sprint sprint,
                 Estado estado) {
>>>>>>> Metricas-Vistas
        this.idTarea = idTarea;
        this.nombreTarea = nombreTarea;
        this.fechaRegistro = fechaRegistro;
        this.fechaFin = fechaFin;
        this.horasEstimadas = horasEstimadas;
        this.horasReales = horasReales;
        this.sprint = sprint;
        this.estado = estado;
    }

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

    public Double getHorasEstimadas() {
        return horasEstimadas;
    }

    public void setHorasEstimadas(Double horasEstimadas) {
        this.horasEstimadas = horasEstimadas;
    }

    public Double getHorasReales() {
        return horasReales;
    }

    public void setHorasReales(Double horasReales) {
        this.horasReales = horasReales;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Tarea{" +
                "idTarea=" + idTarea +
                ", nombreTarea='" + nombreTarea + '\'' +
                ", fechaRegistro=" + fechaRegistro +
                ", fechaFin=" + fechaFin +
                ", horasEstimadas=" + horasEstimadas +
                ", horasReales=" + horasReales +
<<<<<<< HEAD
                ", sprint=" + sprint +
                ", estado=" + (estado != null ? estado.getEstado() : "Sin estado") +
=======
>>>>>>> Metricas-Vistas
                '}';
    }
}
