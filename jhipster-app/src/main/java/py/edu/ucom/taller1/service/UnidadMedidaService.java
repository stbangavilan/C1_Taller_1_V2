package py.edu.ucom.taller1.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import py.edu.ucom.taller1.domain.UnidadMedida;
import py.edu.ucom.taller1.repository.UnidadMedidaRepository;
import py.edu.ucom.taller1.service.dto.UnidadMedidaDTO;
import py.edu.ucom.taller1.service.mapper.UnidadMedidaMapper;

/**
 * Service Implementation for managing {@link py.edu.ucom.taller1.domain.UnidadMedida}.
 */
@Service
@Transactional
public class UnidadMedidaService {

    private static final Logger LOG = LoggerFactory.getLogger(UnidadMedidaService.class);

    private final UnidadMedidaRepository unidadMedidaRepository;

    private final UnidadMedidaMapper unidadMedidaMapper;

    public UnidadMedidaService(UnidadMedidaRepository unidadMedidaRepository, UnidadMedidaMapper unidadMedidaMapper) {
        this.unidadMedidaRepository = unidadMedidaRepository;
        this.unidadMedidaMapper = unidadMedidaMapper;
    }

    /**
     * Save a unidadMedida.
     *
     * @param unidadMedidaDTO the entity to save.
     * @return the persisted entity.
     */
    public UnidadMedidaDTO save(UnidadMedidaDTO unidadMedidaDTO) {
        LOG.debug("Request to save UnidadMedida : {}", unidadMedidaDTO);
        UnidadMedida unidadMedida = unidadMedidaMapper.toEntity(unidadMedidaDTO);
        unidadMedida = unidadMedidaRepository.save(unidadMedida);
        return unidadMedidaMapper.toDto(unidadMedida);
    }

    /**
     * Update a unidadMedida.
     *
     * @param unidadMedidaDTO the entity to save.
     * @return the persisted entity.
     */
    public UnidadMedidaDTO update(UnidadMedidaDTO unidadMedidaDTO) {
        LOG.debug("Request to update UnidadMedida : {}", unidadMedidaDTO);
        UnidadMedida unidadMedida = unidadMedidaMapper.toEntity(unidadMedidaDTO);
        unidadMedida = unidadMedidaRepository.save(unidadMedida);
        return unidadMedidaMapper.toDto(unidadMedida);
    }

    /**
     * Partially update a unidadMedida.
     *
     * @param unidadMedidaDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UnidadMedidaDTO> partialUpdate(UnidadMedidaDTO unidadMedidaDTO) {
        LOG.debug("Request to partially update UnidadMedida : {}", unidadMedidaDTO);

        return unidadMedidaRepository
            .findById(unidadMedidaDTO.getId())
            .map(existingUnidadMedida -> {
                unidadMedidaMapper.partialUpdate(existingUnidadMedida, unidadMedidaDTO);

                return existingUnidadMedida;
            })
            .map(unidadMedidaRepository::save)
            .map(unidadMedidaMapper::toDto);
    }

    /**
     * Get all the unidadMedidas.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<UnidadMedidaDTO> findAll() {
        LOG.debug("Request to get all UnidadMedidas");
        return unidadMedidaRepository.findAll().stream().map(unidadMedidaMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one unidadMedida by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UnidadMedidaDTO> findOne(Long id) {
        LOG.debug("Request to get UnidadMedida : {}", id);
        return unidadMedidaRepository.findById(id).map(unidadMedidaMapper::toDto);
    }

    /**
     * Delete the unidadMedida by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete UnidadMedida : {}", id);
        unidadMedidaRepository.deleteById(id);
    }
}
