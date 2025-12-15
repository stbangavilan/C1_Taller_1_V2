package py.edu.ucom.taller1.service;

import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import py.edu.ucom.taller1.domain.Local;
import py.edu.ucom.taller1.domain.Movimiento;
import py.edu.ucom.taller1.domain.Producto;
import py.edu.ucom.taller1.domain.Stock;
import py.edu.ucom.taller1.domain.enumeration.TipoMovimiento;
import py.edu.ucom.taller1.repository.LocalRepository;
import py.edu.ucom.taller1.repository.MovimientoRepository;
import py.edu.ucom.taller1.repository.ProductoRepository;
import py.edu.ucom.taller1.repository.StockRepository;
import py.edu.ucom.taller1.service.dto.ProcesoPrincipalDTO;

@Service
@Transactional
public class ProcesoPrincipalService {

    private final ProductoRepository productoRepository;
    private final LocalRepository localRepository;
    private final StockRepository stockRepository;
    private final MovimientoRepository movimientoRepository;

    public ProcesoPrincipalService(
        ProductoRepository productoRepository,
        LocalRepository localRepository,
        StockRepository stockRepository,
        MovimientoRepository movimientoRepository
    ) {
        this.productoRepository = productoRepository;
        this.localRepository = localRepository;
        this.stockRepository = stockRepository;
        this.movimientoRepository = movimientoRepository;
    }

    public Movimiento ejecutar(ProcesoPrincipalDTO dto) {
        validarDto(dto);

        Producto producto = productoRepository
            .findById(dto.getProductoId())
            .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado: id=" + dto.getProductoId()));

        Instant ahora = Instant.now();
        TipoMovimiento tipo = dto.getTipo();

        return switch (tipo) {
            case ENTRADA -> procesarEntrada(dto, producto, ahora);
            case SALIDA -> procesarSalida(dto, producto, ahora);
            case TRANSFERENCIA -> procesarTransferencia(dto, producto, ahora);
            case AJUSTE -> procesarAjuste(dto, producto, ahora);
        };
    }

    // -------------------------
    // Casos de uso
    // -------------------------

    private Movimiento procesarEntrada(ProcesoPrincipalDTO dto, Producto producto, Instant ahora) {
        Local destino = getLocalDestino(dto);

        Stock stock = getOrCreateStock(producto, destino);
        aplicarEntrada(stock, dto.getCantidad());
        stockRepository.save(stock);

        Movimiento mov = crearMovimiento(dto, producto, null, destino, ahora, TipoMovimiento.ENTRADA);
        return movimientoRepository.save(mov);
    }

    private Movimiento procesarSalida(ProcesoPrincipalDTO dto, Producto producto, Instant ahora) {
        Local origen = getLocalOrigen(dto);

        Stock stock = getStockObligatorio(producto, origen);
        aplicarSalida(stock, dto.getCantidad()); // valida stock >= cantidad
        stockRepository.save(stock);

        Movimiento mov = crearMovimiento(dto, producto, origen, null, ahora, TipoMovimiento.SALIDA);
        return movimientoRepository.save(mov);
    }

    private Movimiento procesarTransferencia(ProcesoPrincipalDTO dto, Producto producto, Instant ahora) {
        Local origen = getLocalOrigen(dto);
        Local destino = getLocalDestino(dto);

        if (Objects.equals(origen.getId(), destino.getId())) {
            throw new IllegalArgumentException("Transferencia inválida: origen y destino no pueden ser el mismo local");
        }

        Stock stockOrigen = getStockObligatorio(producto, origen);
        aplicarSalida(stockOrigen, dto.getCantidad());
        stockRepository.save(stockOrigen);

        Stock stockDestino = getOrCreateStock(producto, destino);
        aplicarEntrada(stockDestino, dto.getCantidad());
        stockRepository.save(stockDestino);

        Movimiento mov = crearMovimiento(dto, producto, origen, destino, ahora, TipoMovimiento.TRANSFERENCIA);
        return movimientoRepository.save(mov);
    }

