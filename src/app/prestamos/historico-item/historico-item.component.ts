import { Component, OnInit, AfterViewInit } from "@angular/core";

// Interfaces de apoyo para DataTables
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

// 🚩 INTERFAZ: Define la estructura de un movimiento (préstamo/devolución)
interface Movement {
  loanId: string; // ID único del préstamo
  isbn: string;
  titulo: string;
  autor: string;
  status: "Prestado" | "Devuelto" | "Extraviado" | "En Reparacion";
  usuarioNombre: string;
  usuarioCedula: string;
  fechaPrestamo: string;
  fechaDevolucionEsperada: string;
  condicionSalida: "Excelente" | "Buena" | "Regular" | "Mala";

  // Propiedades para la Devolución
  fechaDevolucionReal?: string;
  condicionEntrada?: "Excelente" | "Buena" | "Regular" | "Mala";
  observaciones?: string;
}

declare const $: any; // Declaración para usar jQuery / DataTables

@Component({
  selector: "app-historico-item-cmp",
  templateUrl: "./historico-item.component.html",
})
export class HistoricoItemComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;

  // PROPIEDAD para almacenar el movimiento seleccionado y enlazar con el modal
  selectedMovement: Movement | null = null;

  // DATOS DE ORIGEN: Array tipado para simular la fuente de datos completa.
  private movements: Movement[] = [
    {
      loanId: "LOAN-001",
      isbn: "978-0321765723",
      titulo: "El Señor de los Anillos",
      autor: "J.R.R. Tolkien",
      status: "Prestado",
      usuarioNombre: "Juan Pérez",
      usuarioCedula: "V-12.345.678",
      fechaPrestamo: "01/10/2025",
      fechaDevolucionEsperada: "15/10/2025",
      condicionSalida: "Excelente",
    },
    {
      loanId: "LOAN-002",
      isbn: "978-1400031702",
      titulo: "El Principito",
      autor: "Antoine de Saint-Exupéry",
      status: "Prestado",
      usuarioNombre: "María López",
      usuarioCedula: "V-14.567.890",
      fechaPrestamo: "05/10/2025",
      fechaDevolucionEsperada: "19/10/2025",
      condicionSalida: "Buena",
    },
    {
      loanId: "LOAN-003",
      isbn: "978-0743273565",
      titulo: "Cien Años de Soledad",
      autor: "Gabriel García Márquez",
      status: "Prestado",
      usuarioNombre: "Carlos Rodríguez",
      usuarioCedula: "V-10.987.654",
      fechaPrestamo: "10/10/2025",
      fechaDevolucionEsperada: "24/10/2025",
      condicionSalida: "Excelente",
    },
    {
      loanId: "LOAN-004",
      isbn: "978-0061120084",
      titulo: "Moby Dick",
      autor: "Herman Melville",
      status: "Devuelto",
      usuarioNombre: "Pepe Martínez",
      usuarioCedula: "V-18.765.432",
      fechaPrestamo: "01/09/2025",
      fechaDevolucionEsperada: "15/09/2025",
      condicionSalida: "Excelente",
      fechaDevolucionReal: "15/09/2025",
      condicionEntrada: "Regular",
      observaciones: "Mancha de café en la cubierta.",
    },
  ];

  ngOnInit() {
    this.dataTable = {
      headerRow: [
        "ISBN",
        "Título",
        "Autor",
        "Estado",
        "Solicitante",
        "Actions",
      ],
      footerRow: [
        "ISBN",
        "Título",
        "Autor",
        "Estado",
        "Solicitante",
        "Actions",
      ],
      // Mapeamos los datos de Movement al formato de string[][] para DataTables
      dataRows: this.movements.map((m) => [
        m.isbn, // Columna 0
        m.titulo, // Columna 1
        m.autor, // Columna 2
        m.status, // Columna 3 (Estado)
        m.usuarioNombre, // Columna 4 (Solicitante)
        m.loanId, // Columna 5 (Usaremos el loanId para el botón, no se muestra)
      ]),
    };
  }

  ngAfterViewInit() {
    // 🚩 CORRECCIÓN APLICADA: Usar setTimeout para garantizar que el DOM/jQuery esté listo
    setTimeout(() => {
      this.initializeDataTable();
      this.setupDataTableClickHandlers();
      $(".card .material-datatables label").addClass("form-group");
    }, 10); // Retraso mínimo
  }

  private initializeDataTable(): void {
    const table = $("#datatablesHistoricoItem").DataTable({
      data: this.dataTable.dataRows, // 🚩 Aquí se inyectan los datos
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      },
      columnDefs: [
        {
          targets: -1, // Última columna (Actions)
          className: "text-right",
          orderable: false,
          render: (data, type, row) => {
            const loanId = data; // En data viene el loanId que pusimos en dataRows[5]
            const status = row[3]; // Columna de estado

            let actionButton = "";
            let dropdownItems = "";

            if (status === "Prestado") {
              actionButton = "Gestionar Préstamo";
              // Usamos la clase .view-return y data-id para gestionar el clic
              dropdownItems = `
                <li><a href="javascript:void(0);" class="view-return" data-id="${loanId}" data-toggle="modal" data-target="#myModal">Registrar Devolución</a></li>
                <li><a href="javascript:void(0);" class="extend-loan">Extender Préstamo</a></li>
                <li class="divider"></li>
                <li><a href="javascript:void(0);" class="report-lost">Reportar Extraviado</a></li>
              `;
            } else {
              actionButton = "Ver Historial";
              dropdownItems = `
                <li><a href="javascript:void(0);" class="view-detail" data-id="${loanId}" data-toggle="modal" data-target="#myModal">Ver Detalles</a></li>
              `;
            }

            return `
              <div class="dropdown">
                  <button href="#" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                    ${actionButton}
                    <b class="caret"></b>
                  </button>
                  <ul class="dropdown-menu">
                      ${dropdownItems}
                  </ul>
              </div>
            `;
          },
        },
        {
          targets: 3, // Columna de Estado
          render: function (data, type, row) {
            let badgeClass = "";
            switch (data.toLowerCase()) {
              case "prestado":
                badgeClass = "badge-warning";
                break;
              case "devuelto":
                badgeClass = "badge-success";
                break;
              case "extraviado":
                badgeClass = "badge-danger";
                break;
              case "en reparacion":
                badgeClass = "badge-info";
                break;
              default:
                badgeClass = "badge-secondary";
            }
            return `<div class="badge fs-6 w-100 ${badgeClass}">${data}</div>`;
          },
        },
      ],
    });
  }

  // FUNCIÓN CLAVE: Manejador de clics en la tabla
  private setupDataTableClickHandlers(): void {
    // Usamos 'body' para delegar el evento y asegurar que funcione en filas paginadas
    $("body").off(
      "click",
      "#datatablesHistoricoItem .view-return, #datatablesHistoricoItem .view-detail"
    );

    $("body").on(
      "click",
      "#datatablesHistoricoItem .view-return, #datatablesHistoricoItem .view-detail",
      (e: any) => {
        e.preventDefault();

        // 1. Obtener el ID del préstamo del atributo data-id
        const loanId = $(e.currentTarget).data("id");

        // 2. Cargar los detalles del movimiento
        this.cargarDetalleMovimiento(loanId);

        // El data-target="#myModal" en el HTML ya lo abre, no es necesario hacer un .modal("show") aquí
      }
    );
  }

  // FUNCIÓN CLAVE: Simula la carga de los detalles del movimiento
  public cargarDetalleMovimiento(loanId: string): void {
    // Buscar el movimiento por ID en el array simulado
    const movement = this.movements.find((m) => m.loanId === loanId);

    if (movement) {
      this.selectedMovement = { ...movement }; // Clonar el objeto

      // Inicializar datos para el formulario de devolución si está prestado
      if (this.selectedMovement.status === "Prestado") {
        // Asignar la fecha actual por defecto para la devolución
        this.selectedMovement.fechaDevolucionReal =
          new Date().toLocaleDateString("es-VE");
        this.selectedMovement.condicionEntrada =
          this.selectedMovement.condicionSalida; // Condición por defecto
        this.selectedMovement.observaciones = "";
      }
    } else {
      this.selectedMovement = null;
      console.error(`Movimiento con ID ${loanId} no encontrado.`);
    }
  }

  // Función para simular el registro de la devolución
  public registrarDevolucion(): void {
    if (this.selectedMovement) {
      console.log("Registrando devolución para:", this.selectedMovement.loanId);
      // ⚠️ Lógica para llamar al servicio API y actualizar el estado

      // Simulación de éxito:
      alert(
        `Devolución de "${this.selectedMovement.titulo}" registrada el ${this.selectedMovement.fechaDevolucionReal}.`
      );

      // Actualizar el estado del objeto de datos (solo para simulación)
      const index = this.movements.findIndex(
        (m) => m.loanId === this.selectedMovement!.loanId
      );
      if (index !== -1) {
        this.movements[index].status = "Devuelto";
        this.movements[index].fechaDevolucionReal =
          this.selectedMovement.fechaDevolucionReal;
        this.movements[index].condicionEntrada =
          this.selectedMovement.condicionEntrada;
        this.movements[index].observaciones =
          this.selectedMovement.observaciones;
      }

      // Cerrar modal (se puede hacer con un evento, o forzar con jQuery/Bootstrap)
      $("#myModal").modal("hide");

      // 🚩 REINICIALIZAR TABLA PARA REFLEJAR CAMBIOS
      // DataTables necesita ser destruida y recreada para cargar los nuevos datos/estados
      this.reinitializeTable();
    }
  }

  // 🚩 Nueva función para destruir y recrear la tabla
  private reinitializeTable(): void {
    const table = $("#datatablesHistoricoItem").DataTable();
    table.destroy();
    this.ngOnInit(); // Recarga los datos mapeados
    setTimeout(() => {
      this.initializeDataTable();
      this.setupDataTableClickHandlers();
    }, 10);
  }
}
