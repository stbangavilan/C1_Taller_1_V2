package py.edu.ucom.taller1.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static py.edu.ucom.taller1.domain.UnidadMedidaTestSamples.*;

import org.junit.jupiter.api.Test;
import py.edu.ucom.taller1.web.rest.TestUtil;

class UnidadMedidaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UnidadMedida.class);
        UnidadMedida unidadMedida1 = getUnidadMedidaSample1();
        UnidadMedida unidadMedida2 = new UnidadMedida();
        assertThat(unidadMedida1).isNotEqualTo(unidadMedida2);

        unidadMedida2.setId(unidadMedida1.getId());
        assertThat(unidadMedida1).isEqualTo(unidadMedida2);

        unidadMedida2 = getUnidadMedidaSample2();
        assertThat(unidadMedida1).isNotEqualTo(unidadMedida2);
    }
}
