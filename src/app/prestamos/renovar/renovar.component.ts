import { Component, OnInit, AfterViewInit } from "@angular/core";

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

// 🚩 INTERFAZ: Define la estructura de un Ejemplar para el Mantenimiento/Renovación
interface MaterialItem {
  idEjemplar: string;
  isbn: string;
  titulo: string;
  autor: string;
  fechaAdquisicion: string; // YYYY-MM-DD
  estadoFisicoActual:
    | "Excelente"
    | "Buen Estado"
    | "Desgastado"
    | "Dañado - Baja"
    | "En Mantenimiento"
    | "Desincorporado";
  ubicacion: string;
}

// 🚩 INTERFAZ: Define el objeto de Proceso de Renovación/Baja
interface RenewalProcessForm {
  material: MaterialItem;
  fechaProceso: string;
  estadoNuevo: "En Mantenimiento" | "Reincorporado" | "Desincorporado";
  razon: string; // Por ejemplo, "Reemplazo de páginas", "Baja por pérdida", etc.
  costoEstimado: number;
}

declare const $: any; // Declaración para usar jQuery / DataTables

@Component({
  selector: "app-renovar-cmp",
  templateUrl: "./renovar.component.html",
})
export class RenovarComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  public selectedProcessForm: RenewalProcessForm | null = null;

  // 🚩 DATOS DE ORIGEN: Inventario simulado con estado físico
  private materialList: MaterialItem[] = [
    // Material que requiere acción
    {
      idEjemplar: "E-001",
      isbn: "978-0321765723",
      titulo: "El Señor de los Anillos",
      autor: "J.R.R. Tolkien",
      fechaAdquisicion: "2018-05-10",
      estadoFisicoActual: "Dañado - Baja",
      ubicacion: "Depósito",
    },
    {
      idEjemplar: "E-002",
      isbn: "978-1400031702",
      titulo: "El Principito",
      autor: "Antoine de Saint-Exupéry",
      fechaAdquisicion: "2020-01-20",
      estadoFisicoActual: "Desgastado",
      ubicacion: "Estante 2B",
    },
    // Material en proceso o finalizado
    {
      idEjemplar: "E-005",
      isbn: "978-0061120084",
      titulo: "Moby Dick",
      autor: "Herman Melville",
      fechaAdquisicion: "2021-03-11",
      estadoFisicoActual: "En Mantenimiento",
      ubicacion: "Taller",
    },
    {
      idEjemplar: "E-006",
      isbn: "978-0451524935",
      titulo: "1984",
      autor: "George Orwell",
      fechaAdquisicion: "2017-09-09",
      estadoFisicoActual: "Desincorporado",
      ubicacion: "N/A",
    },
    // Material en buen estado (No requiere acción)
    {
      idEjemplar: "E-003",
      isbn: "978-0743273565",
      titulo: "Cien Años de Soledad",
      autor: "Gabriel García Márquez",
      fechaAdquisicion: "2023-08-15",
      estadoFisicoActual: "Excelente",
      ubicacion: "Estante 3C",
    },
  ];

  // Helper para obtener la fecha de hoy en formato YYYY-MM-DD
  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  ngOnInit() {
    this.dataTable = {
      headerRow: [
        "ID Ejemplar",
        "ISBN",
        "Título",
        "Autor",
        "Adquisición",
        "Estado Material",
        "Actions",
      ],
      footerRow: [
        "ID Ejemplar",
        "ISBN",
        "Título",
        "Autor",
        "Adquisición",
        "Estado Material",
        "Actions",
      ],

      // Mapeamos los datos para DataTables
      dataRows: this.materialList.map((m) => [
        m.idEjemplar,
        m.isbn,
        m.titulo,
        m.autor,
        m.fechaAdquisicion,
        m.estadoFisicoActual, // Columna 5 (Estado Material)
        m.idEjemplar, // Columna 6 (Usaremos el ID para la acción)
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
    $("#datatablesRenovar").DataTable({
      pagingType: "full_numbers",
      lengthMenu: [
        [5, 10, 25, 50, -1],
        [5, 10, 25, 50, "All"],
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar material...",
      },

      data: this.dataTable.dataRows,
      columnDefs: [
        // --- REGLA #1: Columna de ESTADO Material ---
        {
          targets: 5, // Columna de Estado Material
          render: (data, type, row) => {
            let badgeClass = "";
            let text = data;

            switch (data) {
              case "Dañado - Baja":
                badgeClass = "badge-danger";
                text = "Dañado (Procesar Baja)";
                break;
              case "Desgastado":
                badgeClass = "badge-warning";
                text = "Desgastado (Revisar)";
                break;
              case "En Mantenimiento":
                badgeClass = "badge-info";
                break;
              case "Desincorporado":
                badgeClass = "badge-dark";
                break;
              case "Buen Estado":
              case "Excelente":
                badgeClass = "badge-success";
                break;
              default:
                badgeClass = "badge-secondary";
            }

            return `<div class="badge fs-6 w-100 ${badgeClass} text-center">${text}</div>`;
          },
        },

        // --- REGLA #2: Columna de ACCIONES (Procesar Renovación/Baja) ---
        {
          targets: -1,
          className: "text-right",
          orderable: false,
          render: (data, type, row) => {
            const estadoActual = row[5];

            // Botón activo para materiales que requieren acción o están en proceso
            if (
              estadoActual === "Dañado - Baja" ||
              estadoActual === "Desgastado" ||
              estadoActual === "En Mantenimiento"
            ) {
              return `
                  <button type="button" class="btn btn-warning btn-round btn-sm process-renewal" 
                          data-id="${data}" data-toggle="modal" data-target="#myModal" title="Procesar Mantenimiento o Baja">
                      <i class="material-icons">build</i> Procesar
                  </button>
                `;
            } else {
              return `
                  <button type="button" class="btn btn-default btn-round btn-sm disabled" title="No requiere acción">
                      <i class="material-icons">thumb_up</i> OK
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
    $("body").off("click", "#datatablesRenovar .process-renewal");

    $("body").on("click", "#datatablesRenovar .process-renewal", (e: any) => {
      e.preventDefault();
      const idEjemplar = $(e.currentTarget).data("id");
      this.cargarDetalleProceso(idEjemplar);
    });
  }

  // FUNCIÓN: Carga los detalles del ejemplar en el formulario del modal
  public cargarDetalleProceso(idEjemplar: string): void {
    const material = this.materialList.find((m) => m.idEjemplar === idEjemplar);

    if (material) {
      let estadoSugerido:
        | "En Mantenimiento"
        | "Reincorporado"
        | "Desincorporado";

      // Sugerir la acción inicial basada en el estado actual
      if (material.estadoFisicoActual === "Dañado - Baja") {
        estadoSugerido = "Desincorporado";
      } else if (material.estadoFisicoActual === "En Mantenimiento") {
        estadoSugerido = "Reincorporado";
      } else {
        estadoSugerido = "En Mantenimiento";
      }

      this.selectedProcessForm = {
        material: material,
        fechaProceso: this.getTodayDate(),
        estadoNuevo: estadoSugerido,
        razon: "",
        costoEstimado: 0,
      };
    } else {
      this.selectedProcessForm = null;
      console.error(`Material con ID ${idEjemplar} no encontrado.`);
    }
  }

  // FUNCIÓN: Simula el registro del Proceso de Renovación/Baja
  public procesarMantenimiento(): void {
    if (this.selectedProcessForm) {
      const m = this.selectedProcessForm.material;
      alert(
        `✅ Proceso registrado para el ejemplar #${m.idEjemplar} (${m.titulo}). Nuevo estado: ${this.selectedProcessForm.estadoNuevo}.`
      );

      // 1. Simulación: Actualizar la data en Angular (cambiar estado físico)
      const index = this.materialList.findIndex(
        (e) => e.idEjemplar === m.idEjemplar
      );
      if (index !== -1) {
        // Sincronizar el estado del ejemplar con la acción realizada
        this.materialList[index].estadoFisicoActual =
          this.selectedProcessForm.estadoNuevo === "Reincorporado"
            ? "Buen Estado"
            : this.selectedProcessForm.estadoNuevo;
      }

      $("#myModal").modal("hide");
      this.selectedProcessForm = null; // Limpiar el objeto

      // 2. Reiniciar la tabla para reflejar el nuevo estado (se necesita un re-draw)
      this.reinitializeTable();
    }
  }

  // Función para destruir y recrear la tabla
  private reinitializeTable(): void {
    const table = $("#datatablesRenovar").DataTable();
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
