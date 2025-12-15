package py.edu.ucom.taller1.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import py.edu.ucom.taller1.domain.Categoria;

/**
 * Spring Data JPA repository for the Categoria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}
