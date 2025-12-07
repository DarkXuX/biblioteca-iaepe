import { Component, OnInit } from "@angular/core";

// Interfaces reutilizadas (simuladas aquí, en una aplicación real se importarían)
interface ItemBase {
    id: string;
    titulo: string;
    status: string;
}

interface ReporteInventario extends ItemBase {
    isbn: string;
    autor: string;
    estadoFisico: string;
}

interface ReportePrestamo extends ItemBase {
    solicitante: string;
    fechaPrestamo: string;
    fechaDevolucion: string;
}

interface ReporteMantenimiento extends ItemBase {
    estadoMaterial: string;
    fechaProceso: string;
    costo: number;
}

@Component({
  selector: "app-reportes-cmp",
  templateUrl: "./reportes.component.html",
})
export class ReportesComponent implements OnInit {

    // 🚩 Datos Simulados para Reportes 🚩
    public reportesData = {
        inventario: [
            { id: 'E-001', isbn: '978-1234', titulo: 'Libro A', autor: 'Autor 1', status: 'Disponible', estadoFisico: 'Excelente' },
            { id: 'E-002', isbn: '978-5678', titulo: 'Libro B', autor: 'Autor 2', status: 'Prestado', estadoFisico: 'Buen Estado' },
            { id: 'E-003', isbn: '978-9012', titulo: 'Libro C', autor: 'Autor 3', status: 'En Mantenimiento', estadoFisico: 'Desgastado' },
        ] as ReporteInventario[],
        prestamos: [
            { id: 'P-1001', titulo: 'Libro B', solicitante: 'Juan P.', status: 'Activo', fechaPrestamo: '2024-11-20', fechaDevolucion: '2024-12-20' },
            { id: 'P-1002', titulo: 'Libro D', solicitante: 'Maria L.', status: 'Vencido', fechaPrestamo: '2024-10-01', fechaDevolucion: '2024-11-01' },
        ] as ReportePrestamo[],
        mantenimiento: [
            { id: 'M-2001', titulo: 'Libro C', estadoMaterial: 'Desgastado', status: 'En Mantenimiento', fechaProceso: '2024-12-01', costo: 50 },
            { id: 'M-2002', titulo: 'Libro E', estadoMaterial: 'Dañado', status: 'Desincorporado', fechaProceso: '2024-10-15', costo: 0 },
        ] as ReporteMantenimiento[],
    };

    // 🚩 Definiciones de Columnas 🚩
    public inventoryHeaders = ['ID Ejemplar', 'ISBN', 'Título', 'Autor', 'Estado', 'Condición Física'];
    public prestamosHeaders = ['ID Préstamo', 'Título', 'Solicitante', 'Estado', 'Fecha Préstamo', 'Fecha Devolución'];
    public mantenimientoHeaders = ['ID Proceso', 'Título', 'Estado Material', 'Proceso', 'Fecha de Proceso', 'Costo'];
    
    // Propiedad para controlar qué reporte se muestra (ej: 'inventario', 'prestamos', 'mantenimiento')
    public selectedReporte: string = 'inventario'; 

    // Propiedades de filtro simuladas
    public fechaInicio: Date | null = null;
    public fechaFin: Date | null = null;
    public filtroEstado: string = 'Todos';

    constructor() {}

    ngOnInit(): void {}
    
    /**
     * @description Simula la aplicación de filtros a los datos.
     * En una aplicación real, esto llamaría a un servicio con los parámetros de fecha/estado.
     */
    public applyFilters(): void {
        console.log(`Aplicando filtro para: ${this.selectedReporte}`);
        console.log(`Rango de fecha: ${this.fechaInicio} a ${this.fechaFin}`);
        console.log(`Estado: ${this.filtroEstado}`);
        
        // Aquí iría la lógica de filtrado de los arrays de reportesData.
        alert(`Reporte de ${this.selectedReporte.toUpperCase()} filtrado por estado: ${this.filtroEstado}`);
    }

    /**
     * @description Simula la descarga del reporte.
     */
    public downloadReport(format: 'pdf' | 'excel'): void {
        alert(`Descargando reporte de ${this.selectedReporte.toUpperCase()} en formato ${format.toUpperCase()}.`);
    }
}