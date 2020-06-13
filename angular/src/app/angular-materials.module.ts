
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';

@NgModule({
  exports: [ MatDialogModule, MatButtonModule, MatInputModule, MatCardModule, MatProgressSpinnerModule, MatPaginatorModule
  ]
})
export class AngularMaterials {

}
