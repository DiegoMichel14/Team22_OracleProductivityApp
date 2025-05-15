package com.springboot.MyTodoList.model;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

@Entity
@Table(name = "TAREA_DEVELOPER")
public class TareaDeveloper {

    @EmbeddedId
    private TareaDeveloperId id;

    // Relación con TAREA
    @ManyToOne
    @MapsId("tareaId")
    @JoinColumn(name = "ID_TAREA")
    private Tarea tarea;

    // Relación con DEVELOPER
    @ManyToOne
    @MapsId("developerId")
    @JoinColumn(name = "ID_DEVELOPER")
    private Developer developer;

    // Constructor vacío
    public TareaDeveloper() {
    }

    // Constructor completo
    public TareaDeveloper(Tarea tarea, Developer developer) {
        this.tarea = tarea;
        this.developer = developer;
        this.id = new TareaDeveloperId(tarea.getIdTarea(), developer.getIdDeveloper());
    }

    // Getters y setters
    public TareaDeveloperId getId() {
        return id;
    }

    public void setId(TareaDeveloperId id) {
        this.id = id;
    }

    public Tarea getTarea() {
        return tarea;
    }

    public void setTarea(Tarea tarea) {
        this.tarea = tarea;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }

    @Override
    public String toString() {
        return "TareaDeveloper{" +
                "tareaId=" + (tarea != null ? tarea.getIdTarea() : null) +
                ", developerId=" + (developer != null ? developer.getIdDeveloper() : null) +
                '}';
    }
}