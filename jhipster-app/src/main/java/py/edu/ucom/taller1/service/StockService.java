package py.edu.ucom.taller1.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import py.edu.ucom.taller1.domain.Stock;
import py.edu.ucom.taller1.repository.StockRepository;
import py.edu.ucom.taller1.service.dto.StockDTO;
import py.edu.ucom.taller1.service.mapper.StockMapper;

/**
 * Service Implementation for managing {@link py.edu.ucom.taller1.domain.Stock}.
 */
@Service
@Transactional
public class StockService {

    private static final Logger LOG = LoggerFactory.getLogger(StockService.class);

    private final StockRepository stockRepository;

    private final StockMapper stockMapper;

    public StockService(StockRepository stockRepository, StockMapper stockMapper) {
        this.stockRepository = stockRepository;
        this.stockMapper = stockMapper;
    }

    /**
     * Save a stock.
     *
     * @param stockDTO the entity to save.
     * @return the persisted entity.
     */
    public StockDTO save(StockDTO stockDTO) {
        LOG.debug("Request to save Stock : {}", stockDTO);
        Stock stock = stockMapper.toEntity(stockDTO);
        stock = stockRepository.save(stock);
        return stockMapper.toDto(stock);
    }

    /**
     * Update a stock.
     *
     * @param stockDTO the entity to save.
     * @return the persisted entity.
     */
    public StockDTO update(StockDTO stockDTO) {
        LOG.debug("Request to update Stock : {}", stockDTO);
        Stock stock = stockMapper.toEntity(stockDTO);
        stock = stockRepository.save(stock);
        return stockMapper.toDto(stock);
    }

    /**
     * Partially update a stock.
     *
     * @param stockDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<StockDTO> partialUpdate(StockDTO stockDTO) {
        LOG.debug("Request to partially update Stock : {}", stockDTO);

        return stockRepository
            .findById(stockDTO.getId())
            .map(existingStock -> {
                stockMapper.partialUpdate(existingStock, stockDTO);

                return existingStock;
            })
            .map(stockRepository::save)
            .map(stockMapper::toDto);
    }

    /**
     * Get all the stocks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<StockDTO> findAll() {
        LOG.debug("Request to get all Stocks");
        return stockRepository.findAll().stream().map(stockMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the stocks with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<StockDTO> findAll(Pageable pageable) {
        return stockRepository.findAll(pageable).map(stockMapper::toDto);
    }

    /**
     * Get one stock by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StockDTO> findOne(Long id) {
        return stockRepository.findById(id).map(stockMapper::toDto);
    }

    /**
     * Delete the stock by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Stock : {}", id);
        stockRepository.deleteById(id);
    }
}
