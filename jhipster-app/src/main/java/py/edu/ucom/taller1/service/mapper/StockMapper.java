package py.edu.ucom.taller1.service.mapper;

import org.mapstruct.*;
import py.edu.ucom.taller1.domain.Local;
import py.edu.ucom.taller1.domain.Producto;
import py.edu.ucom.taller1.domain.Stock;
import py.edu.ucom.taller1.service.dto.LocalDTO;
import py.edu.ucom.taller1.service.dto.ProductoDTO;
import py.edu.ucom.taller1.service.dto.StockDTO;

/**
 * Mapper for the entity {@link Stock} and its DTO {@link StockDTO}.
 */
@Mapper(componentModel = "spring")
public interface StockMapper extends EntityMapper<StockDTO, Stock> {
    @Mapping(target = "producto", source = "producto", qualifiedByName = "productoNombre")
    @Mapping(target = "local", source = "local", qualifiedByName = "localNombre")
    StockDTO toDto(Stock s);

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
