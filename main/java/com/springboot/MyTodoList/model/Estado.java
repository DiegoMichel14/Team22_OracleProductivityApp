package com.springboot.MyTodoList.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "ESTADO")
public class Estado {

    @Id
    @Column(name = "ID_TAREA", nullable = false)
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ID_TAREA", nullable = false)
    @JsonBackReference
    private Tarea tarea;

    @Column(name = "ESTADO", length = 20, nullable = false)
    private String estado;

    public Estado() {
    }

    public Estado(Tarea tarea, String estado) {
        this.tarea = tarea;
        this.id = tarea.getIdTarea();
        this.setEstado(estado);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Tarea getTarea() {
        return tarea;
    }

    public void setTarea(Tarea tarea) {
        this.tarea = tarea;
        this.id = tarea != null ? tarea.getIdTarea() : null;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        if (!estado.equals("Pendiente")
         && !estado.equals("En progreso")
         && !estado.equals("Completada")) {
            throw new IllegalArgumentException(
                "El estado debe ser: Pendiente, En progreso o Completada"
            );
        }
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Estado{" +
                "id=" + id +
                ", estado='" + estado + '\'' +
                '}';
    }
}