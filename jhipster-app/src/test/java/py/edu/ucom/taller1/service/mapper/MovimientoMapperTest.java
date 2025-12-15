package py.edu.ucom.taller1.service.mapper;

import static py.edu.ucom.taller1.domain.MovimientoAsserts.*;
import static py.edu.ucom.taller1.domain.MovimientoTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MovimientoMapperTest {

    private MovimientoMapper movimientoMapper;

    @BeforeEach
    void setUp() {
        movimientoMapper = new MovimientoMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getMovimientoSample1();
        var actual = movimientoMapper.toEntity(movimientoMapper.toDto(expected));
        assertMovimientoAllPropertiesEquals(expected, actual);
    }
}
