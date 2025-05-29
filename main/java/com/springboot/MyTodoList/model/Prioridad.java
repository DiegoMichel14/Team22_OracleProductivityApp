package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity
@Table(name = "PRIORIDAD")
public class Prioridad {

    // Campo id de tipo Integer que representa la llave primaria
    @Id
    @Column(name = "ID_TAREA", nullable = false)
    private Integer id;

    // Relación one-to-one con Tarea, utilizando el campo 'id' definido arriba
    @OneToOne
    @MapsId
    @JoinColumn(name = "ID_TAREA", nullable = false)
    private Tarea tarea;

    // La prioridad debe ser uno de los valores: "Normal", "Alta" o "Urgente"
    @Column(name = "PRIORIDAD", length = 20, nullable = false)
    private String prioridad;

    // Constructor vacío
    public Prioridad() {
    }

    // Constructor completo
    public Prioridad(Tarea tarea, String prioridad) {
        this.tarea = tarea;
        this.id = tarea.getIdTarea();
        this.prioridad = prioridad;
    }

    // Getters y setters
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

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    @Override
    public String toString() {
        return "Prioridad{" +
                "id=" + id +
                ", prioridad='" + prioridad + '\'' +
                '}';
    }
}