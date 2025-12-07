import { Component, OnInit, AfterViewInit } from "@angular/core";

// Interfaces de apoyo para DataTables
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

// 🚩 INTERFAZ: Define la estructura de un Ejemplar (Copia física)
interface Ejemplar {
  idEjemplar: string;
  isbn: string;
  titulo: string;
  autor: string;
  ubicacion: string;
  estado: "Disponible" | "Prestado" | "En Reparación";
}

// 🚩 INTERFAZ: Define el objeto de Préstamo a enviar/mostrar en el modal
interface LoanForm {
  ejemplar: Ejemplar;
  usuarioCedula: string;
  usuarioNombre: string;
  tipoPrestamo: 'Domicilio' | 'Sala';
  fechaDevolucionEsperada: string;
  condicionSalida: 'Excelente' | 'Buena' | 'Regular';
  observaciones: string;
}


declare const $: any; // Declaración para usar jQuery / DataTables

@Component({
  selector: "app-prestar-cmp",
  templateUrl: "./prestar.component.html",
})
export class PrestarComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  
  // 🚩 PROPIEDAD para almacenar el ejemplar seleccionado y enlazar con el modal (Formulario de Préstamo)
  public selectedLoanForm: LoanForm | null = null;
  
  // 🚩 DATOS DE ORIGEN: Inventario de Ejemplares simulado
  private ejemplaresList: Ejemplar[] = [
    { idEjemplar: "E-001", isbn: "978-0321765723", titulo: "El Señor de los Anillos", autor: "J.R.R. Tolkien", ubicacion: "Estante 1A", estado: "Disponible" },
    { idEjemplar: "E-002", isbn: "978-1400031702", titulo: "El Principito", autor: "Antoine de Saint-Exupéry", ubicacion: "Estante 2B", estado: "Disponible" },
    { idEjemplar: "E-003", isbn: "978-0743273565", titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", ubicacion: "Estante 3C", estado: "Prestado" },
    { idEjemplar: "E-004", isbn: "978-0439708180", titulo: "El Hobbit", autor: "J.R.R. Tolkien", ubicacion: "Estante 1A", estado: "Disponible" },
    { idEjemplar: "E-005", isbn: "978-0061120084", titulo: "Moby Dick", autor: "Herman Melville", ubicacion: "Depósito", estado: "En Reparación" },
    { idEjemplar: "E-006", isbn: "978-0451524935", titulo: "1984", autor: "George Orwell", ubicacion: "Estante 4D", estado: "Disponible" },
  ];

  ngOnInit() {
    this.dataTable = {
      headerRow: [
        "ISBN",
        "Título", // Cambiado de "Nombre" a "Título"
        "Autor",
        "Estado",
        "ID Ejemplar", // Cambiado de "Solicitante" a "ID Ejemplar"
        "Actions",
      ],
      footerRow: [
        "ISBN",
        "Título",
        "Autor",
        "Estado",
        "ID Ejemplar",
        "Actions",
      ],

      // Mapeamos los datos del array tipado al formato de string[][]
      dataRows: this.ejemplaresList.map((e) => [
        e.isbn,
        e.titulo,
        e.autor,
        e.estado, // Columna 3 (Estado)
        e.idEjemplar, // Columna 4 (ID Ejemplar)
        e.idEjemplar, // Columna 5 (Usaremos el ID para la acción)
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
    $("#datatablesPrestar").DataTable({
      data: this.dataTable.dataRows,
      pagingType: "full_numbers",
      lengthMenu: [
        [5, 10, 25, 50, -1],
        [5, 10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar ejemplar...",
      },
      columnDefs: [
        {
          targets: -1, // Última columna (Actions)
          className: "text-right",
          orderable: false,
          render: (data, type, row) => {
            const idEjemplar = data;
            const estado = row[3]; // Columna 3 es el estado

            if (estado === "Disponible") {
                return `
                  <button type="button" class="btn btn-primary btn-round register-loan" data-id="${idEjemplar}" data-toggle="modal" data-target="#myModal" title="Registrar Préstamo">
                      <i class="material-icons">outbound</i> Prestar
                  </button>
                `;
            } else {
                return `
                  <button type="button" class="btn btn-danger btn-round disabled" title="Ejemplar No Disponible">
                      <i class="material-icons">lock</i> No Disponible
                  </button>
                `;
            }
          },
        },
        {
          targets: 3, // Columna de Estado
          render: function (data, type, row) {
            let badgeClass = "";
            switch (data) {
              case "Prestado":
                badgeClass = "badge-warning"; // Amarillo para 'Prestado'
                break;
              case "Disponible":
                badgeClass = "badge-success"; // Verde para 'Disponible'
                break;
              case "En Reparación":
                badgeClass = "badge-danger"; // Rojo para 'En Reparación'
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

  // Manejador de clics en la tabla
  private setupDataTableClickHandlers(): void {
    // Apuntamos al botón de "Prestar"
    $("body").off("click", "#datatablesPrestar .register-loan"); 

    $("body").on("click", "#datatablesPrestar .register-loan", (e: any) => {
      e.preventDefault();
      const idEjemplar = $(e.currentTarget).data("id");
      this.cargarDetalleEjemplar(idEjemplar);
    });
  }

  // FUNCIÓN: Carga los detalles del ejemplar en el formulario del modal
  public cargarDetalleEjemplar(idEjemplar: string): void {
    const ejemplar = this.ejemplaresList.find((e) => e.idEjemplar === idEjemplar);

    if (ejemplar) {
      // Inicializar el formulario con datos del ejemplar y valores por defecto
      this.selectedLoanForm = {
        ejemplar: ejemplar,
        usuarioCedula: 'V-15.000.000', // Valor mock para demostración
        usuarioNombre: 'Usuario Mock de Prueba', // Valor mock para demostración
        tipoPrestamo: 'Domicilio', // Default
        fechaDevolucionEsperada: this.calculateReturnDate(),
        condicionSalida: 'Excelente', // Default
        observaciones: '',
      };
    } else {
      this.selectedLoanForm = null;
      console.error(`Ejemplar con ID ${idEjemplar} no encontrado.`);
    }
  }
  
  // FUNCIÓN: Simula el registro del Préstamo
  public registrarPrestamo(): void {
      if (this.selectedLoanForm && this.selectedLoanForm.ejemplar.estado === 'Disponible') {
          alert(`Préstamo registrado: "${this.selectedLoanForm.ejemplar.titulo}" al usuario ${this.selectedLoanForm.usuarioNombre}.`);

          // 1. Simulación: Actualizar la data en Angular (cambiar estado)
          const index = this.ejemplaresList.findIndex(e => e.idEjemplar === this.selectedLoanForm!.ejemplar.idEjemplar);
          if(index !== -1) {
            this.ejemplaresList[index].estado = 'Prestado';
          }

          $("#myModal").modal("hide");
          this.selectedLoanForm = null; // Limpiar el objeto

          // 2. Reiniciar la tabla para reflejar el nuevo estado (se necesita un re-draw)
          this.reinitializeTable();
      }
  }
  
  // FUNCIÓN: Determina la fecha de devolución esperada (simulación: 7 días)
  private calculateReturnDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("es-VE");
  }

  // Función para destruir y recrear la tabla (necesario para actualizar los botones)
  private reinitializeTable(): void {
    const table = $("#datatablesPrestar").DataTable();
    table.destroy();
    this.ngOnInit(); // Recarga los datos mapeados
    setTimeout(() => {
        this.initializeDataTable();
        this.setupDataTableClickHandlers();
    }, 10);
  }
}