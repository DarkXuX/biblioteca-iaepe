import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { AdquisicionesComponent } from './adquisiciones.component';
import { AdquisicionesRoutes } from './adquisiciones.routing';
import { MatSelectModule } from "@angular/material/select";

@NgModule({
    imports: [
    CommonModule,
    RouterModule.forChild(AdquisicionesRoutes),
    FormsModule,
    MatSelectModule
],
    declarations: [AdquisicionesComponent]
})

export class AdquisicionesModule {}
