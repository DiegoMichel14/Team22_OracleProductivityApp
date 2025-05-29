package com.springboot.MyTodoList.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ManagerId implements Serializable {

    @Column(name = "ID_DEVELOPER")
    private Integer developerId;

    @Column(name = "ID_EQUIPO")
    private Integer equipoId;

    // Constructor vacío
    public ManagerId() {
    }

    // Constructor completo
    public ManagerId(Integer developerId, Integer equipoId) {
        this.developerId = developerId;
        this.equipoId = equipoId;
    }

    // Getters y setters
    public Integer getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(Integer developerId) {
        this.developerId = developerId;
    }

    public Integer getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(Integer equipoId) {
        this.equipoId = equipoId;
    }

    // equals y hashCode para la llave compuesta
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ManagerId)) return false;
        ManagerId that = (ManagerId) o;
        return Objects.equals(getDeveloperId(), that.getDeveloperId()) &&
               Objects.equals(getEquipoId(), that.getEquipoId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getDeveloperId(), getEquipoId());
    }
}