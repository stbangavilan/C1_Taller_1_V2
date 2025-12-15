package py.edu.ucom.taller1.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import py.edu.ucom.taller1.domain.UnidadMedida;

/**
 * Spring Data JPA repository for the UnidadMedida entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UnidadMedidaRepository extends JpaRepository<UnidadMedida, Long> {}
