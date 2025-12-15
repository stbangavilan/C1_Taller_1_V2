package py.edu.ucom.taller1.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class LocalTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Local getLocalSample1() {
        return new Local()
            .id(1L)
            .nombre("nombre1")
            .ubicacion("ubicacion1")
            .usuarioCreacion("usuarioCreacion1")
            .usuarioModificacion("usuarioModificacion1");
    }

    public static Local getLocalSample2() {
        return new Local()
            .id(2L)
            .nombre("nombre2")
            .ubicacion("ubicacion2")
            .usuarioCreacion("usuarioCreacion2")
            .usuarioModificacion("usuarioModificacion2");
    }

    public static Local getLocalRandomSampleGenerator() {
        return new Local()
            .id(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .ubicacion(UUID.randomUUID().toString())
            .usuarioCreacion(UUID.randomUUID().toString())
            .usuarioModificacion(UUID.randomUUID().toString());
    }
}
