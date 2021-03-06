import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatTableModule, MatDatepickerModule,
  MatNativeDateModule, MatSelectModule, MatIconModule, MatMenuModule, MatPaginatorModule, MatSortModule, MatProgressBarModule,
  MatSnackBarModule, MatButtonModule
} from '@angular/material';

import { DataTableComponent } from './components/data-table/data-table.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatButtonModule,
    FormsModule
  ],
  declarations: [
    DataTableComponent
  ],
  exports: [
    DataTableComponent
  ],
  providers: [

  ]
})
export class DataTableModule {
  public static forRoot(): ModuleWithProviders {

    return {
      ngModule: DataTableModule,
      providers: [
      ]
    };
  }
}
