package py.edu.ucom.taller1.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import py.edu.ucom.taller1.web.rest.TestUtil;

class LocalDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(LocalDTO.class);
        LocalDTO localDTO1 = new LocalDTO();
        localDTO1.setId(1L);
        LocalDTO localDTO2 = new LocalDTO();
        assertThat(localDTO1).isNotEqualTo(localDTO2);
        localDTO2.setId(localDTO1.getId());
        assertThat(localDTO1).isEqualTo(localDTO2);
        localDTO2.setId(2L);
        assertThat(localDTO1).isNotEqualTo(localDTO2);
        localDTO1.setId(null);
        assertThat(localDTO1).isNotEqualTo(localDTO2);
    }
}
