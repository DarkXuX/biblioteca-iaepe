import { Component, OnInit, AfterViewInit } from "@angular/core";

// Interfaces de apoyo para DataTables
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

// 🚩 INTERFAZ: Define la estructura de un movimiento (préstamo/devolución)
// Se reutiliza la estructura del Histórico de Ítems para consistencia
interface Movement {
  loanId: string;
  isbn: string;
  titulo: string;
  autor: string;
  status: "Prestado" | "Devuelto" | "Extraviado" | "En Reparacion";
  usuarioNombre: string;
  usuarioCedula: string;
  fechaPrestamo: string;
  fechaDevolucionEsperada: string;
  condicionSalida: "Excelente" | "Buena" | "Regular" | "Mala";

  // Propiedades para la Devolución/Detalle
  fechaDevolucionReal?: string;
  condicionEntrada?: "Excelente" | "Buena" | "Regular" | "Mala";
  observaciones?: string;
}

declare const $: any; // Declaración para usar jQuery / DataTables

@Component({
  selector: "app-historico-usuario-cmp",
  templateUrl: "./historico-usuario.component.html",
})
export class HistoricoUsuarioComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  // 🚩 PROPIEDAD para almacenar el movimiento seleccionado y enlazar con el modal
  selectedMovement: Movement | null = null;

  // 🚩 DATOS DE ORIGEN: Usaremos un array tipado para simular la fuente de datos completa.
  // Se han completado los datos faltantes para que la lógica funcione.
  private movements: Movement[] = [
    { loanId: "L-001", isbn: "978-0321765723", titulo: "El Señor de los Anillos", autor: "J.R.R. Tolkien", status: "Prestado", usuarioNombre: "Juan Pérez", usuarioCedula: "V-1234567", fechaPrestamo: "01/10/2025", fechaDevolucionEsperada: "15/10/2025", condicionSalida: "Excelente" },
    { loanId: "L-002", isbn: "978-1400031702", titulo: "El Principito", autor: "Antoine de Saint-Exupéry", status: "Devuelto", usuarioNombre: "María López", usuarioCedula: "V-8765432", fechaPrestamo: "05/09/2025", fechaDevolucionEsperada: "19/09/2025", condicionSalida: "Buena", fechaDevolucionReal: "19/09/2025", condicionEntrada: "Buena", observaciones: "Devuelto en perfecto estado." },
    { loanId: "L-003", isbn: "978-0743273565", titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", status: "Prestado", usuarioNombre: "Juan Pérez", usuarioCedula: "V-1234567", fechaPrestamo: "10/10/2025", fechaDevolucionEsperada: "24/10/2025", condicionSalida: "Excelente" },
    { loanId: "L-004", isbn: "978-0439708180", titulo: "El Hobbit", autor: "J.R.R. Tolkien", status: "Extraviado", usuarioNombre: "María López", usuarioCedula: "V-8765432", fechaPrestamo: "15/09/2025", fechaDevolucionEsperada: "29/09/2025", condicionSalida: "Regular", observaciones: "Reportado como extraviado por el usuario." },
    { loanId: "L-005", isbn: "978-0061120084", titulo: "Moby Dick", autor: "Herman Melville", status: "Prestado", usuarioNombre: "Pepe Martínez", usuarioCedula: "V-9998887", fechaPrestamo: "20/10/2025", fechaDevolucionEsperada: "03/11/2025", condicionSalida: "Excelente" },
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
      // 🚩 Mapeamos los datos del array tipado al formato de string[][]
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
    // 🚩 CORRECCIÓN CRÍTICA: Usar setTimeout para asegurar la inicialización de DataTables
    setTimeout(() => {
      this.initializeDataTable();
      this.setupDataTableClickHandlers(); // Llama al manejador de clics
      $(".card .material-datatables label").addClass("form-group");
    }, 10);
  }

  private initializeDataTable(): void {
    const table = $("#datatablesHistoricoUsuario").DataTable({
      data: this.dataTable.dataRows, // Inyectamos la data mapeada
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar registros",
      },
      columnDefs: [
        {
          targets: -1, // Última columna (Actions)
          className: "text-right",
          orderable: false,
          render: (data, type, row) => {
            const loanId = data; // En data viene el loanId
            const status = row[3]; // Columna de estado

            let actionButton = "";
            let dropdownItems = "";

            if (status === "Prestado") {
              actionButton = "Gestionar Préstamo";
              dropdownItems = `
                <li><a href="javascript:void(0);" class="view-detail" data-id="${loanId}" data-toggle="modal" data-target="#myModal">Registrar Devolución / Ver Detalles</a></li>
                <li><a href="javascript:void(0);" class="extend-loan">Extender Préstamo</a></li>
                <li class="divider"></li>
                <li><a href="javascript:void(0);" class="report-lost">Reportar Extraviado</a></li>
              `;
            } else {
              actionButton = "Ver Detalles";
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
            // Retornamos el badge
            return `<div class="badge fs-6 w-100 ${badgeClass}">${data}</div>`;
          },
        },
      ],
    });
  }

  // 🚩 FUNCIÓN CLAVE: Manejador de clics en la tabla
  private setupDataTableClickHandlers(): void {
    // Delegamos el evento de clic
    $("body").off("click", "#datatablesHistoricoUsuario .view-detail");

    $("body").on("click", "#datatablesHistoricoUsuario .view-detail", (e: any) => {
      e.preventDefault();
      const loanId = $(e.currentTarget).data("id");
      this.cargarDetalleMovimiento(loanId);
    });
    
    // Eliminamos los manejadores genéricos que no se usan en el render
    $("#datatablesHistoricoUsuario").off("click", ".edit");
    $("#datatablesHistoricoUsuario").off("click", ".remove");
    $("#datatablesHistoricoUsuario").off("click", ".like");
  }

  // 🚩 FUNCIÓN: Simula la carga de los detalles del movimiento (Para el Modal)
  public cargarDetalleMovimiento(loanId: string): void {
    const movement = this.movements.find((m) => m.loanId === loanId);

    if (movement) {
      this.selectedMovement = { ...movement };

      // Inicializar datos para el formulario de devolución si está prestado
      if (this.selectedMovement.status === "Prestado") {
        this.selectedMovement.fechaDevolucionReal = new Date().toLocaleDateString("es-VE");
        this.selectedMovement.condicionEntrada = this.selectedMovement.condicionSalida;
        this.selectedMovement.observaciones = "";
      }
    } else {
      this.selectedMovement = null;
      console.error(`Movimiento con ID ${loanId} no encontrado.`);
    }
  }

  // 🚩 Función para simular el registro de la devolución
  public registrarDevolucion(): void {
    if (this.selectedMovement) {
      alert(`Devolución de "${this.selectedMovement.titulo}" registrada.`);
      
      // Simulación: Actualizar la data en Angular
      const index = this.movements.findIndex(m => m.loanId === this.selectedMovement!.loanId);
      if(index !== -1) {
        this.movements[index].status = 'Devuelto';
        this.movements[index].fechaDevolucionReal = this.selectedMovement.fechaDevolucionReal;
        this.movements[index].condicionEntrada = 'Excelente'; // Asumo la nueva condición
        this.movements[index].observaciones = 'Devuelto por usuario'; 
      }

      $("#myModal").modal("hide");
      
      // Reiniciar la tabla para reflejar el nuevo estado (Devuelto)
      this.reinitializeTable();
    }
  }
  
  // Función para destruir y recrear la tabla (necesario con DataTables)
  private reinitializeTable(): void {
    const table = $("#datatablesHistoricoUsuario").DataTable();
    table.destroy();
    this.ngOnInit(); // Recarga los datos mapeados
    setTimeout(() => {
        this.initializeDataTable();
        this.setupDataTableClickHandlers(); 
    }, 10);
  }
}