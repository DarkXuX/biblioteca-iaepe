import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";

import { PoliticasPrestamoComponent } from "./politicas-de-prestamo/politicas-de-prestamo.component";
import { DevolverComponent } from "./devolver/devolver.component";
import { InventarioComponent } from "./inventario/inventario.component";
import { HistoricoItemComponent } from "./historico-item/historico-item.component";
import { HistoricoUsuarioComponent } from "./historico-usuario/historico-usuario.component";
import { PrestamoSalaComponent } from "./prestamo-en-sala/prestamo-en-sala.component";
import { PrestarComponent } from "./prestar/prestar.component";
import { RenovarComponent } from "./renovar/renovar.component";
import { ReportesPrestamosComponent } from "./reportes/reportes.component";
import { ReservarComponent } from "./reservar/reservar.component";
import { SuspenderMultasComponent } from "./suspender-multas/suspender-multas.component";

import { PrestamosRoutes } from "./prestamos.routing";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PrestamosRoutes),
    FormsModule,
    MaterialModule,
  ],
  declarations: [
    PoliticasPrestamoComponent,
    DevolverComponent,
    InventarioComponent,
    HistoricoItemComponent,
    HistoricoUsuarioComponent,
    PrestamoSalaComponent,
    PrestarComponent,
    RenovarComponent,
    ReportesPrestamosComponent,
    ReservarComponent,
    SuspenderMultasComponent
  ],
})
export class PrestamosModule {}
