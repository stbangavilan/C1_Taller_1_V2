package py.edu.ucom.taller1.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link py.edu.ucom.taller1.domain.Producto} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductoDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 64)
    private String sku;

    @NotNull
    @Size(max = 150)
    private String nombre;

    private BigDecimal pesoPorUnidadKg;

    private BigDecimal volumenPorUnidadL;

    private Instant fechaCreacion;

    private Instant fechaModificacion;

    @Size(max = 100)
    private String usuarioCreacion;

    @Size(max = 100)
    private String usuarioModificacion;

    private UnidadMedidaDTO unidadMedida;

    private CategoriaDTO categoria;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPesoPorUnidadKg() {
        return pesoPorUnidadKg;
    }

    public void setPesoPorUnidadKg(BigDecimal pesoPorUnidadKg) {
        this.pesoPorUnidadKg = pesoPorUnidadKg;
    }

    public BigDecimal getVolumenPorUnidadL() {
        return volumenPorUnidadL;
    }

    public void setVolumenPorUnidadL(BigDecimal volumenPorUnidadL) {
        this.volumenPorUnidadL = volumenPorUnidadL;
    }

    public Instant getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Instant fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Instant getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(Instant fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public String getUsuarioCreacion() {
        return usuarioCreacion;
    }

    public void setUsuarioCreacion(String usuarioCreacion) {
        this.usuarioCreacion = usuarioCreacion;
    }

    public String getUsuarioModificacion() {
        return usuarioModificacion;
    }

    public void setUsuarioModificacion(String usuarioModificacion) {
        this.usuarioModificacion = usuarioModificacion;
    }

    public UnidadMedidaDTO getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(UnidadMedidaDTO unidadMedida) {
        this.unidadMedida = unidadMedida;
    }

    public CategoriaDTO getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaDTO categoria) {
        this.categoria = categoria;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductoDTO)) {
            return false;
        }

        ProductoDTO productoDTO = (ProductoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, productoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductoDTO{" +
            "id=" + getId() +
            ", sku='" + getSku() + "'" +
            ", nombre='" + getNombre() + "'" +
            ", pesoPorUnidadKg=" + getPesoPorUnidadKg() +
            ", volumenPorUnidadL=" + getVolumenPorUnidadL() +
            ", fechaCreacion='" + getFechaCreacion() + "'" +
            ", fechaModificacion='" + getFechaModificacion() + "'" +
            ", usuarioCreacion='" + getUsuarioCreacion() + "'" +
            ", usuarioModificacion='" + getUsuarioModificacion() + "'" +
            ", unidadMedida=" + getUnidadMedida() +
            ", categoria=" + getCategoria() +
            "}";
    }
}
