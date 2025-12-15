import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MovimientoModelo {
  tipo: string;
  localOrigen: string;
  localDestino: string;
  producto: string;
  cantidad: number | null;
  fecha: string;
  referencia: string;
}

@Component({
  standalone: true,
  selector: 'jhi-proceso-principal',
  templateUrl: './proceso-principal.component.html',
  styleUrls: ['./proceso-principal.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProcesoPrincipalComponent {
  // combos
  tiposMovimiento: string[] = ['ENTRADA', 'SALIDA', 'TRANSFERENCIA', 'AJUSTE'];

  locales: string[] = [
    'Casa Central',
    'Depósito San Lorenzo',
    'Sucursal Asunción',
    'Sucursal San Lorenzo',
  ];

  productos: string[] = [
    'Notebook Lenovo',
    'Mouse Logitech',
    'Silla gamer',
    'Monitor 24"',
  ];

  // pasos para el panel lateral
  pasos: string[] = [
    '1. Seleccionar tipo de movimiento',
    '2. Definir local de origen y destino',
    '3. Elegir producto',
    '4. Ingresar cantidad, fecha y referencia',
    '5. Confirmar y registrar el movimiento',
  ];

  // modelo del formulario (lo que te marcaba error)
  modelo: MovimientoModelo = {
    tipo: '',
    localOrigen: '',
    localDestino: '',
    producto: '',
    cantidad: null,
    fecha: '',
    referencia: '',
  };

  // historial de movimientos simulados
  historial: MovimientoModelo[] = [];

  guardarMovimiento(): void {
    if (!this.modelo.tipo || !this.modelo.producto || !this.modelo.cantidad) {
      // validación mínima
      return;
    }

    this.historial = [...this.historial, { ...this.modelo }];

    // reseteamos el formulario
    this.modelo = {
      tipo: '',
      localOrigen: '',
      localDestino: '',
      producto: '',
      cantidad: null,
      fecha: '',
      referencia: '',
    };
  }
}
