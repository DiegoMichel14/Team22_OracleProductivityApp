package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity
@Table(name = "MANAGER")
public class Manager {

    @EmbeddedId
    private ManagerId id;

    @ManyToOne
    @MapsId("developerId")
    @JoinColumn(name = "ID_DEVELOPER", nullable = false)
    private Developer developer;

    @ManyToOne
    @MapsId("equipoId")
    @JoinColumn(name = "ID_EQUIPO", nullable = false)
    private Equipo equipo;

    // Constructor vacío
    public Manager() {
    }

    // Constructor completo
    public Manager(Developer developer, Equipo equipo) {
        this.developer = developer;
        this.equipo = equipo;
        this.id = new ManagerId(developer.getIdDeveloper(), equipo.getIdEquipo());
    }

    // Getters y setters
    public ManagerId getId() {
        return id;
    }

    public void setId(ManagerId id) {
        this.id = id;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    @Override
    public String toString() {
        return "Manager{" +
                "developerId=" + (developer != null ? developer.getIdDeveloper() : null) +
                ", equipoId=" + (equipo != null ? equipo.getIdEquipo() : null) +
                '}';
    }
}