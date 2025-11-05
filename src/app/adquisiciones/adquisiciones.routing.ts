import { Routes } from '@angular/router';

import { AdquisicionesComponent } from './adquisiciones.component';

export const AdquisicionesRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: '',
        component: AdquisicionesComponent
    }]
}
];
