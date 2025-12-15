package py.edu.ucom.taller1.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static py.edu.ucom.taller1.domain.MovimientoAsserts.*;
import static py.edu.ucom.taller1.web.rest.TestUtil.createUpdateProxyForBean;
import static py.edu.ucom.taller1.web.rest.TestUtil.sameNumber;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import py.edu.ucom.taller1.IntegrationTest;
import py.edu.ucom.taller1.domain.Movimiento;
import py.edu.ucom.taller1.domain.enumeration.TipoMovimiento;
import py.edu.ucom.taller1.repository.MovimientoRepository;
import py.edu.ucom.taller1.service.MovimientoService;
import py.edu.ucom.taller1.service.dto.MovimientoDTO;
import py.edu.ucom.taller1.service.mapper.MovimientoMapper;

/**
 * Integration tests for the {@link MovimientoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MovimientoResourceIT {

    private static final TipoMovimiento DEFAULT_TIPO = TipoMovimiento.ENTRADA;
    private static final TipoMovimiento UPDATED_TIPO = TipoMovimiento.SALIDA;

    private static final BigDecimal DEFAULT_CANTIDAD = new BigDecimal(1);
    private static final BigDecimal UPDATED_CANTIDAD = new BigDecimal(2);

    private static final String DEFAULT_REFERENCIA = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCIA = "BBBBBBBBBB";

    private static final Instant DEFAULT_FECHA_MOVIMIENTO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_MOVIMIENTO = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_FECHA_CREACION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_CREACION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_FECHA_MODIFICACION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_MODIFICACION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_USUARIO_CREACION = "AAAAAAAAAA";
    private static final String UPDATED_USUARIO_CREACION = "BBBBBBBBBB";

    private static final String DEFAULT_USUARIO_MODIFICACION = "AAAAAAAAAA";
    private static final String UPDATED_USUARIO_MODIFICACION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/movimientos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Mock
    private MovimientoRepository movimientoRepositoryMock;

    @Autowired
    private MovimientoMapper movimientoMapper;

    @Mock
    private MovimientoService movimientoServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMovimientoMockMvc;

    private Movimiento movimiento;

    private Movimiento insertedMovimiento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Movimiento createEntity() {
        return new Movimiento()
            .tipo(DEFAULT_TIPO)
            .cantidad(DEFAULT_CANTIDAD)
            .referencia(DEFAULT_REFERENCIA)
            .fechaMovimiento(DEFAULT_FECHA_MOVIMIENTO)
            .fechaCreacion(DEFAULT_FECHA_CREACION)
            .fechaModificacion(DEFAULT_FECHA_MODIFICACION)
            .usuarioCreacion(DEFAULT_USUARIO_CREACION)
            .usuarioModificacion(DEFAULT_USUARIO_MODIFICACION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Movimiento createUpdatedEntity() {
        return new Movimiento()
            .tipo(UPDATED_TIPO)
            .cantidad(UPDATED_CANTIDAD)
            .referencia(UPDATED_REFERENCIA)
            .fechaMovimiento(UPDATED_FECHA_MOVIMIENTO)
            .fechaCreacion(UPDATED_FECHA_CREACION)
            .fechaModificacion(UPDATED_FECHA_MODIFICACION)
            .usuarioCreacion(UPDATED_USUARIO_CREACION)
            .usuarioModificacion(UPDATED_USUARIO_MODIFICACION);
    }

    @BeforeEach
    void initTest() {
        movimiento = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedMovimiento != null) {
            movimientoRepository.delete(insertedMovimiento);
            insertedMovimiento = null;
        }
    }

    @Test
    @Transactional
    void createMovimiento() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Movimiento
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);
        var returnedMovimientoDTO = om.readValue(
            restMovimientoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movimientoDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            MovimientoDTO.class
        );

        // Validate the Movimiento in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedMovimiento = movimientoMapper.toEntity(returnedMovimientoDTO);
        assertMovimientoUpdatableFieldsEquals(returnedMovimiento, getPersistedMovimiento(returnedMovimiento));

        insertedMovimiento = returnedMovimiento;
    }

    @Test
    @Transactional
    void createMovimientoWithExistingId() throws Exception {
        // Create the Movimiento with an existing ID
        movimiento.setId(1L);
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMovimientoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movimientoDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Movimiento in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTipoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        movimiento.setTipo(null);

        // Create the Movimiento, which fails.
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        restMovimientoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movimientoDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCantidadIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        movimiento.setCantidad(null);

        // Create the Movimiento, which fails.
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        restMovimientoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movimientoDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFechaMovimientoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        movimiento.setFechaMovimiento(null);

        // Create the Movimiento, which fails.
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        restMovimientoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movimientoDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMovimientos() throws Exception {
        // Initialize the database
        insertedMovimiento = movimientoRepository.saveAndFlush(movimiento);

        // Get all the movimientoList
        restMovimientoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(movimiento.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(sameNumber(DEFAULT_CANTIDAD))))
            .andExpect(jsonPath("$.[*].referencia").value(hasItem(DEFAULT_REFERENCIA)))
            .andExpect(jsonPath("$.[*].fechaMovimiento").value(hasItem(DEFAULT_FECHA_MOVIMIENTO.toString())))
            .andExpect(jsonPath("$.[*].fechaCreacion").value(hasItem(DEFAULT_FECHA_CREACION.toString())))
            .andExpect(jsonPath("$.[*].fechaModificacion").value(hasItem(DEFAULT_FECHA_MODIFICACION.toString())))
            .andExpect(jsonPath("$.[*].usuarioCreacion").value(hasItem(DEFAULT_USUARIO_CREACION)))
            .andExpect(jsonPath("$.[*].usuarioModificacion").value(hasItem(DEFAULT_USUARIO_MODIFICACION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMovimientosWithEagerRelationshipsIsEnabled() throws Exception {
        when(movimientoServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMovimientoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(movimientoServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMovimientosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(movimientoServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMovimientoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(movimientoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMovimiento() throws Exception {
        // Initialize the database
        insertedMovimiento = movimientoRepository.saveAndFlush(movimiento);

        // Get the movimiento
        restMovimientoMockMvc
            .perform(get(ENTITY_API_URL_ID, movimiento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(movimiento.getId().intValue()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()))
            .andExpect(jsonPath("$.cantidad").value(sameNumber(DEFAULT_CANTIDAD)))
            .andExpect(jsonPath("$.referencia").value(DEFAULT_REFERENCIA))
            .andExpect(jsonPath("$.fechaMovimiento").value(DEFAULT_FECHA_MOVIMIENTO.toString()))
            .andExpect(jsonPath("$.fechaCreacion").value(DEFAULT_FECHA_CREACION.toString()))
            .andExpect(jsonPath("$.fechaModificacion").value(DEFAULT_FECHA_MODIFICACION.toString()))
            .andExpect(jsonPath("$.usuarioCreacion").value(DEFAULT_USUARIO_CREACION))
            .andExpect(jsonPath("$.usuarioModificacion").value(DEFAULT_USUARIO_MODIFICACION));
    }

    @Test
    @Transactional
    void getNonExistingMovimiento() throws Exception {
        // Get the movimiento
        restMovimientoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMovimiento() throws Exception {
        // Initialize the database
        insertedMovimiento = movimientoRepository.saveAndFlush(movimiento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the movimiento
        Movimiento updatedMovimiento = movimientoRepository.findById(movimiento.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMovimiento are not directly saved in db
        em.detach(updatedMovimiento);
        updatedMovimiento
            .tipo(UPDATED_TIPO)
            .cantidad(UPDATED_CANTIDAD)
            .referencia(UPDATED_REFERENCIA)
            .fechaMovimiento(UPDATED_FECHA_MOVIMIENTO)
            .fechaCreacion(UPDATED_FECHA_CREACION)
            .fechaModificacion(UPDATED_FECHA_MODIFICACION)
            .usuarioCreacion(UPDATED_USUARIO_CREACION)
            .usuarioModificacion(UPDATED_USUARIO_MODIFICACION);
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(updatedMovimiento);

        restMovimientoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, movimientoDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(movimientoDTO))
            )
            .andExpect(status().isOk());

        // Validate the Movimiento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMovimientoToMatchAllProperties(updatedMovimiento);
    }

    @Test
    @Transactional
    void putNonExistingMovimiento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movimiento.setId(longCount.incrementAndGet());

        // Create the Movimiento
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMovimientoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, movimientoDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(movimientoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movimiento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMovimiento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movimiento.setId(longCount.incrementAndGet());

        // Create the Movimiento
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMovimientoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(movimientoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movimiento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMovimiento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movimiento.setId(longCount.incrementAndGet());

        // Create the Movimiento
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMovimientoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(movimientoDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Movimiento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMovimientoWithPatch() throws Exception {
        // Initialize the database
        insertedMovimiento = movimientoRepository.saveAndFlush(movimiento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the movimiento using partial update
        Movimiento partialUpdatedMovimiento = new Movimiento();
        partialUpdatedMovimiento.setId(movimiento.getId());

        partialUpdatedMovimiento.cantidad(UPDATED_CANTIDAD).fechaModificacion(UPDATED_FECHA_MODIFICACION);

        restMovimientoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMovimiento.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMovimiento))
            )
            .andExpect(status().isOk());

        // Validate the Movimiento in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMovimientoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedMovimiento, movimiento),
            getPersistedMovimiento(movimiento)
        );
    }

    @Test
    @Transactional
    void fullUpdateMovimientoWithPatch() throws Exception {
        // Initialize the database
        insertedMovimiento = movimientoRepository.saveAndFlush(movimiento);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the movimiento using partial update
        Movimiento partialUpdatedMovimiento = new Movimiento();
        partialUpdatedMovimiento.setId(movimiento.getId());

        partialUpdatedMovimiento
            .tipo(UPDATED_TIPO)
            .cantidad(UPDATED_CANTIDAD)
            .referencia(UPDATED_REFERENCIA)
            .fechaMovimiento(UPDATED_FECHA_MOVIMIENTO)
            .fechaCreacion(UPDATED_FECHA_CREACION)
            .fechaModificacion(UPDATED_FECHA_MODIFICACION)
            .usuarioCreacion(UPDATED_USUARIO_CREACION)
            .usuarioModificacion(UPDATED_USUARIO_MODIFICACION);

        restMovimientoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMovimiento.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMovimiento))
            )
            .andExpect(status().isOk());

        // Validate the Movimiento in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMovimientoUpdatableFieldsEquals(partialUpdatedMovimiento, getPersistedMovimiento(partialUpdatedMovimiento));
    }

    @Test
    @Transactional
    void patchNonExistingMovimiento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movimiento.setId(longCount.incrementAndGet());

        // Create the Movimiento
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMovimientoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, movimientoDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(movimientoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movimiento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMovimiento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movimiento.setId(longCount.incrementAndGet());

        // Create the Movimiento
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMovimientoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(movimientoDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Movimiento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMovimiento() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        movimiento.setId(longCount.incrementAndGet());

        // Create the Movimiento
        MovimientoDTO movimientoDTO = movimientoMapper.toDto(movimiento);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMovimientoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(movimientoDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Movimiento in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMovimiento() throws Exception {
        // Initialize the database
        insertedMovimiento = movimientoRepository.saveAndFlush(movimiento);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the movimiento
        restMovimientoMockMvc
            .perform(delete(ENTITY_API_URL_ID, movimiento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return movimientoRepository.count();
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

    protected Movimiento getPersistedMovimiento(Movimiento movimiento) {
        return movimientoRepository.findById(movimiento.getId()).orElseThrow();
    }

    protected void assertPersistedMovimientoToMatchAllProperties(Movimiento expectedMovimiento) {
        assertMovimientoAllPropertiesEquals(expectedMovimiento, getPersistedMovimiento(expectedMovimiento));
    }

    protected void assertPersistedMovimientoToMatchUpdatableProperties(Movimiento expectedMovimiento) {
        assertMovimientoAllUpdatablePropertiesEquals(expectedMovimiento, getPersistedMovimiento(expectedMovimiento));
    }
}
