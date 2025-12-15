package py.edu.ucom.taller1.service.mapper;

import static py.edu.ucom.taller1.domain.StockAsserts.*;
import static py.edu.ucom.taller1.domain.StockTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class StockMapperTest {

    private StockMapper stockMapper;

    @BeforeEach
    void setUp() {
        stockMapper = new StockMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getStockSample1();
        var actual = stockMapper.toEntity(stockMapper.toDto(expected));
        assertStockAllPropertiesEquals(expected, actual);
    }
}
