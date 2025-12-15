package py.edu.ucom.taller1.service.dto;

import jakarta.validation.constraints.NotNull;

public class ProcesoPrincipalRequestDTO {

    @NotNull
    private String mensaje;

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
