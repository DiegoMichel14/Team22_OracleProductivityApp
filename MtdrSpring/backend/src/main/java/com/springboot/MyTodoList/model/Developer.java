package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity
@Table(name = "DEVELOPER")
public class Developer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DEVELOPER")
    private Integer idDeveloper;

    @Column(name = "NOMBRE")
    private String nombre;

    @Column(name = "APELLIDO_PATERNO")
    private String apellidoPaterno;

    @Column(name = "APELLIDO_MATERNO")
    private String apellidoMaterno;

    // Relación ManyToOne con Equipo.
    // la columna que contiene la FK se llama "ID_EQUIPO" en la tabla DEVELOPER.
    @ManyToOne
    @JoinColumn(name = "ID_EQUIPO", referencedColumnName = "ID_EQUIPO")
    private Equipo equipo;

    @Column(name = "ES_MANAGER")
    private boolean esManager;

    // Constructor vacío (requerido por JPA)
    public Developer() {
    }

    // Constructor completo 
    public Developer(Integer idDeveloper, String nombre, String apellidoPaterno, String apellidoMaterno, Equipo equipo, boolean esManager) {
        this.idDeveloper = idDeveloper;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.equipo = equipo;
        this.esManager = esManager;
    }

    // Getters y setters
    public Integer getIdDeveloper() {
        return idDeveloper;
    }

    public void setIdDeveloper(Integer idDeveloper) {
        this.idDeveloper = idDeveloper;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidoPaterno() {
        return apellidoPaterno;
    }

    public void setApellidoPaterno(String apellidoPaterno) {
        this.apellidoPaterno = apellidoPaterno;
    }

    public String getApellidoMaterno() {
        return apellidoMaterno;
    }

    public void setApellidoMaterno(String apellidoMaterno) {
        this.apellidoMaterno = apellidoMaterno;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    public boolean isEsManager() {
        return esManager;
    }

    public void setEsManager(boolean esManager) {
        this.esManager = esManager;
    }

    @Override
    public String toString() {
        return "Developer{" +
                "idDeveloper=" + idDeveloper +
                ", nombre='" + nombre + '\'' +
                ", apellidoPaterno='" + apellidoPaterno + '\'' +
                ", apellidoMaterno='" + apellidoMaterno + '\'' +
                ", equipo=" + (equipo != null ? equipo.getIdEquipo() : null) +
                ", esManager=" + esManager +
                '}';
    }
}