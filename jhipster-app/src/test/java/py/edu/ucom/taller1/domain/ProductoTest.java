package py.edu.ucom.taller1.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static py.edu.ucom.taller1.domain.CategoriaTestSamples.*;
import static py.edu.ucom.taller1.domain.ProductoTestSamples.*;
import static py.edu.ucom.taller1.domain.UnidadMedidaTestSamples.*;

import org.junit.jupiter.api.Test;
import py.edu.ucom.taller1.web.rest.TestUtil;

class ProductoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Producto.class);
        Producto producto1 = getProductoSample1();
        Producto producto2 = new Producto();
        assertThat(producto1).isNotEqualTo(producto2);

        producto2.setId(producto1.getId());
        assertThat(producto1).isEqualTo(producto2);

        producto2 = getProductoSample2();
        assertThat(producto1).isNotEqualTo(producto2);
    }

    @Test
    void unidadMedidaTest() {
        Producto producto = getProductoRandomSampleGenerator();
        UnidadMedida unidadMedidaBack = getUnidadMedidaRandomSampleGenerator();

        producto.setUnidadMedida(unidadMedidaBack);
        assertThat(producto.getUnidadMedida()).isEqualTo(unidadMedidaBack);

        producto.unidadMedida(null);
        assertThat(producto.getUnidadMedida()).isNull();
    }

    @Test
    void categoriaTest() {
        Producto producto = getProductoRandomSampleGenerator();
        Categoria categoriaBack = getCategoriaRandomSampleGenerator();

        producto.setCategoria(categoriaBack);
        assertThat(producto.getCategoria()).isEqualTo(categoriaBack);

        producto.categoria(null);
        assertThat(producto.getCategoria()).isNull();
    }
}
