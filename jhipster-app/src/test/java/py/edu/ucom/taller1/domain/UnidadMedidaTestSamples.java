package py.edu.ucom.taller1.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class UnidadMedidaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static UnidadMedida getUnidadMedidaSample1() {
        return new UnidadMedida().id(1L).codigo("codigo1").nombre("nombre1");
    }

    public static UnidadMedida getUnidadMedidaSample2() {
        return new UnidadMedida().id(2L).codigo("codigo2").nombre("nombre2");
    }

    public static UnidadMedida getUnidadMedidaRandomSampleGenerator() {
        return new UnidadMedida().id(longCount.incrementAndGet()).codigo(UUID.randomUUID().toString()).nombre(UUID.randomUUID().toString());
    }
}
