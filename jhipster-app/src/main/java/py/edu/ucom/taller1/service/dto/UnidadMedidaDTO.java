package py.edu.ucom.taller1.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;
import py.edu.ucom.taller1.domain.enumeration.DimensionUnidad;

/**
 * A DTO for the {@link py.edu.ucom.taller1.domain.UnidadMedida} entity.
 */
@Schema(description = "ENTIDADES")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UnidadMedidaDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 10)
    private String codigo;

    @NotNull
    @Size(max = 50)
    private String nombre;

    @NotNull
    private DimensionUnidad dimension;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public DimensionUnidad getDimension() {
        return dimension;
    }

    public void setDimension(DimensionUnidad dimension) {
        this.dimension = dimension;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UnidadMedidaDTO)) {
            return false;
        }

        UnidadMedidaDTO unidadMedidaDTO = (UnidadMedidaDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, unidadMedidaDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UnidadMedidaDTO{" +
            "id=" + getId() +
            ", codigo='" + getCodigo() + "'" +
            ", nombre='" + getNombre() + "'" +
            ", dimension='" + getDimension() + "'" +
            "}";
    }
}
