package py.edu.ucom.taller1.service.mapper;

import static py.edu.ucom.taller1.domain.LocalAsserts.*;
import static py.edu.ucom.taller1.domain.LocalTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LocalMapperTest {

    private LocalMapper localMapper;

    @BeforeEach
    void setUp() {
        localMapper = new LocalMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getLocalSample1();
        var actual = localMapper.toEntity(localMapper.toDto(expected));
        assertLocalAllPropertiesEquals(expected, actual);
    }
}
