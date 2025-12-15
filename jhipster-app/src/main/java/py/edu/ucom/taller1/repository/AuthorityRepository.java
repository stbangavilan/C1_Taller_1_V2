package py.edu.ucom.taller1.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import py.edu.ucom.taller1.domain.Authority;

/**
 * Spring Data JPA repository for the Authority entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
