package py.edu.ucom.taller1.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import py.edu.ucom.taller1.domain.Local;

/**
 * Spring Data JPA repository for the Local entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LocalRepository extends JpaRepository<Local, Long> {}
