import { Component, OnInit, AfterViewInit } from "@angular/core";

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare const $: any;

@Component({
  selector: "app-inventario-cmp",
  templateUrl: "./inventario.component.html",
})

export class InventarioComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;

  ngOnInit() {
    this.dataTable = {
     headerRow: [
        "ISBN",
        "Nombre",
        "Autor",
        "Estado",
        "Actions",
      ],
      footerRow: [
        "ISBN",
        "Nombre",
        "Autor",
        "Estado",
        "Actions",
      ],

      dataRows: [
        [
          "978-0321765723",
          "El Señor de los Anillos",
          "J.R.R. Tolkien",
          "Prestado",
          "Actions",
        ],
        [
          "978-1400031702",
          "El Principito",
          "Antoine de Saint-Exupéry",
          "Prestado",
          "Actions",
        ],
        [
          "978-0743273565",
          "Cien Años de Soledad",
          "Gabriel García Márquez",
          "Prestado",
          "",
        ],
        [
          "978-0439708180",
          "El Hobbit",
          "J.R.R. Tolkien",
          "Prestado",
          "Actions",
        ],
        [
          "978-0061120084",
          "Moby Dick",
          "Herman Melville",
          "Prestado",
          "Actions",
        ],
        [
          "978-0451524935",
          "1984",
          "George Orwell",
          "Prestado",
          "Actions",
        ],
        [
          "978-0060930335",
          "Orgullo y Prejuicio",
          "Jane Austen",
          "Prestado",
          "Actions",
        ],
        [
          "978-0385504201",
          "El Código Da Vinci",
          "Dan Brown",
          "Prestado",
          "Actions",
        ],
        [
          "978-0544003415",
          "Harry Potter y la Piedra Filosofal",
          "J.K. Rowling",
          "Prestado",
          "Actions",
        ],
        [
          "978-0743273565",
          "Drácula",
          "Bram Stoker",
          "Prestado",
          "Actions",
        ],
      ],
    };
  }

  ngAfterViewInit() {
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
      // 1. Pasamos los datos como antes
      data: this.dataTable.dataRows,
      // 2. AÑADIMOS ESTA SECCIÓN PARA DEFINIR LAS COLUMNAS
      columnDefs: [
         // REGLA #1: Para la última columna (ACCIONES) - Ya la tenías
        {
          targets: -1,
          className: "text-right",
          orderable: false,
          render: function (data, type, row) {
            return `
            <div class="dropdown">
                <button href="#" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="true" >
                    Regular
                    <b class="caret"></b>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" data-toggle="modal" data-target="#myModal">ABRIR MODAL</a></li>
                    <li class="divider"></li>
                    <li><a href="#">Separated link</a></li>
                </ul>
            </div>
          `;
          },
        },
        // --- REGLA #2: NUEVA REGLA PARA LA COLUMNA DE ESTADO ---
        {
          // Apuntamos a la cuarta columna (índice 3)
          targets: 3,
          render: function (data, type, row) {
            // 'data' aquí será el texto: "Prestado", "Disponible", etc.
            let badgeClass = "";

            // Asignamos una clase de color diferente según el estado
            switch (data.toLowerCase()) {
              case "prestado":
                badgeClass = "badge-warning"; // Amarillo para 'Prestado'
                break;
              case "disponible":
                badgeClass = "badge-success"; // Verde para 'Disponible'
                break;
              case "en reparación":
                badgeClass = "badge-danger"; // Rojo para 'En Reparación'
                break;
              default:
                badgeClass = "badge-secondary"; // Gris para cualquier otro estado
            }

            // Devolvemos el HTML del badge con la clase y el texto dinámicos
            return `<div class="badge fs-6 w-100 ${badgeClass}">${data}</div>`;
          },
        },
      ],
    });

    const table = $("#datatablesInventario").DataTable();

    // Edit record
    table.on("click", ".edit", function (e) {
      let $tr = $(this).closest("tr");
      if ($($tr).hasClass("child")) {
        $tr = $tr.prev(".parent");
      }

      var data = table.row($tr).data();
      alert(
        "You press on Row: " +
          data[0] +
          " " +
          data[1] +
          " " +
          data[2] +
          "'s row."
      );
      e.preventDefault();
    });

    // Delete a record
    table.on("click", ".remove", function (e) {
      const $tr = $(this).closest("tr");
      table.row($tr).remove().draw();
      e.preventDefault();
    });

    //Like record
    table.on("click", ".like", function (e) {
      alert("You clicked on Like button");
      e.preventDefault();
    });

    $(".card .material-datatables label").addClass("form-group");
  }
}
