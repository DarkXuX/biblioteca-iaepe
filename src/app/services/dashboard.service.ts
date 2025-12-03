import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Necesitas importar 'of' para simular la API

@Injectable({
  providedIn: 'root' // O 'providedIn: "DashboardModule"' si usas módulos específicos
})
export class DashboardService {

  // **DATOS DE EJEMPLO (Mock Data) TEMPORALES**
  private mockKpiData = {
    totalUsuarios: 550,
    nuevosUsuarios: 45,
    totalInventario: 1230,
    nuevosLibros: 80,
    prestamosActivos: 125,
    devoluciones: 110,
    desincorporaciones: 5
  };

  constructor() { }

  /**
   * Obtiene los valores resumidos de los KPI para el Dashboard.
   * En el futuro, este método contendrá la lógica de conexión a la API o Firestore.
   */
  getKpis(): Observable<any> {
    // Usamos 'of()' para devolver los datos de ejemplo dentro de un Observable
    // Esto simula cómo se comportaría una llamada HTTP o a la base de datos.
    return of(this.mockKpiData); 
  }
}