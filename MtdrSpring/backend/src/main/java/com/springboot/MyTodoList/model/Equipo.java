package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity 
@Table(name = "EQUIPO")
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_EQUIPO")
    private Integer idEquipo;

    @Column(name = "NOMBRE_EQUIPO")
    private String nombreEquipo;

    // Constructor vacío
    public Equipo() {
    }

    // Constructor completo (opcional)
    public Equipo(Integer idEquipo, String nombreEquipo) {
        this.idEquipo = idEquipo;
        this.nombreEquipo = nombreEquipo;
    }

    // Getters y setters
    public Integer getIdEquipo() {
        return idEquipo;
    }

    public void setIdEquipo(Integer idEquipo) {
        this.idEquipo = idEquipo;
    }

    public String getNombreEquipo() {
        return nombreEquipo;
    }

    public void setNombreEquipo(String nombreEquipo) {
        this.nombreEquipo = nombreEquipo;
    }

    @Override
    public String toString() {
        return "Equipo{" +
                "idEquipo=" + idEquipo +
                ", nombreEquipo='" + nombreEquipo + '\'' +
                '}';
    }
}