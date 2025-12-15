package py.edu.ucom.taller1.service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;

import py.edu.ucom.taller1.domain.enumeration.TipoMovimiento;

public class ProcesoPrincipalDTO implements Serializable {

    @NotNull
    private TipoMovimiento tipo;

    @NotNull
    private Long productoId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal cantidad;

    // Para ENTRADA -> usar destino
    private Long localDestinoId;

    // Para SALIDA/AJUSTE -> usar origen
    private Long localOrigenId;

    private String referencia;

    // getters/setters
    public TipoMovimiento getTipo() { return tipo; }
    public void setTipo(TipoMovimiento tipo) { this.tipo = tipo; }

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public BigDecimal getCantidad() { return cantidad; }
    public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }

    public Long getLocalDestinoId() { return localDestinoId; }
    public void setLocalDestinoId(Long localDestinoId) { this.localDestinoId = localDestinoId; }

    public Long getLocalOrigenId() { return localOrigenId; }
    public void setLocalOrigenId(Long localOrigenId) { this.localOrigenId = localOrigenId; }

    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }
}
