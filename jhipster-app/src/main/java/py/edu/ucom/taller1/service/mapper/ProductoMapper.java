package py.edu.ucom.taller1.service.mapper;

import org.mapstruct.*;
import py.edu.ucom.taller1.domain.Categoria;
import py.edu.ucom.taller1.domain.Producto;
import py.edu.ucom.taller1.domain.UnidadMedida;
import py.edu.ucom.taller1.service.dto.CategoriaDTO;
import py.edu.ucom.taller1.service.dto.ProductoDTO;
import py.edu.ucom.taller1.service.dto.UnidadMedidaDTO;

/**
 * Mapper for the entity {@link Producto} and its DTO {@link ProductoDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductoMapper extends EntityMapper<ProductoDTO, Producto> {
    @Mapping(target = "unidadMedida", source = "unidadMedida", qualifiedByName = "unidadMedidaCodigo")
    @Mapping(target = "categoria", source = "categoria", qualifiedByName = "categoriaNombre")
    ProductoDTO toDto(Producto s);

    @Named("unidadMedidaCodigo")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "codigo", source = "codigo")
    UnidadMedidaDTO toDtoUnidadMedidaCodigo(UnidadMedida unidadMedida);

    @Named("categoriaNombre")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nombre", source = "nombre")
    CategoriaDTO toDtoCategoriaNombre(Categoria categoria);
}
