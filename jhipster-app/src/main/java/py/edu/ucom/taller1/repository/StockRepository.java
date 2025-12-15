package py.edu.ucom.taller1.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import py.edu.ucom.taller1.domain.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProducto_IdAndLocal_Id(Long productoId, Long localId);
}
