import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html', // Asegúrate que el templateUrl sea correcto
})
export class KpiCardComponent {
  // Entradas (Inputs) para configurar la tarjeta desde el componente padre
  @Input() title: string = '';       // Ej: Usuarios
  @Input() value: number = 0;        // Ej: 550
  @Input() icon: string = 'info';    // Icono de Material Icons (Ej: people)
  @Input() iconColor: string = 'primary'; // Color para el header (Ej: warning, success)
  @Input() footerText: string = '';  // Texto informativo en el pie
  @Input() exportType: string = '';  // Tipo de dato a exportar (Ej: USUARIOS_TOTAL)

  // Salida (Output) para notificar al componente padre que se solicitó la exportación
  @Output() exportData = new EventEmitter<string>();

  onExportClick(): void {
    this.exportData.emit(this.exportType);
  }
}