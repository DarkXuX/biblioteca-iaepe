import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../app.module";
import { MatFormFieldModule } from '@angular/material/form-field'; // Para <mat-form-field>
import { MatInputModule } from '@angular/material/input';         // Para input[matInput]
import { MatDatepickerModule } from '@angular/material/datepicker'; // Para <mat-datepicker> y toggle
import { MatNativeDateModule } from '@angular/material/core';     // Para el DatePicker
import { MatSelectModule } from '@angular/material/select';       // Para <mat-select> y <mat-option>
import { MatRadioModule } from '@angular/material/radio';         // Para <mat-radio-group>
// Si estás usando botones con 'mat-raised-button'
import { MatButtonModule } from '@angular/material/button';

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

import { PrestamosRoutes } from "./prestamos.routing";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PrestamosRoutes),
    FormsModule,
    MaterialModule,
    // --- 🎯 Añadir los módulos de Material aquí 🎯 ---
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
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
    ReportesComponent,
    ReservarComponent,
    SuspenderMultasComponent
  ],
})
export class PrestamosModule {}
