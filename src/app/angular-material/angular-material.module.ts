import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [],
  // #Note A feature angler offers is that you can remove the import array and just export them and re-importing 
  // , will be done automatically by angular
  
  // imports: [
  //   MatInputModule,
  //   MatCardModule,
  //   MatButtonModule,
  //   MatToolbarModule,
  //   MatExpansionModule,
  //   MatProgressSpinnerModule,
  //   MatPaginatorModule,
  //   MatDialogModule,
  //   CommonModule
  // ],
  // by default these imports not exported to other modules
  // so, to make them usable in another module we need to export them
  exports:[
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
  ]
})
export class AngularMaterialModule { }
