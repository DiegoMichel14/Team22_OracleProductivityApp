package com.springboot.MyTodoList.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TareaDeveloperId implements Serializable {

    @Column(name = "ID_TAREA")
    private Integer tareaId;

    @Column(name = "ID_DEVELOPER")
    private Integer developerId;

    // Constructor vacío
    public TareaDeveloperId() {
    }

    // Constructor completo
    public TareaDeveloperId(Integer tareaId, Integer developerId) {
        this.tareaId = tareaId;
        this.developerId = developerId;
    }

    // Getters y setters
    public Integer getTareaId() {
        return tareaId;
    }

    public void setTareaId(Integer tareaId) {
        this.tareaId = tareaId;
    }

    public Integer getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(Integer developerId) {
        this.developerId = developerId;
    }

    // Sobreescribimos equals y hashCode para que JPA pueda identificar la llave compuesta
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TareaDeveloperId)) return false;
        TareaDeveloperId that = (TareaDeveloperId) o;
        return Objects.equals(getTareaId(), that.getTareaId()) &&
               Objects.equals(getDeveloperId(), that.getDeveloperId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTareaId(), getDeveloperId());
    }
}