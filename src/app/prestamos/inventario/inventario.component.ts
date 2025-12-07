import { Component, OnInit, AfterViewInit } from "@angular/core";

// Interfaces de apoyo
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

interface Ejemplar {
  id: string; // ID Inventario / ISBN
  titulo: string;
  autor: string;
  status: "Prestado" | "Disponible" | "Desincorporado"; 
  clasificacion?: string;
  ubicacionFisica?: string;
  // 🚩 CORRECCIÓN: Renombrado a 'estantePeldano'
  estantePeldano?: string; 
  // 🚩 CORRECCIÓN: Renombrado a 'condicionActual'
  condicionActual?: string; 
  observaciones?: string;
  // Datos del préstamo activo (opcional)
  prestamo?: { 
    usuario: string;
    cedula: string;
    fechaEsperada: string;
    condicionSalida: string;
  }
}

declare const $: any; // Declaración para usar jQuery / DataTables

@Component({
  selector: "app-inventario-cmp",
  templateUrl: "./inventario.component.html",
})
export class InventarioComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  
  // PROPIEDAD: Almacena el ejemplar seleccionado para el modal
  selectedEjemplar: Ejemplar | null = null;

  ngOnInit() {
    this.dataTable = {
      headerRow: ["ID/ISBN", "Nombre", "Autor", "Estado", "Actions"],
      footerRow: ["ID/ISBN", "Nombre", "Autor", "Estado", "Actions"],

      // Datos de ejemplo
      dataRows: [
        ["ISBN-001", "El Señor de los Anillos", "J.R.R. Tolkien", "Prestado", "Actions"],
        ["ISBN-002", "El Principito", "Antoine de Saint-Exupéry", "Disponible", "Actions"],
        ["ISBN-003", "Cien Años de Soledad", "Gabriel García Márquez", "Disponible", ""],
        ["ISBN-004", "El Hobbit", "J.R.R. Tolkien", "Prestado", "Actions"],
        ["ISBN-005", "Moby Dick", "Herman Melville", "Desincorporado", "Actions"],
      ],
    };
  }

  ngAfterViewInit() {
    this.initializeDataTable();
    this.setupDataTableClickHandlers();
    $(".card .material-datatables label").addClass("form-group");
  }

  // Inicializa DataTables
  private initializeDataTable(): void {
    $("#datatablesInventario").DataTable({
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
      data: this.dataTable.dataRows,
      columnDefs: [
        {
          targets: -1,
          className: "text-right",
          orderable: false,
          render: function (data, type, row) {
            const ejemplarId = row[0];
            return `
            <div class="dropdown">
                <button href="#" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                    Acciones
                    <b class="caret"></b>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="javascript:void(0);" class="view-detail" data-id="${ejemplarId}">Ver Detalle / Gestionar</a></li>
                    <li class="divider"></li>
                    <li><a href="javascript:void(0);" class="remove">Dar de Baja</a></li>
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
              case "disponible":
                badgeClass = "badge-success";
                break;
              case "desincorporado":
                badgeClass = "badge-danger"; 
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
  
  // Configura los manejadores de clics de DataTables
  private setupDataTableClickHandlers(): void {
      const table = $("#datatablesInventario").DataTable();
      
      table.on("click", ".view-detail", (e: any) => {
          e.preventDefault();
          
          const ejemplarId = $(e.currentTarget).data('id'); 
          
          this.cargarDetalleEjemplar(ejemplarId); 
          $('#myModal').modal('show');
      });

      table.on("click", ".remove", function (e) {
          const $tr = $(this).closest("tr");
          table.row($tr).remove().draw();
          e.preventDefault();
      });
  }

  // MÉTODO CLAVE: Simula la llamada a la API y carga los datos del ejemplar
  public cargarDetalleEjemplar(ejemplarId: string): void {
    
    // --- SIMULACIÓN DE CARGA DE DATOS ---
    if (ejemplarId === 'ISBN-001') {
        this.selectedEjemplar = {
            id: ejemplarId,
            titulo: "El Señor de los Anillos: La Comunidad del Anillo",
            autor: "J.R.R. Tolkien",
            status: "Prestado", 
            clasificacion: "FICCION T654e",
            ubicacionFisica: "Sala Principal",
            // 🚩 CORRECCIÓN en la propiedad
            estantePeldano: "F-12", 
            // 🚩 CORRECCIÓN en la propiedad
            condicionActual: "Deterioro moderado",
            observaciones: "Tiene una mancha en la cubierta. Devolución próxima.",
            prestamo: {
                usuario: "Juan Pérez",
                cedula: "V-12.345.678",
                fechaEsperada: "20/12/2025",
                condicionSalida: "Excelente"
            }
        };
    } else if (ejemplarId === 'ISBN-005') {
        this.selectedEjemplar = {
            id: ejemplarId,
            titulo: "Moby Dick",
            autor: "Herman Melville",
            status: "Desincorporado",
            clasificacion: "CLÁSICOS M123d",
            ubicacionFisica: "Depósito",
            // 🚩 CORRECCIÓN en la propiedad
            estantePeldano: "D-5",
            // 🚩 CORRECCIÓN en la propiedad
            condicionActual: "Mal estado",
            observaciones: "Ejemplar dado de baja por daños irreparables.",
        };
    } else {
         this.selectedEjemplar = {
            id: ejemplarId,
            titulo: "Ejemplar Disponible",
            autor: "Autor Genérico",
            status: "Disponible",
            clasificacion: "GENERAL",
            ubicacionFisica: "Sala Principal",
            // 🚩 CORRECCIÓN en la propiedad
            estantePeldano: "G-1",
            // 🚩 CORRECCIÓN en la propiedad
            condicionActual: "Excelente",
            observaciones: "Ejemplar en perfecto estado y disponible para préstamo.",
        };
    }
  }
}