import { Component, OnInit, AfterViewInit } from "@angular/core";

// Interfaces de apoyo para DataTables
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

// 🚩 INTERFAZ: Define la estructura de un Préstamo en Sala
interface SalaLoan {
  loanId: string;
  isbn: string;
  titulo: string;
  autor: string;
  usuarioNombre: string;
  usuarioCedula: string;
  fechaPrestamo: string;
  horaPrestamo: string; // Específico de préstamo en sala
  status: "En Sala" | "Devuelto Sala" | "Pendiente Sala";
  // Propiedades para el detalle de devolución
  fechaDevolucionReal?: string;
  horaDevolucionReal?: string;
}

declare const $: any; // Declaración para usar jQuery / DataTables

@Component({
  selector: "app-prestamo-en-sala-cmp",
  templateUrl: "./prestamo-en-sala.component.html",
})
export class PrestamoSalaComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  // 🚩 PROPIEDAD para almacenar el préstamo seleccionado y enlazar con el modal
  public selectedLoan: SalaLoan | null = null;

  // 🚩 DATOS DE ORIGEN: Préstamos en Sala simulados
  private salaLoans: SalaLoan[] = [
    {
      loanId: "S-101",
      isbn: "978-0321765723",
      titulo: "El Señor de los Anillos",
      autor: "J.R.R. Tolkien",
      usuarioNombre: "Andrés Castro",
      usuarioCedula: "V-123",
      fechaPrestamo: "20/12/2025",
      horaPrestamo: "10:30 AM",
      status: "En Sala",
    },
    {
      loanId: "S-102",
      isbn: "978-1400031702",
      titulo: "El Principito",
      autor: "Antoine de Saint-Exupéry",
      usuarioNombre: "Laura Montes",
      usuarioCedula: "V-456",
      fechaPrestamo: "20/12/2025",
      horaPrestamo: "11:00 AM",
      status: "En Sala",
    },
    {
      loanId: "S-103",
      isbn: "978-0743273565",
      titulo: "Cien Años de Soledad",
      autor: "Gabriel García Márquez",
      usuarioNombre: "Carlos Rojas",
      usuarioCedula: "V-789",
      fechaPrestamo: "19/12/2025",
      horaPrestamo: "03:15 PM",
      status: "Devuelto Sala",
      fechaDevolucionReal: "19/12/2025",
      horaDevolucionReal: "04:00 PM",
    },
    {
      loanId: "S-104",
      isbn: "978-0439708180",
      titulo: "El Hobbit",
      autor: "J.R.R. Tolkien",
      usuarioNombre: "Ana Torres",
      usuarioCedula: "V-012",
      fechaPrestamo: "20/12/2025",
      horaPrestamo: "09:45 AM",
      status: "Pendiente Sala",
    },
  ];

  ngOnInit() {
    this.dataTable = {
      headerRow: [
        "ISBN",
        "Título",
        "Autor",
        "Estado", // Columna 3
        "Solicitante",
        "Actions", // Columna 5
      ],
      footerRow: [
        "ISBN",
        "Título",
        "Autor",
        "Estado",
        "Solicitante",
        "Actions",
      ],
      // Mapeamos los datos del array tipado al formato de string[][]
      dataRows: this.salaLoans.map((loan) => [
        loan.isbn, // Columna 0
        loan.titulo, // Columna 1
        loan.autor, // Columna 2
        loan.status, // Columna 3 (Estado)
        loan.usuarioNombre, // Columna 4 (Solicitante)
        loan.loanId, // Columna 5 (Usaremos el loanId para el botón)
      ]),
    };
  }

  ngAfterViewInit() {
    // Usar setTimeout para asegurar la inicialización de DataTables
    setTimeout(() => {
      this.initializeDataTable();
      this.setupDataTableClickHandlers();
      $(".card .material-datatables label").addClass("form-group");
    }, 10);
  }

  private initializeDataTable(): void {
    $("#datatablesPrestamosEnSala").DataTable({
      data: this.dataTable.dataRows,
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar préstamos en sala",
      },
      columnDefs: [
        {
          targets: -1, // Última columna (Actions)
          className: "text-right",
          orderable: false,
          render: (data, type, row) => {
            const loanId = data; // loanId
            const status = row[3]; // Columna de estado

            let actionButton = "Ver Detalles";
            let dropdownItems = `<li><a href="javascript:void(0);" class="view-detail" data-id="${loanId}" data-toggle="modal" data-target="#myModal">Ver Detalle</a></li>`;

            if (status === "En Sala" || status === "Pendiente Sala") {
              actionButton = "Gestionar Devolución";
              dropdownItems = `
                <li><a href="javascript:void(0);" class="register-return" data-id="${loanId}" data-toggle="modal" data-target="#myModal">Registrar Devolución en Sala</a></li>
                <li class="divider"></li>
                <li><a href="javascript:void(0);" class="view-detail" data-id="${loanId}" data-toggle="modal" data-target="#myModal">Ver Detalle del Préstamo</a></li>
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
            switch (data) {
              case "En Sala":
                badgeClass = "badge-info"; // Azul para 'En Sala'
                break;
              case "Devuelto Sala":
                badgeClass = "badge-success"; // Verde para 'Devuelto Sala'
                break;
              case "Pendiente Sala":
                badgeClass = "badge-warning"; // Amarillo para 'Pendiente Sala'
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

  // Manejador de clics
  private setupDataTableClickHandlers(): void {
    $("body").off(
      "click",
      "#datatablesPrestamosEnSala .view-detail, #datatablesPrestamosEnSala .register-return"
    );

    $("body").on(
      "click",
      "#datatablesPrestamosEnSala .view-detail, #datatablesPrestamosEnSala .register-return",
      (e: any) => {
        e.preventDefault();
        const loanId = $(e.currentTarget).data("id");
        this.cargarDetallePrestamo(loanId);
      }
    );
  }

  // FUNCIÓN: Simula la carga de los detalles del préstamo (Para el Modal)
  public cargarDetallePrestamo(loanId: string): void {
    const loan = this.salaLoans.find((l) => l.loanId === loanId);

    if (loan) {
      this.selectedLoan = { ...loan };
      // Inicializar datos si está pendiente/en sala para la devolución
      if (this.selectedLoan.status !== "Devuelto Sala") {
        this.selectedLoan.fechaDevolucionReal = new Date().toLocaleDateString(
          "es-VE"
        );
        this.selectedLoan.horaDevolucionReal = new Date().toLocaleTimeString(
          "es-VE",
          { hour: "2-digit", minute: "2-digit" }
        );
      }
    } else {
      this.selectedLoan = null;
      console.error(`Préstamo en sala con ID ${loanId} no encontrado.`);
    }
  }

  // Función para simular el registro de la devolución en sala
  public registrarDevolucionSala(): void {
    if (this.selectedLoan && this.selectedLoan.status !== "Devuelto Sala") {
      alert(`Devolución en sala de "${this.selectedLoan.titulo}" registrada.`);

      // Simulación: Actualizar la data en Angular
      const index = this.salaLoans.findIndex(
        (l) => l.loanId === this.selectedLoan!.loanId
      );
      if (index !== -1) {
        this.salaLoans[index].status = "Devuelto Sala";
        this.salaLoans[index].fechaDevolucionReal =
          new Date().toLocaleDateString("es-VE");
        this.salaLoans[index].horaDevolucionReal =
          new Date().toLocaleTimeString("es-VE", {
            hour: "2-digit",
            minute: "2-digit",
          });
      }

      $("#myModal").modal("hide");

      // Reiniciar la tabla para reflejar el nuevo estado
      this.reinitializeTable();
    }
  }

  // Función para destruir y recrear la tabla
  private reinitializeTable(): void {
    const table = $("#datatablesPrestamosEnSala").DataTable();
    table.destroy();
    this.ngOnInit(); // Recarga los datos mapeados
    setTimeout(() => {
      this.initializeDataTable();
      this.setupDataTableClickHandlers();
    }, 10);
  }
}
