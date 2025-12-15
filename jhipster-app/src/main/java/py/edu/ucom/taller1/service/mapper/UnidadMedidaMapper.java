package py.edu.ucom.taller1.service.mapper;

import org.mapstruct.*;
import py.edu.ucom.taller1.domain.UnidadMedida;
import py.edu.ucom.taller1.service.dto.UnidadMedidaDTO;

/**
 * Mapper for the entity {@link UnidadMedida} and its DTO {@link UnidadMedidaDTO}.
 */
@Mapper(componentModel = "spring")
public interface UnidadMedidaMapper extends EntityMapper<UnidadMedidaDTO, UnidadMedida> {}
