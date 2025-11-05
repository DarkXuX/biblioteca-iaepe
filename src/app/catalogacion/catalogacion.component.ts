import { Component, OnInit, AfterViewInit } from "@angular/core";

// declare interface DataTable {
//   headerRow: string[];
//   footerRow: string[];
//   dataRows: string[][];
// }

// declare const $: any;

@Component({
  selector: "app-catalogacion-cmp",
  templateUrl: "catalogacion.component.html",
})
export class CatalogacionComponent implements OnInit {
  // public dataTable: DataTable;

  cities = [
      {value: 'paris-0', viewValue: 'Paris'},
      {value: 'miami-1', viewValue: 'Miami'},
      {value: 'bucharest-2', viewValue: 'Bucharest'},
      {value: 'new-york-3', viewValue: 'New York'},
      {value: 'london-4', viewValue: 'London'},
      {value: 'barcelona-5', viewValue: 'Barcelona'},
      {value: 'moscow-6', viewValue: 'Moscow'},
  ];

  typesDocs = [
      {value: 'paris-0', viewValue: 'Libro'},
      {value: 'miami-1', viewValue: 'Tesis/Disertación'},
      {value: 'bucharest-2', viewValue: 'Material Proyectable'},
      {value: 'new-york-3', viewValue: 'Recurso Digital'},
      {value: 'london-4', viewValue: 'Material Cartográfico'},
      {value: 'barcelona-5', viewValue: 'Recurso continuo (Revista)'},
      {value: 'barcelona-5', viewValue: 'Recurso continuo (Articulo de revista)'},
      {value: 'moscow-6', viewValue: 'Kit (Conjunto)'},
      {value: 'moscow-6', viewValue: 'Material mixto (Varios tipos)'},
  ];

  ngOnInit() {}

}
