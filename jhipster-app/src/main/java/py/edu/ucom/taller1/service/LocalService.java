package py.edu.ucom.taller1.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import py.edu.ucom.taller1.domain.Local;
import py.edu.ucom.taller1.repository.LocalRepository;
import py.edu.ucom.taller1.service.dto.LocalDTO;
import py.edu.ucom.taller1.service.mapper.LocalMapper;

/**
 * Service Implementation for managing {@link py.edu.ucom.taller1.domain.Local}.
 */
@Service
@Transactional
public class LocalService {

    private static final Logger LOG = LoggerFactory.getLogger(LocalService.class);

    private final LocalRepository localRepository;

    private final LocalMapper localMapper;

    public LocalService(LocalRepository localRepository, LocalMapper localMapper) {
        this.localRepository = localRepository;
        this.localMapper = localMapper;
    }

    /**
     * Save a local.
     *
     * @param localDTO the entity to save.
     * @return the persisted entity.
     */
    public LocalDTO save(LocalDTO localDTO) {
        LOG.debug("Request to save Local : {}", localDTO);
        Local local = localMapper.toEntity(localDTO);
        local = localRepository.save(local);
        return localMapper.toDto(local);
    }

    /**
     * Update a local.
     *
     * @param localDTO the entity to save.
     * @return the persisted entity.
     */
    public LocalDTO update(LocalDTO localDTO) {
        LOG.debug("Request to update Local : {}", localDTO);
        Local local = localMapper.toEntity(localDTO);
        local = localRepository.save(local);
        return localMapper.toDto(local);
    }

    /**
     * Partially update a local.
     *
     * @param localDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<LocalDTO> partialUpdate(LocalDTO localDTO) {
        LOG.debug("Request to partially update Local : {}", localDTO);

        return localRepository
            .findById(localDTO.getId())
            .map(existingLocal -> {
                localMapper.partialUpdate(existingLocal, localDTO);

                return existingLocal;
            })
            .map(localRepository::save)
            .map(localMapper::toDto);
    }

    /**
     * Get all the locals.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<LocalDTO> findAll() {
        LOG.debug("Request to get all Locals");
        return localRepository.findAll().stream().map(localMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one local by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LocalDTO> findOne(Long id) {
        LOG.debug("Request to get Local : {}", id);
        return localRepository.findById(id).map(localMapper::toDto);
    }

    /**
     * Delete the local by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Local : {}", id);
        localRepository.deleteById(id);
    }
}
