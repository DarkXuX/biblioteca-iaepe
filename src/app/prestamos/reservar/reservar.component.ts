import { Component, OnInit, AfterViewInit } from "@angular/core";

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

// 🚩 INTERFAZ: Define la estructura de una Reserva Activa
interface ActiveReservation {
    idReserva: string;
    isbn: string;
    titulo: string;
    solicitante: string;
    fechaReserva: string;
    estadoReserva: "Pendiente" | "Activa" | "Cancelada" | "Expirada";
}

// 🚩 INTERFAZ: Define el formulario para procesar una reserva (e.g., alistar el libro)
interface ReservationProcessForm {
    reserva: ActiveReservation;
    fechaProceso: string;
    accion: "Alistar Ejemplar" | "Cancelar Reserva";
    observaciones: string;
}

declare const $: any; // Declaración para usar jQuery / DataTables

@Component({
  selector: "app-reservar-cmp",
  templateUrl: "./reservar.component.html",
})
export class ReservarComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  public selectedProcessForm: ReservationProcessForm | null = null;
  
  // 🚩 DATOS DE ORIGEN: Lista de Reservas Activas/Pendientes 🚩
  private activeReservations: ActiveReservation[] = [
    { idReserva: "R-001", isbn: "978-0321765723", titulo: "El Señor de los Anillos", solicitante: "Juan Pérez", fechaReserva: "2024-11-25", estadoReserva: "Pendiente" },
    { idReserva: "R-002", isbn: "978-0544003415", titulo: "Harry Potter y la Piedra Filosofal", solicitante: "Miguel Sánchez", fechaReserva: "2024-11-10", estadoReserva: "Activa" },
    { idReserva: "R-003", isbn: "978-0743273565", titulo: "Cien Años de Soledad", solicitante: "Ana Gómez", fechaReserva: "2024-12-01", estadoReserva: "Pendiente" },
    { idReserva: "R-004", isbn: "978-0060930335", titulo: "Orgullo y Prejuicio", solicitante: "María Fernández", fechaReserva: "2024-10-15", estadoReserva: "Expirada" },
  ];

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit() {
    this.dataTable = {
      headerRow: [
        "ID Reserva",
        "ISBN",       
        "Título",     
        "Solicitante",
        "Fecha Reserva", 
        "Estado Reserva", 
        "Actions",    
      ],
      footerRow: [
        "ID Reserva",
        "ISBN",
        "Título",
        "Solicitante",
        "Fecha Reserva", 
        "Estado Reserva", 
        "Actions",
      ],

      // Mapeamos los datos de las reservas activas
      dataRows: this.activeReservations.map((r) => [
        r.idReserva,
        r.isbn,
        r.titulo,
        r.solicitante,
        r.fechaReserva,
        r.estadoReserva, // Columna 5 (Estado Reserva)
        r.idReserva,     // Columna 6 (Usaremos el ID para la acción)
      ]),
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.initializeDataTable();
        this.setupDataTableClickHandlers();
        $(".card .material-datatables label").addClass("form-group");
    }, 10);
  }

  private initializeDataTable(): void {
    $("#datatablesReservar").DataTable({
      pagingType: "full_numbers",
      lengthMenu: [
        [5, 10, 25, 50, -1],
        [5, 10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar reservas...",
      },

      data: this.dataTable.dataRows,
      columnDefs: [
        // --- REGLA #1: Columna de ESTADO Reserva ---
        {
          targets: 5, // Columna de Estado Reserva
          render: (data, type, row) => {
            // 'data' es el estadoReserva
            let badgeClass = "";
            
            switch (data) {
                case "Pendiente":
                    badgeClass = "badge-warning";
                    break;
                case "Activa":
                    badgeClass = "badge-success";
                    break;
                case "Cancelada":
                case "Expirada":
                    badgeClass = "badge-danger";
                    break;
                default:
                    badgeClass = "badge-secondary";
            }

            return `<div class="badge fs-6 w-100 ${badgeClass} text-center">${data}</div>`;
          },
        },
        
        // --- REGLA #2: Columna de ACCIONES (Procesar Reserva) ---
        {
          targets: -1, // Última columna (índice 6)
          className: "text-right",
          orderable: false,
          render: (data, type, row) => {
            // 'data' es el idReserva
            const estadoActual = row[5]; 
            
            if (estadoActual === "Pendiente" || estadoActual === "Activa") {
                return `
                  <button type="button" class="btn btn-info btn-round btn-sm process-reservation" 
                          data-id="${data}" data-toggle="modal" data-target="#processModal" title="Procesar Reserva">
                      <i class="material-icons">send</i> Procesar
                  </button>
                `;
            } else {
                return `
                  <button type="button" class="btn btn-default btn-round btn-sm disabled" title="Reserva Finalizada">
                      <i class="material-icons">lock</i> Finalizada
                  </button>
                `;
            }
          },
        },
      ],
    });
  }

  // Manejador de clics en el botón "Procesar"
  private setupDataTableClickHandlers(): void {
    $("body").off("click", "#datatablesReservar .process-reservation"); 

    $("body").on("click", "#datatablesReservar .process-reservation", (e: any) => {
      e.preventDefault();
      const idReserva = $(e.currentTarget).data("id");
      this.cargarDetalleProceso(idReserva);
    });
  }

  // FUNCIÓN: Carga los detalles de la reserva en el formulario del modal
  public cargarDetalleProceso(idReserva: string): void {
    const reserva = this.activeReservations.find((r) => r.idReserva === idReserva);

    if (reserva) {
        let accionSugerida: "Alistar Ejemplar" | "Cancelar Reserva" = reserva.estadoReserva === 'Pendiente' ? "Alistar Ejemplar" : "Cancelar Reserva";

        this.selectedProcessForm = {
            reserva: reserva,
            fechaProceso: this.getTodayDate(),
            accion: accionSugerida, // Sugerencia inicial
            observaciones: '',
        };
    } else {
      this.selectedProcessForm = null;
      console.error(`Reserva con ID ${idReserva} no encontrada.`);
    }
  }
  
  // FUNCIÓN: Simula el registro del Proceso de la Reserva
  public procesarReserva(): void {
      if (this.selectedProcessForm) {
          const r = this.selectedProcessForm.reserva;
          let nuevoEstado: ActiveReservation['estadoReserva'];
          
          if (this.selectedProcessForm.accion === 'Alistar Ejemplar') {
              nuevoEstado = 'Activa'; // El ejemplar está listo para ser recogido por el solicitante
              alert(`✅ Reserva #${r.idReserva} Activada. El ejemplar debe ser retirado en los próximos días.`);
          } else {
              nuevoEstado = 'Cancelada';
              alert(`❌ Reserva #${r.idReserva} Cancelada.`);
          }

          // 1. Simulación: Actualizar la data en Angular
          const index = this.activeReservations.findIndex(e => e.idReserva === r.idReserva);
          if(index !== -1) {
            this.activeReservations[index].estadoReserva = nuevoEstado;
          }

          $("#processModal").modal("hide");
          this.selectedProcessForm = null; 

          // 2. Reiniciar la tabla para reflejar el nuevo estado
          this.reinitializeTable();
      }
  }

  // Función para destruir y recrear la tabla
  private reinitializeTable(): void {
    const table = $("#datatablesReservar").DataTable();
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