import { Routes } from '@angular/router';

import { CatalogacionComponent } from './catalogacion.component';

export const CatalogacionRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: '',
        component: CatalogacionComponent
    }]
}
];
