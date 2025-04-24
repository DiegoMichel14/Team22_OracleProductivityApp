package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity
@Table(name = "DEVELOPER")
public class Developer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DEVELOPER", nullable = false)
    private Integer idDeveloper;

    @Column(name = "NOMBRE", length = 100, nullable = false)
    private String nombre;

    @Column(name = "APELLIDO_PATERNO", length = 100, nullable = false)
    private String apellidoPaterno;

    @Column(name = "APELLIDO_MATERNO", length = 100, nullable = false)
    private String apellidoMaterno;

    // Relación ManyToOne con Equipo. Se marca el FK como no nulo.
    @ManyToOne
    @JoinColumn(name = "ID_EQUIPO", referencedColumnName = "ID_EQUIPO", nullable = false)
    private Equipo equipo;

    @Column(name = "ES_MANAGER")
    private boolean esManager;

    @Column(name = "TELEFONO", length = 10)
    private String telefono;

    @Column(name = "CONTRASENA", length = 100, nullable = false)
    private String contrasena;

    // Constructor vacío 
    public Developer() {
    }

    // Constructor completo
    public Developer(Integer idDeveloper, String nombre, String apellidoPaterno, String apellidoMaterno, Equipo equipo, boolean esManager, String telefono, String contrasena) {
        this.idDeveloper = idDeveloper;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.equipo = equipo;
        this.esManager = esManager;
        this.telefono = telefono;
        this.contrasena = contrasena;
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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
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
                ", telefono='" + telefono + '\'' +
                ", contrasena='" + contrasena + '\'' +
                '}';
    }
}