package py.edu.ucom.taller1.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import py.edu.ucom.taller1.domain.enumeration.TipoMovimiento;

/**
 * A DTO for the {@link py.edu.ucom.taller1.domain.Movimiento} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MovimientoDTO implements Serializable {

    private Long id;

    @NotNull
    private TipoMovimiento tipo;

    @NotNull
    private BigDecimal cantidad;

    @Size(max = 120)
    private String referencia;

    @NotNull
    private Instant fechaMovimiento;

    private Instant fechaCreacion;

    private Instant fechaModificacion;

    @Size(max = 100)
    private String usuarioCreacion;

    @Size(max = 100)
    private String usuarioModificacion;

    private ProductoDTO producto;

    private LocalDTO localOrigen;

    private LocalDTO localDestino;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoMovimiento getTipo() {
        return tipo;
    }

    public void setTipo(TipoMovimiento tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public Instant getFechaMovimiento() {
        return fechaMovimiento;
    }

    public void setFechaMovimiento(Instant fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
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

    public ProductoDTO getProducto() {
        return producto;
    }

    public void setProducto(ProductoDTO producto) {
        this.producto = producto;
    }

    public LocalDTO getLocalOrigen() {
        return localOrigen;
    }

    public void setLocalOrigen(LocalDTO localOrigen) {
        this.localOrigen = localOrigen;
    }

    public LocalDTO getLocalDestino() {
        return localDestino;
    }

    public void setLocalDestino(LocalDTO localDestino) {
        this.localDestino = localDestino;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MovimientoDTO)) {
            return false;
        }

        MovimientoDTO movimientoDTO = (MovimientoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, movimientoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MovimientoDTO{" +
            "id=" + getId() +
            ", tipo='" + getTipo() + "'" +
            ", cantidad=" + getCantidad() +
            ", referencia='" + getReferencia() + "'" +
            ", fechaMovimiento='" + getFechaMovimiento() + "'" +
            ", fechaCreacion='" + getFechaCreacion() + "'" +
            ", fechaModificacion='" + getFechaModificacion() + "'" +
            ", usuarioCreacion='" + getUsuarioCreacion() + "'" +
            ", usuarioModificacion='" + getUsuarioModificacion() + "'" +
            ", producto=" + getProducto() +
            ", localOrigen=" + getLocalOrigen() +
            ", localDestino=" + getLocalDestino() +
            "}";
    }
}
