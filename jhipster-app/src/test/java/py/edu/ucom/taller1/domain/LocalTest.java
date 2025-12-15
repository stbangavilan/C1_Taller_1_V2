package py.edu.ucom.taller1.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static py.edu.ucom.taller1.domain.LocalTestSamples.*;

import org.junit.jupiter.api.Test;
import py.edu.ucom.taller1.web.rest.TestUtil;

class LocalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Local.class);
        Local local1 = getLocalSample1();
        Local local2 = new Local();
        assertThat(local1).isNotEqualTo(local2);

        local2.setId(local1.getId());
        assertThat(local1).isEqualTo(local2);

        local2 = getLocalSample2();
        assertThat(local1).isNotEqualTo(local2);
    }
}
