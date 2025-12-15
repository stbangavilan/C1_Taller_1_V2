package py.edu.ucom.taller1.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static py.edu.ucom.taller1.domain.LocalTestSamples.*;
import static py.edu.ucom.taller1.domain.ProductoTestSamples.*;
import static py.edu.ucom.taller1.domain.StockTestSamples.*;

import org.junit.jupiter.api.Test;
import py.edu.ucom.taller1.web.rest.TestUtil;

class StockTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stock.class);
        Stock stock1 = getStockSample1();
        Stock stock2 = new Stock();
        assertThat(stock1).isNotEqualTo(stock2);

        stock2.setId(stock1.getId());
        assertThat(stock1).isEqualTo(stock2);

        stock2 = getStockSample2();
        assertThat(stock1).isNotEqualTo(stock2);
    }

    @Test
    void productoTest() {
        Stock stock = getStockRandomSampleGenerator();
        Producto productoBack = getProductoRandomSampleGenerator();

        stock.setProducto(productoBack);
        assertThat(stock.getProducto()).isEqualTo(productoBack);

        stock.producto(null);
        assertThat(stock.getProducto()).isNull();
    }

    @Test
    void localTest() {
        Stock stock = getStockRandomSampleGenerator();
        Local localBack = getLocalRandomSampleGenerator();

        stock.setLocal(localBack);
        assertThat(stock.getLocal()).isEqualTo(localBack);

        stock.local(null);
        assertThat(stock.getLocal()).isNull();
    }
}
