import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { CatalogacionComponent } from './catalogacion.component';
import { CatalogacionRoutes } from './catalogacion.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CatalogacionRoutes),
        FormsModule
    ],
    declarations: [CatalogacionComponent]
})

export class CatalogacionModule {}
