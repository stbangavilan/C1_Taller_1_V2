import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Opción A
import { ProcesoPrincipalService } from 'app/proceso-principal/proceso-principal.service';
import { ProcesoPrincipalRequest, ProcesoPrincipalResponse } from 'app/proceso-principal/proceso-principal.model';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class HomeComponent {
  loading = false;

  // para que no reviente el HTML viejo
  mensajeOk?: string;
  mensajeError?: string;

  resultado?: ProcesoPrincipalResponse;
  errorMsg?: string;

  form = this.fb.group({
    tipo: ['ENTRADA', [Validators.required]],
    productoId: [null as number | null, [Validators.required]],
    cantidad: [null as number | null, [Validators.required, Validators.min(0.01)]],
    localOrigenId: [null as number | null],
    localDestinoId: [null as number | null],
    referencia: [''],
  });

  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoPrincipalService
  ) {}

  // si el HTML llama a procesarMovimiento(), lo soportamos
  procesarMovimiento(): void {
    this.procesar();
  }

  procesar(): void {
    this.mensajeOk = undefined;
    this.mensajeError = undefined;
    this.errorMsg = undefined;
    this.resultado = undefined;

    if (this.form.invalid) {
      this.mensajeError = 'Faltan datos obligatorios o hay valores inválidos.';
      this.form.markAllAsTouched();
      return;
    }

    const payload: ProcesoPrincipalRequest = this.form.getRawValue() as any;

    // validación mínima en frontend
    if (payload.tipo === 'ENTRADA' && !payload.localDestinoId) {
      this.mensajeError = 'Para ENTRADA debes indicar localDestinoId.';
      return;
    }
    if ((payload.tipo === 'SALIDA' || payload.tipo === 'AJUSTE') && !payload.localOrigenId) {
      this.mensajeError = `Para ${payload.tipo} debes indicar localOrigenId.`;
      return;
    }
    if (payload.tipo === 'TRANSFERENCIA' && (!payload.localOrigenId || !payload.localDestinoId)) {
      this.mensajeError = 'Para TRANSFERENCIA debes indicar localOrigenId y localDestinoId.';
      return;
    }

    this.loading = true;

    this.procesoService.ejecutar(payload).subscribe({
      next: res => {
        this.resultado = res;
        this.mensajeOk = 'Proceso ejecutado correctamente.';
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.mensajeError = (err.error as any)?.detail || (err.error as any)?.message || 'Error al procesar.';
        this.loading = false;
      },
    });
  }
}
