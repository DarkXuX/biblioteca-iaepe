import { Routes } from "@angular/router";

import { CatalogacionComponent } from "./catalogacion.component";

export const CatalogacionRoutes: Routes = [
  {
    path: "",
    children: [
      {
        // Ruta para la creación (sin ID): http://localhost:4200/#/catalogacion
        path: "",
        component: CatalogacionComponent,
      },
      {
        // 🚩 RUTA NECESARIA PARA LA EDICIÓN (con ID):
        // http://localhost:4200/#/catalogacion/123
        path: ":id", // El parámetro se define aquí
        component: CatalogacionComponent,
      },
    ],
  },
];
