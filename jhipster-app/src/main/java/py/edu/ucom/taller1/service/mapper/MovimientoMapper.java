package py.edu.ucom.taller1.service.mapper;

import org.mapstruct.*;
import py.edu.ucom.taller1.domain.Local;
import py.edu.ucom.taller1.domain.Movimiento;
import py.edu.ucom.taller1.domain.Producto;
import py.edu.ucom.taller1.service.dto.LocalDTO;
import py.edu.ucom.taller1.service.dto.MovimientoDTO;
import py.edu.ucom.taller1.service.dto.ProductoDTO;

/**
 * Mapper for the entity {@link Movimiento} and its DTO {@link MovimientoDTO}.
 */
@Mapper(componentModel = "spring")
public interface MovimientoMapper extends EntityMapper<MovimientoDTO, Movimiento> {
    @Mapping(target = "producto", source = "producto", qualifiedByName = "productoNombre")
    @Mapping(target = "localOrigen", source = "localOrigen", qualifiedByName = "localNombre")
    @Mapping(target = "localDestino", source = "localDestino", qualifiedByName = "localNombre")
    MovimientoDTO toDto(Movimiento s);

    @Named("productoNombre")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nombre", source = "nombre")
    ProductoDTO toDtoProductoNombre(Producto producto);

    @Named("localNombre")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nombre", source = "nombre")
    LocalDTO toDtoLocalNombre(Local local);
}
