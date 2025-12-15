package py.edu.ucom.taller1.service.mapper;

import static py.edu.ucom.taller1.domain.UnidadMedidaAsserts.*;
import static py.edu.ucom.taller1.domain.UnidadMedidaTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UnidadMedidaMapperTest {

    private UnidadMedidaMapper unidadMedidaMapper;

    @BeforeEach
    void setUp() {
        unidadMedidaMapper = new UnidadMedidaMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getUnidadMedidaSample1();
        var actual = unidadMedidaMapper.toEntity(unidadMedidaMapper.toDto(expected));
        assertUnidadMedidaAllPropertiesEquals(expected, actual);
    }
}
