package py.edu.ucom.taller1.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static py.edu.ucom.taller1.domain.UnidadMedidaAsserts.*;
import static py.edu.ucom.taller1.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import py.edu.ucom.taller1.IntegrationTest;
import py.edu.ucom.taller1.domain.UnidadMedida;
import py.edu.ucom.taller1.domain.enumeration.DimensionUnidad;
import py.edu.ucom.taller1.repository.UnidadMedidaRepository;
import py.edu.ucom.taller1.service.dto.UnidadMedidaDTO;
import py.edu.ucom.taller1.service.mapper.UnidadMedidaMapper;

/**
 * Integration tests for the {@link UnidadMedidaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UnidadMedidaResourceIT {

    private static final String DEFAULT_CODIGO = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final DimensionUnidad DEFAULT_DIMENSION = DimensionUnidad.UNIDAD;
    private static final DimensionUnidad UPDATED_DIMENSION = DimensionUnidad.PESO;

    private static final String ENTITY_API_URL = "/api/unidad-medidas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UnidadMedidaRepository unidadMedidaRepository;

    @Autowired
    private UnidadMedidaMapper unidadMedidaMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUnidadMedidaMockMvc;

    private UnidadMedida unidadMedida;

    private UnidadMedida insertedUnidadMedida;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UnidadMedida createEntity() {
        return new UnidadMedida().codigo(DEFAULT_CODIGO).nombre(DEFAULT_NOMBRE).dimension(DEFAULT_DIMENSION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UnidadMedida createUpdatedEntity() {
        return new UnidadMedida().codigo(UPDATED_CODIGO).nombre(UPDATED_NOMBRE).dimension(UPDATED_DIMENSION);
    }

    @BeforeEach
    void initTest() {
        unidadMedida = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedUnidadMedida != null) {
            unidadMedidaRepository.delete(insertedUnidadMedida);
            insertedUnidadMedida = null;
        }
    }

    @Test
    @Transactional
    void createUnidadMedida() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the UnidadMedida
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);
        var returnedUnidadMedidaDTO = om.readValue(
            restUnidadMedidaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unidadMedidaDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            UnidadMedidaDTO.class
        );

        // Validate the UnidadMedida in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedUnidadMedida = unidadMedidaMapper.toEntity(returnedUnidadMedidaDTO);
        assertUnidadMedidaUpdatableFieldsEquals(returnedUnidadMedida, getPersistedUnidadMedida(returnedUnidadMedida));

        insertedUnidadMedida = returnedUnidadMedida;
    }

    @Test
    @Transactional
    void createUnidadMedidaWithExistingId() throws Exception {
        // Create the UnidadMedida with an existing ID
        unidadMedida.setId(1L);
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUnidadMedidaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unidadMedidaDTO)))
            .andExpect(status().isBadRequest());

        // Validate the UnidadMedida in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodigoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        unidadMedida.setCodigo(null);

        // Create the UnidadMedida, which fails.
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        restUnidadMedidaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unidadMedidaDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        unidadMedida.setNombre(null);

        // Create the UnidadMedida, which fails.
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        restUnidadMedidaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unidadMedidaDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDimensionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        unidadMedida.setDimension(null);

        // Create the UnidadMedida, which fails.
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        restUnidadMedidaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unidadMedidaDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUnidadMedidas() throws Exception {
        // Initialize the database
        insertedUnidadMedida = unidadMedidaRepository.saveAndFlush(unidadMedida);

        // Get all the unidadMedidaList
        restUnidadMedidaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(unidadMedida.getId().intValue())))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO)))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].dimension").value(hasItem(DEFAULT_DIMENSION.toString())));
    }

    @Test
    @Transactional
    void getUnidadMedida() throws Exception {
        // Initialize the database
        insertedUnidadMedida = unidadMedidaRepository.saveAndFlush(unidadMedida);

        // Get the unidadMedida
        restUnidadMedidaMockMvc
            .perform(get(ENTITY_API_URL_ID, unidadMedida.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(unidadMedida.getId().intValue()))
            .andExpect(jsonPath("$.codigo").value(DEFAULT_CODIGO))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.dimension").value(DEFAULT_DIMENSION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingUnidadMedida() throws Exception {
        // Get the unidadMedida
        restUnidadMedidaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUnidadMedida() throws Exception {
        // Initialize the database
        insertedUnidadMedida = unidadMedidaRepository.saveAndFlush(unidadMedida);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unidadMedida
        UnidadMedida updatedUnidadMedida = unidadMedidaRepository.findById(unidadMedida.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUnidadMedida are not directly saved in db
        em.detach(updatedUnidadMedida);
        updatedUnidadMedida.codigo(UPDATED_CODIGO).nombre(UPDATED_NOMBRE).dimension(UPDATED_DIMENSION);
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(updatedUnidadMedida);

        restUnidadMedidaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, unidadMedidaDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(unidadMedidaDTO))
            )
            .andExpect(status().isOk());

        // Validate the UnidadMedida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedUnidadMedidaToMatchAllProperties(updatedUnidadMedida);
    }

    @Test
    @Transactional
    void putNonExistingUnidadMedida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unidadMedida.setId(longCount.incrementAndGet());

        // Create the UnidadMedida
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnidadMedidaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, unidadMedidaDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(unidadMedidaDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnidadMedida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUnidadMedida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unidadMedida.setId(longCount.incrementAndGet());

        // Create the UnidadMedida
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnidadMedidaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(unidadMedidaDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnidadMedida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUnidadMedida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unidadMedida.setId(longCount.incrementAndGet());

        // Create the UnidadMedida
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnidadMedidaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unidadMedidaDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UnidadMedida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUnidadMedidaWithPatch() throws Exception {
        // Initialize the database
        insertedUnidadMedida = unidadMedidaRepository.saveAndFlush(unidadMedida);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unidadMedida using partial update
        UnidadMedida partialUpdatedUnidadMedida = new UnidadMedida();
        partialUpdatedUnidadMedida.setId(unidadMedida.getId());

        partialUpdatedUnidadMedida.codigo(UPDATED_CODIGO).dimension(UPDATED_DIMENSION);

        restUnidadMedidaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnidadMedida.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUnidadMedida))
            )
            .andExpect(status().isOk());

        // Validate the UnidadMedida in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUnidadMedidaUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedUnidadMedida, unidadMedida),
            getPersistedUnidadMedida(unidadMedida)
        );
    }

    @Test
    @Transactional
    void fullUpdateUnidadMedidaWithPatch() throws Exception {
        // Initialize the database
        insertedUnidadMedida = unidadMedidaRepository.saveAndFlush(unidadMedida);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unidadMedida using partial update
        UnidadMedida partialUpdatedUnidadMedida = new UnidadMedida();
        partialUpdatedUnidadMedida.setId(unidadMedida.getId());

        partialUpdatedUnidadMedida.codigo(UPDATED_CODIGO).nombre(UPDATED_NOMBRE).dimension(UPDATED_DIMENSION);

        restUnidadMedidaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnidadMedida.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUnidadMedida))
            )
            .andExpect(status().isOk());

        // Validate the UnidadMedida in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUnidadMedidaUpdatableFieldsEquals(partialUpdatedUnidadMedida, getPersistedUnidadMedida(partialUpdatedUnidadMedida));
    }

    @Test
    @Transactional
    void patchNonExistingUnidadMedida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unidadMedida.setId(longCount.incrementAndGet());

        // Create the UnidadMedida
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnidadMedidaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, unidadMedidaDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(unidadMedidaDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnidadMedida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUnidadMedida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unidadMedida.setId(longCount.incrementAndGet());

        // Create the UnidadMedida
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnidadMedidaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(unidadMedidaDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnidadMedida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUnidadMedida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unidadMedida.setId(longCount.incrementAndGet());

        // Create the UnidadMedida
        UnidadMedidaDTO unidadMedidaDTO = unidadMedidaMapper.toDto(unidadMedida);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnidadMedidaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(unidadMedidaDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UnidadMedida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUnidadMedida() throws Exception {
        // Initialize the database
        insertedUnidadMedida = unidadMedidaRepository.saveAndFlush(unidadMedida);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the unidadMedida
        restUnidadMedidaMockMvc
            .perform(delete(ENTITY_API_URL_ID, unidadMedida.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return unidadMedidaRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected UnidadMedida getPersistedUnidadMedida(UnidadMedida unidadMedida) {
        return unidadMedidaRepository.findById(unidadMedida.getId()).orElseThrow();
    }

    protected void assertPersistedUnidadMedidaToMatchAllProperties(UnidadMedida expectedUnidadMedida) {
        assertUnidadMedidaAllPropertiesEquals(expectedUnidadMedida, getPersistedUnidadMedida(expectedUnidadMedida));
    }

    protected void assertPersistedUnidadMedidaToMatchUpdatableProperties(UnidadMedida expectedUnidadMedida) {
        assertUnidadMedidaAllUpdatablePropertiesEquals(expectedUnidadMedida, getPersistedUnidadMedida(expectedUnidadMedida));
    }
}
