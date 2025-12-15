package py.edu.ucom.taller1.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class StockTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Stock getStockSample1() {
        return new Stock().id(1L);
    }

    public static Stock getStockSample2() {
        return new Stock().id(2L);
    }

    public static Stock getStockRandomSampleGenerator() {
        return new Stock().id(longCount.incrementAndGet());
    }
}
