import { Component, OnInit, AfterViewInit } from "@angular/core";

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

// 🚩 INTERFAZ: Define la estructura de una Sanción/Multa
interface Sancion {
    idSancion: string;
    solicitante: string;
    motivo: 'Retraso' | 'Daño Material' | 'Pérdida';
    tipo: 'Suspension' | 'Multa' | 'Ambos';
    montoMulta: number; // 0 si es solo suspensión
    diasSuspension: number; // 0 si es solo multa
    fechaInicio: string;
    fechaFin: string; // Se calcula
    estado: 'Vigente' | 'Finalizada' | 'Pendiente Pago';
}

declare const $: any;

@Component({
  selector: "app-suspender-multas-cmp",
  templateUrl: "./suspender-multas.component.html",
})
export class SuspenderMultasComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  
  // Objeto para manejar la apertura y datos del modal de procesamiento
  public selectedSancion: Sancion | null = null;
  public pagoRealizado: number = 0;
  
  // 🚩 DATOS DE ORIGEN: Lista de Sanciones Vigentes
  private activeSanciones: Sancion[] = [
    { 
        idSancion: "S-001", solicitante: "Juan Pérez", motivo: "Retraso", tipo: "Suspension", 
        montoMulta: 0, diasSuspension: 7, fechaInicio: "2024-12-01", fechaFin: "2024-12-08", estado: "Vigente" 
    },
    { 
        idSancion: "S-002", solicitante: "María López", motivo: "Daño Material", tipo: "Multa", 
        montoMulta: 25.50, diasSuspension: 0, fechaInicio: "2024-11-20", fechaFin: "N/A", estado: "Pendiente Pago" 
    },
    { 
        idSancion: "S-003", solicitante: "Carlos Rodríguez", motivo: "Pérdida", tipo: "Ambos", 
        montoMulta: 50.00, diasSuspension: 30, fechaInicio: "2024-12-05", fechaFin: "2025-01-05", estado: "Vigente" 
    },
  ];

  constructor() { }

  ngOnInit() {
    this.dataTable = {
      headerRow: [
        "ID Sanción",
        "Usuario",
        "Motivo",
        "Tipo",
        "Monto/Días",
        "Estado",
        "Actions",
      ],
      footerRow: [
        "ID Sanción",
        "Usuario",
        "Motivo",
        "Tipo",
        "Monto/Días",
        "Estado",
        "Actions",
      ],
      dataRows: this.activeSanciones.map((s) => [
        s.idSancion,
        s.solicitante,
        s.motivo,
        s.tipo,
        this.getMontoDiasDisplay(s), // Columna 4 (Monto/Días)
        s.estado, // Columna 5 (Estado)
        s.idSancion, // Columna 6 (Usaremos el ID para la acción)
      ]),
    };
  }

  // Helper para mostrar la columna Monto/Días
  private getMontoDiasDisplay(sancion: Sancion): string {
    let display = [];
    if (sancion.montoMulta > 0) {
        display.push(`Multa: $${sancion.montoMulta.toFixed(2)}`);
    }
    if (sancion.diasSuspension > 0) {
        display.push(`Susp.: ${sancion.diasSuspension} días (hasta ${sancion.fechaFin})`);
    }
    return display.join(' | ');
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.initializeDataTable();
        this.setupDataTableClickHandlers();
        $(".card .material-datatables label").addClass("form-group");
    }, 10);
  }

  private initializeDataTable(): void {
    $("#datatablesSuspenderOMultas").DataTable({
      pagingType: "full_numbers",
      lengthMenu: [
        [5, 10, 25, 50, -1],
        [5, 10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar sanciones...",
      },

      data: this.dataTable.dataRows,
      columnDefs: [
        // --- REGLA #1: Columna de ESTADO de Sanción ---
        {
          targets: 5, // Columna de Estado (índice 5)
          render: (data, type, row) => {
            let badgeClass = "";
            switch (data) {
                case "Vigente":
                    badgeClass = "badge-danger";
                    break;
                case "Pendiente Pago":
                    badgeClass = "badge-warning";
                    break;
                case "Finalizada":
                    badgeClass = "badge-success";
                    break;
                default:
                    badgeClass = "badge-secondary";
            }
            return `<div class="badge fs-6 w-100 ${badgeClass} text-center">${data}</div>`;
          },
        },
        
        // --- REGLA #2: Columna de ACCIONES (Procesar Sanción) ---
        {
          targets: -1, // Última columna (índice 6)
          className: "text-right",
          orderable: false,
          render: (data, type, row) => {
            const estadoActual = row[5]; 
            
            if (estadoActual === "Vigente" || estadoActual === "Pendiente Pago") {
                return `
                  <button type="button" class="btn btn-warning btn-round btn-sm process-sancion" 
                          data-id="${data}" data-toggle="modal" data-target="#processSancionModal" title="Procesar Sanción/Pago">
                      <i class="material-icons">payment</i> Gestionar
                  </button>
                `;
            } else {
                return `
                  <button type="button" class="btn btn-default btn-round btn-sm disabled" title="Sanción Finalizada">
                      <i class="material-icons">check</i> Finalizada
                  </button>
                `;
            }
          },
        },
      ],
    });
  }

  // Manejador de clics en el botón "Gestionar"
  private setupDataTableClickHandlers(): void {
    $("body").off("click", "#datatablesSuspenderOMultas .process-sancion"); 

    $("body").on("click", "#datatablesSuspenderOMultas .process-sancion", (e: any) => {
      e.preventDefault();
      const idSancion = $(e.currentTarget).data("id");
      this.cargarDetalleSancion(idSancion);
    });
  }

  // FUNCIÓN: Carga los detalles de la sanción en el formulario del modal
  public cargarDetalleSancion(idSancion: string): void {
    const sancion = this.activeSanciones.find((s) => s.idSancion === idSancion);

    if (sancion) {
        this.selectedSancion = sancion;
        this.pagoRealizado = sancion.montoMulta > 0 ? sancion.montoMulta : 0; // Pre-llenar con el monto total
    } else {
      this.selectedSancion = null;
      console.error(`Sanción con ID ${idSancion} no encontrada.`);
    }
  }
  
  // FUNCIÓN: Simula el registro de la Gestión de Sanción (Pago/Finalización)
  public procesarSancion(): void {
      if (!this.selectedSancion) return;

      const s = this.selectedSancion;
      const index = this.activeSanciones.findIndex(e => e.idSancion === s.idSancion);

      if (s.montoMulta > 0 && this.pagoRealizado < s.montoMulta) {
          alert(`⚠️ Error: El pago ($${this.pagoRealizado.toFixed(2)}) es menor al monto total de la multa ($${s.montoMulta.toFixed(2)}).`);
          return;
      }
      
      let mensaje = `Sanción #${s.idSancion} de ${s.solicitante} procesada.`;
      
      // Actualizar el estado
      if (s.diasSuspension > 0 && s.estado === 'Vigente') {
          // Si tiene suspensión y está vigente, asumimos que se pagó la multa (si aplica) y la suspensión sigue.
          // O si la suspensión ya pasó, se finaliza. 
          if (new Date() > new Date(s.fechaFin) || s.tipo === 'Multa') {
               this.activeSanciones[index].estado = 'Finalizada';
               mensaje += " Estado cambiado a Finalizada.";
          }
      } else if (s.montoMulta > 0 && s.estado === 'Pendiente Pago') {
          // Si solo tenía multa y se pagó
          this.activeSanciones[index].estado = 'Finalizada';
          mensaje += " Multa pagada y sanción Finalizada.";
      } else {
           // Caso genérico, forzar Finalizada (por si se finaliza manualmente antes de tiempo)
           this.activeSanciones[index].estado = 'Finalizada';
           mensaje += " Finalizada manualmente.";
      }
      
      alert(`✅ ${mensaje}`);
      
      $("#processSancionModal").modal("hide");
      this.selectedSancion = null;
      this.reinitializeTable();
  }
  
  // Función para destruir y recrear la tabla
  private reinitializeTable(): void {
    const table = $("#datatablesSuspenderOMultas").DataTable();
    if (table) {
        table.destroy();
    }
    this.ngOnInit(); // Recarga los datos mapeados
    setTimeout(() => {
        this.initializeDataTable();
        this.setupDataTableClickHandlers();
    }, 10);
  }
}