package py.edu.ucom.taller1.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class MovimientoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Movimiento getMovimientoSample1() {
        return new Movimiento()
            .id(1L)
            .referencia("referencia1")
            .usuarioCreacion("usuarioCreacion1")
            .usuarioModificacion("usuarioModificacion1");
    }

    public static Movimiento getMovimientoSample2() {
        return new Movimiento()
            .id(2L)
            .referencia("referencia2")
            .usuarioCreacion("usuarioCreacion2")
            .usuarioModificacion("usuarioModificacion2");
    }

    public static Movimiento getMovimientoRandomSampleGenerator() {
        return new Movimiento()
            .id(longCount.incrementAndGet())
            .referencia(UUID.randomUUID().toString())
            .usuarioCreacion(UUID.randomUUID().toString())
            .usuarioModificacion(UUID.randomUUID().toString());
    }
}
