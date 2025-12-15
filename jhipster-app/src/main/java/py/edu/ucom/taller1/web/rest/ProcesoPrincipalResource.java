package py.edu.ucom.taller1.web.rest;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import py.edu.ucom.taller1.domain.Movimiento;
import py.edu.ucom.taller1.service.ProcesoPrincipalService;
import py.edu.ucom.taller1.service.dto.ProcesoPrincipalDTO;

@RestController
@RequestMapping("/api")
public class ProcesoPrincipalResource {

    private final ProcesoPrincipalService procesoPrincipalService;

    public ProcesoPrincipalResource(ProcesoPrincipalService procesoPrincipalService) {
        this.procesoPrincipalService = procesoPrincipalService;
    }

    @PostMapping("/proceso-principal")
    public ResponseEntity<Movimiento> ejecutar(@Valid @RequestBody ProcesoPrincipalDTO dto) {
        Movimiento mov = procesoPrincipalService.ejecutar(dto);
        return ResponseEntity.ok(mov);
    }
}
