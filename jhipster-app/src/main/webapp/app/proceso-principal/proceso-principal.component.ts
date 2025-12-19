import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  ProcesoPrincipalService
} from 'app/proceso-principal/proceso-principal.service';
import {
  ProcesoPrincipalRequest,
  TipoMovimiento
} from 'app/proceso-principal/proceso-principal.model';

@Component({
  standalone: true,
  selector: 'jhi-proceso-principal',
  templateUrl: './proceso-principal.component.html',
  styleUrls: ['./proceso-principal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProcesoPrincipalComponent {
  loading = false;
  errorMsg?: string;
  respuesta?: any;

  tiposMovimiento: TipoMovimiento[] = ['ENTRADA', 'SALIDA', 'TRANSFERENCIA', 'AJUSTE'];

  // 🔹 IDs fijos (como acordamos)
  locales = [
    { id: 1, nombre: 'Casa Central' },
    { id: 2, nombre: 'Depósito San Lorenzo' },
    { id: 3, nombre: 'Sucursal Asunción' },
  ];

  productos = [
    { id: 1, nombre: 'boohoo' },
    { id: 2, nombre: 'precedent until terribly' },
  ];

  form = this.fb.group({
    tipo: ['ENTRADA', Validators.required],
    productoId: [null, Validators.required],
    cantidad: [null, [Validators.required, Validators.min(0.01)]],
    localOrigenId: [null],
    localDestinoId: [null],
    referencia: [''],
  });

  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoPrincipalService
  ) {}

  registrar(): void {
    this.errorMsg = undefined;
    this.respuesta = undefined;

    if (this.form.invalid) {
      this.errorMsg = 'Formulario inválido';
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const payload: ProcesoPrincipalRequest = {
    tipo: raw.tipo as TipoMovimiento,

    // Convertimos a number sí o sí (porque el form puede traer null o string)
    productoId: Number(raw.productoId),
    cantidad: Number(raw.cantidad),

    // si vienen null, mandamos undefined (así no viajan al backend)
    localOrigenId: raw.localOrigenId ?? undefined,
    localDestinoId: raw.localDestinoId ?? undefined,

    referencia: raw.referencia ?? undefined,
    };


    // Validaciones mínimas de negocio (frontend)
    if (payload.tipo === 'ENTRADA' && !payload.localDestinoId) {
    this.errorMsg = 'Para ENTRADA debe indicar local destino';
    return;
    }

    if ((payload.tipo === 'SALIDA' || payload.tipo === 'AJUSTE') && !payload.localOrigenId) {
      this.errorMsg = `Para ${payload.tipo} debe indicar local origen`;
      return;
    }

    if (payload.tipo === 'TRANSFERENCIA' && (!payload.localOrigenId || !payload.localDestinoId)) {
      this.errorMsg = 'Para TRANSFERENCIA debe indicar origen y destino';
      return;
    }


    this.loading = true;

    this.procesoService.ejecutar(payload).subscribe({
      next: res => {
        this.respuesta = res;
        this.loading = false;
        this.form.reset({ tipo: 'ENTRADA' });
      },
      error: err => {
        this.errorMsg =
          err?.error?.detail ||
          err?.error?.message ||
          'Error al ejecutar el proceso';
        this.loading = false;
      },
    });
  }
}
