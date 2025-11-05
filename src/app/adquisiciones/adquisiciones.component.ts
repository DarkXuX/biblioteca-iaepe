import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-adquisiciones-cmp",
  templateUrl: "./adquisiciones.component.html",
})
export class AdquisicionesComponent implements OnInit {
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];
  currentCity: string[];

  ngOnInit() {}
}
