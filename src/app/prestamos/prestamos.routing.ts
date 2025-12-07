import { Routes } from "@angular/router";

import { PrestamosComponent } from "./prestamos.component";

import { PoliticasPrestamoComponent } from "./politicas-de-prestamo/politicas-de-prestamo.component";
import { DevolverComponent } from "./devolver/devolver.component";
import { InventarioComponent } from "./inventario/inventario.component";
import { HistoricoItemComponent } from "./historico-item/historico-item.component";
import { HistoricoUsuarioComponent } from "./historico-usuario/historico-usuario.component";
import { PrestamoSalaComponent } from "./prestamo-en-sala/prestamo-en-sala.component";
import { PrestarComponent } from "./prestar/prestar.component";
import { RenovarComponent } from "./renovar/renovar.component";
import { ReportesComponent } from "./reportes/reportes.component";
import { ReservarComponent } from "./reservar/reservar.component";
import { SuspenderMultasComponent } from "./suspender-multas/suspender-multas.component";

export const PrestamosRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: PrestamosComponent,
      },
      {
        path: "politicas-de-prestamo",
        component: PoliticasPrestamoComponent,
      },
      {
        path: "devolver",
        component: DevolverComponent,
      },
      {
        path: "inventario",
        component: InventarioComponent,
      },{
        path: "historial-item",
        component: HistoricoItemComponent,
      },{
        path: "historial-usuario",
        component: HistoricoUsuarioComponent,
      },{
        path: "prestamo-en-sala",
        component: PrestamoSalaComponent,
      },{
        path: "prestar",
        component: PrestarComponent,
      },{
        path: "renovar",
        component: RenovarComponent,
      },{
        path: "reportes",
        component: ReportesComponent,
      },{
        path: "reservar",
        component: ReservarComponent,
      },{
        path: "suspender-multas",
        component: SuspenderMultasComponent,
      },
    ],
  },
];
