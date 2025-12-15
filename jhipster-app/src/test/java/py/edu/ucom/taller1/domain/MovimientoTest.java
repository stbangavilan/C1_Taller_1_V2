package py.edu.ucom.taller1.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static py.edu.ucom.taller1.domain.LocalTestSamples.*;
import static py.edu.ucom.taller1.domain.MovimientoTestSamples.*;
import static py.edu.ucom.taller1.domain.ProductoTestSamples.*;

import org.junit.jupiter.api.Test;
import py.edu.ucom.taller1.web.rest.TestUtil;

class MovimientoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Movimiento.class);
        Movimiento movimiento1 = getMovimientoSample1();
        Movimiento movimiento2 = new Movimiento();
        assertThat(movimiento1).isNotEqualTo(movimiento2);

        movimiento2.setId(movimiento1.getId());
        assertThat(movimiento1).isEqualTo(movimiento2);

        movimiento2 = getMovimientoSample2();
        assertThat(movimiento1).isNotEqualTo(movimiento2);
    }

    @Test
    void productoTest() {
        Movimiento movimiento = getMovimientoRandomSampleGenerator();
        Producto productoBack = getProductoRandomSampleGenerator();

        movimiento.setProducto(productoBack);
        assertThat(movimiento.getProducto()).isEqualTo(productoBack);

        movimiento.producto(null);
        assertThat(movimiento.getProducto()).isNull();
    }

    @Test
    void localOrigenTest() {
        Movimiento movimiento = getMovimientoRandomSampleGenerator();
        Local localBack = getLocalRandomSampleGenerator();

        movimiento.setLocalOrigen(localBack);
        assertThat(movimiento.getLocalOrigen()).isEqualTo(localBack);

        movimiento.localOrigen(null);
        assertThat(movimiento.getLocalOrigen()).isNull();
    }

    @Test
    void localDestinoTest() {
        Movimiento movimiento = getMovimientoRandomSampleGenerator();
        Local localBack = getLocalRandomSampleGenerator();

        movimiento.setLocalDestino(localBack);
        assertThat(movimiento.getLocalDestino()).isEqualTo(localBack);

        movimiento.localDestino(null);
        assertThat(movimiento.getLocalDestino()).isNull();
    }
}
