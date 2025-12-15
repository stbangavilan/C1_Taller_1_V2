package py.edu.ucom.taller1.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import py.edu.ucom.taller1.domain.Movimiento;

/**
 * Spring Data JPA repository for the Movimiento entity.
 */
@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {
    default Optional<Movimiento> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Movimiento> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Movimiento> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select movimiento from Movimiento movimiento left join fetch movimiento.producto left join fetch movimiento.localOrigen left join fetch movimiento.localDestino",
        countQuery = "select count(movimiento) from Movimiento movimiento"
    )
    Page<Movimiento> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select movimiento from Movimiento movimiento left join fetch movimiento.producto left join fetch movimiento.localOrigen left join fetch movimiento.localDestino"
    )
    List<Movimiento> findAllWithToOneRelationships();

    @Query(
        "select movimiento from Movimiento movimiento left join fetch movimiento.producto left join fetch movimiento.localOrigen left join fetch movimiento.localDestino where movimiento.id =:id"
    )
    Optional<Movimiento> findOneWithToOneRelationships(@Param("id") Long id);
}