    private Movimiento procesarAjuste(ProcesoPrincipalDTO dto, Producto producto, Instant ahora) {
        Local origen = getLocalOrigen(dto);

        Stock stock = getOrCreateStock(producto, origen);
        aplicarAjuste(stock, dto.getCantidad()); // setea valor final
        stockRepository.save(stock);

        Movimiento mov = crearMovimiento(dto, producto, origen, null, ahora, TipoMovimiento.AJUSTE);
        return movimientoRepository.save(mov);
    }

    // -------------------------
    // Validaciones
    // -------------------------

    private void validarDto(ProcesoPrincipalDTO dto) {
        if (dto == null) throw new IllegalArgumentException("El body (dto) no puede ser null");
        if (dto.getTipo() == null) throw new IllegalArgumentException("tipo es obligatorio");
        if (dto.getProductoId() == null) throw new IllegalArgumentException("productoId es obligatorio");
        if (dto.getCantidad() == null) throw new IllegalArgumentException("cantidad es obligatoria");
        if (dto.getCantidad().compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("cantidad debe ser > 0");

        // Reglas por tipo
        switch (dto.getTipo()) {
            case ENTRADA -> {
                if (dto.getLocalDestinoId() == null) throw new IllegalArgumentException("localDestinoId es obligatorio para ENTRADA");
            }
            case SALIDA, AJUSTE -> {
                if (dto.getLocalOrigenId() == null) throw new IllegalArgumentException("localOrigenId es obligatorio para " + dto.getTipo());
            }
            case TRANSFERENCIA -> {
                if (dto.getLocalOrigenId() == null) throw new IllegalArgumentException("localOrigenId es obligatorio para TRANSFERENCIA");
                if (dto.getLocalDestinoId() == null) throw new IllegalArgumentException("localDestinoId es obligatorio para TRANSFERENCIA");
            }
        }
    }

    // -------------------------
    // Resolución de Locales
    // -------------------------

    private Local getLocalOrigen(ProcesoPrincipalDTO dto) {
        Long id = dto.getLocalOrigenId();
        return localRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Local origen no encontrado: id=" + id));
    }

    private Local getLocalDestino(ProcesoPrincipalDTO dto) {
        Long id = dto.getLocalDestinoId();
        return localRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Local destino no encontrado: id=" + id));
    }

    // -------------------------
    // Stock helpers
    // -------------------------

    private Stock getStockObligatorio(Producto producto, Local local) {
        return stockRepository
            .findByProducto_IdAndLocal_Id(producto.getId(), local.getId())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Stock no encontrado para productoId=" + producto.getId() + " y localId=" + local.getId()
                    )
            );
    }

    private Stock getOrCreateStock(Producto producto, Local local) {
        return stockRepository
            .findByProducto_IdAndLocal_Id(producto.getId(), local.getId())
            .orElseGet(() -> {
                Stock s = new Stock();
                s.setProducto(producto);
                s.setLocal(local);
                s.setCantidad(BigDecimal.ZERO);
                return s;
            });
    }

    // -------------------------
    // Reglas de negocio
    // -------------------------

    private void aplicarEntrada(Stock stock, BigDecimal cantidad) {
        stock.setCantidad(nvl(stock.getCantidad()).add(cantidad));
    }

    private void aplicarSalida(Stock stock, BigDecimal cantidad) {
        BigDecimal actual = nvl(stock.getCantidad());
        if (actual.compareTo(cantidad) < 0) {
            throw new IllegalStateException("Stock insuficiente. Actual=" + actual + ", requerido=" + cantidad);
        }
        stock.setCantidad(actual.subtract(cantidad));
    }

    /** AJUSTE: deja el stock en el valor final indicado por dto.cantidad */
    private void aplicarAjuste(Stock stock, BigDecimal cantidadFinal) {
        stock.setCantidad(cantidadFinal);
    }

    private BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    // -------------------------
    // Movimiento factory
    // -------------------------

    private Movimiento crearMovimiento(
        ProcesoPrincipalDTO dto,
        Producto producto,
        Local origen,
        Local destino,
        Instant ahora,
        TipoMovimiento tipo
    ) {
        Movimiento mov = new Movimiento();
        mov.setProducto(producto);
        mov.setLocalOrigen(origen);
        mov.setLocalDestino(destino);
        mov.setCantidad(dto.getCantidad());
        mov.setTipo(tipo);
        mov.setFechaMovimiento(ahora);
        mov.setReferencia(dto.getReferencia());
        return mov;
    }
}
