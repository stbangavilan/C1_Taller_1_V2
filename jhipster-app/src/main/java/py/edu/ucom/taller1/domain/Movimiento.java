package py.edu.ucom.taller1.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import py.edu.ucom.taller1.domain.enumeration.TipoMovimiento;

/**
 * A Movimiento.
 */
@Entity
@Table(name = "movimiento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Movimiento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoMovimiento tipo;

    @NotNull
    @Column(name = "cantidad", precision = 21, scale = 2, nullable = false)
    private BigDecimal cantidad;

    @Size(max = 120)
    @Column(name = "referencia", length = 120)
    private String referencia;

    @NotNull
    @Column(name = "fecha_movimiento", nullable = false)
    private Instant fechaMovimiento;

    @Column(name = "fecha_creacion")
    private Instant fechaCreacion;

    @Column(name = "fecha_modificacion")
    private Instant fechaModificacion;

    @Size(max = 100)
    @Column(name = "usuario_creacion", length = 100)
    private String usuarioCreacion;

    @Size(max = 100)
    @Column(name = "usuario_modificacion", length = 100)
    private String usuarioModificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "unidadMedida", "categoria" }, allowSetters = true)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    private Local localOrigen;

    @ManyToOne(fetch = FetchType.LAZY)
    private Local localDestino;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Movimiento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoMovimiento getTipo() {
        return this.tipo;
    }

    public Movimiento tipo(TipoMovimiento tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(TipoMovimiento tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getCantidad() {
        return this.cantidad;
    }

    public Movimiento cantidad(BigDecimal cantidad) {
        this.setCantidad(cantidad);
        return this;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public String getReferencia() {
        return this.referencia;
    }

    public Movimiento referencia(String referencia) {
        this.setReferencia(referencia);
        return this;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public Instant getFechaMovimiento() {
        return this.fechaMovimiento;
    }

    public Movimiento fechaMovimiento(Instant fechaMovimiento) {
        this.setFechaMovimiento(fechaMovimiento);
        return this;
    }

    public void setFechaMovimiento(Instant fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }

    public Instant getFechaCreacion() {
        return this.fechaCreacion;
    }

    public Movimiento fechaCreacion(Instant fechaCreacion) {
        this.setFechaCreacion(fechaCreacion);
        return this;
    }

    public void setFechaCreacion(Instant fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Instant getFechaModificacion() {
        return this.fechaModificacion;
    }

    public Movimiento fechaModificacion(Instant fechaModificacion) {
        this.setFechaModificacion(fechaModificacion);
        return this;
    }

    public void setFechaModificacion(Instant fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public String getUsuarioCreacion() {
        return this.usuarioCreacion;
    }

    public Movimiento usuarioCreacion(String usuarioCreacion) {
        this.setUsuarioCreacion(usuarioCreacion);
        return this;
    }

    public void setUsuarioCreacion(String usuarioCreacion) {
        this.usuarioCreacion = usuarioCreacion;
    }

    public String getUsuarioModificacion() {
        return this.usuarioModificacion;
    }

    public Movimiento usuarioModificacion(String usuarioModificacion) {
        this.setUsuarioModificacion(usuarioModificacion);
        return this;
    }

    public void setUsuarioModificacion(String usuarioModificacion) {
        this.usuarioModificacion = usuarioModificacion;
    }

    public Producto getProducto() {
        return this.producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Movimiento producto(Producto producto) {
        this.setProducto(producto);
        return this;
    }

    public Local getLocalOrigen() {
        return this.localOrigen;
    }

    public void setLocalOrigen(Local local) {
        this.localOrigen = local;
    }

    public Movimiento localOrigen(Local local) {
        this.setLocalOrigen(local);
        return this;
    }

    public Local getLocalDestino() {
        return this.localDestino;
    }

    public void setLocalDestino(Local local) {
        this.localDestino = local;
    }

    public Movimiento localDestino(Local local) {
        this.setLocalDestino(local);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Movimiento)) {
            return false;
        }
        return getId() != null && getId().equals(((Movimiento) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Movimiento{" +
            "id=" + getId() +
            ", tipo='" + getTipo() + "'" +
            ", cantidad=" + getCantidad() +
            ", referencia='" + getReferencia() + "'" +
            ", fechaMovimiento='" + getFechaMovimiento() + "'" +
            ", fechaCreacion='" + getFechaCreacion() + "'" +
            ", fechaModificacion='" + getFechaModificacion() + "'" +
            ", usuarioCreacion='" + getUsuarioCreacion() + "'" +
            ", usuarioModificacion='" + getUsuarioModificacion() + "'" +
            "}";
    }
}
