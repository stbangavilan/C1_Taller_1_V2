package py.edu.ucom.taller1.service.mapper;

import org.mapstruct.*;
import py.edu.ucom.taller1.domain.Local;
import py.edu.ucom.taller1.service.dto.LocalDTO;

/**
 * Mapper for the entity {@link Local} and its DTO {@link LocalDTO}.
 */
@Mapper(componentModel = "spring")
public interface LocalMapper extends EntityMapper<LocalDTO, Local> {}
