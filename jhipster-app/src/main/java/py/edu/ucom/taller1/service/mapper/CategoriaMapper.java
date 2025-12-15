package py.edu.ucom.taller1.service.mapper;

import org.mapstruct.*;
import py.edu.ucom.taller1.domain.Categoria;
import py.edu.ucom.taller1.service.dto.CategoriaDTO;

/**
 * Mapper for the entity {@link Categoria} and its DTO {@link CategoriaDTO}.
 */
@Mapper(componentModel = "spring")
public interface CategoriaMapper extends EntityMapper<CategoriaDTO, Categoria> {}
