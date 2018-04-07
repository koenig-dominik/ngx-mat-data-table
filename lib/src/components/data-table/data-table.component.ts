import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {merge} from 'rxjs/observable/merge';
import {debounceTime} from 'rxjs/operators/debounceTime';
import {distinctUntilChanged} from 'rxjs/operators/distinctUntilChanged';
import {switchMap} from 'rxjs/operators/switchMap';
import {Observable} from 'rxjs/Observable';
import {startWith, tap} from 'rxjs/operators';

@Component({
  selector: 'ngx-mat-data-table',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{title}}</mat-card-title>
        <mat-card-subtitle>
          <mat-form-field>
            <input [ngModel]="filter" (ngModelChange)="filterChange($event)" matInput placeholder="Filter">
          </mat-form-field>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-progress-bar *ngIf="loading || debouncing" [mode]="debouncing ? 'buffer' : 'indeterminate'"></mat-progress-bar>
        <mat-table #table [dataSource]="dataSource"
                   matSort [matSortActive]="sortColumn" matSortDisableClear matSortDirection="asc">

          <!-- Checkbox Column -->
          <ng-container matColumnDef="select">
            <mat-header-cell *matHeaderCellDef>
              <mat-checkbox (change)="$event ? masterToggle() : null"
                            [checked]="selection.hasValue() && isAllSelected()"
                            [indeterminate]="selection.hasValue() && !isAllSelected()">
              </mat-checkbox>
            </mat-header-cell>
            <mat-cell *matCellDef="let row">
              <mat-checkbox (click)="$event.stopPropagation()"
                            (change)="$event ? selection.toggle(row) : null"
                            [checked]="selection.isSelected(row)">
              </mat-checkbox>
            </mat-cell>
          </ng-container>

          <ng-container *ngFor="let column of columns" [matColumnDef]="column.name">
            <mat-header-cell mat-sort-header *matHeaderCellDef [style.max-width]="column.width">{{column.label}}</mat-header-cell>
            <mat-cell *matCellDef="let row" [style.max-width]="column.width">
              <ng-container *ngIf="!column.editable; else editable">
                
                <ng-container *ngIf="row[column.name].constructor.name !== 'Date'; else date">
                  {{row[column.name]}}
                </ng-container>
                
                <ng-template #date>
                  {{row[column.name] | date}}
                </ng-template>
                
              </ng-container>
              <ng-template #editable>
                
                <ng-container *ngIf="column.values; else elseIf">
                  <mat-form-field>
                    <mat-select [value]="row[column.name]">
                      <mat-option *ngFor="let value of column.values" [value]="value">
                        {{ value }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </ng-container>
                
                <ng-template #elseIf>
                  <ng-container *ngIf="row[column.name].constructor.name !== 'Date'; else datepicker">
                    <div class="edit-button" [matMenuTriggerFor]="menu">
                      {{row[column.name]}}
                      <mat-icon>edit_mode</mat-icon>
                    </div>
                    <mat-menu #menu="matMenu">
                      <div mat-menu-item disabled class="full-height-menu-item">
                        <mat-form-field class="mat-cell"> <!-- mat-cell is a hack to override the disabled state of mat-menu-item -->
                          <input matInput #message [attr.maxlength]="column.maxLength" [value]="row[column.name]">
                          <mat-hint align="end">{{message.value.length}} / {{column.maxLength}}</mat-hint>
                        </mat-form-field>
                      </div>
                    </mat-menu>
                  </ng-container>

                  <ng-template #datepicker>
                    <mat-form-field>
                      <input matInput [matDatepicker]="picker" [value]="row[column.name]">
                      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                      <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>
                  </ng-template>
                </ng-template>
                
              </ng-template>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
        <mat-paginator [pageSize]="5"
                       [pageSizeOptions]="[5, 10, 20]"
                       [length]="dataCount"
                       [showFirstLastButtons]="true">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() title: string;
  @Input() columns: Column[];
  @Input() sortColumn: string;
  @Input() uniqueColumn: string;

  @Input() loadData: (options: LoadDataOptions) => Observable<{count: number, items: {}[]}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['select'];
  dataSource = new MatTableDataSource<{}>([]);
  dataCount = 0;
  selection = new SelectionModel<any[]>(true, []);
  loading = true;
  debouncing = false;
  filter: string;
  filterChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    for (const column of this.columns) {
      this.displayedColumns.push(column.name);
    }

    // If the user changes the sort or the filter, reset back to the first page.
    merge(this.sort.sortChange, this.filterChanged).subscribe(() => this.paginator.pageIndex = 0);

    merge(
      this.filterChanged,
      this.sort.sortChange,
      this.paginator.page
    )
      .pipe(
        startWith({}), // This triggers the first load
        // wait x ms after each keystroke before considering the term
        tap(() => {
          this.debouncing = true;
        }),
        debounceTime(300),
        tap((value) => {
          if (typeof value === 'string') {
            this.dataSource.filter = value;
          }

          this.debouncing = false;
        }),
        // ignore new term if same as previous term
        distinctUntilChanged((oldValue: any, newValue: any) => {
          if (oldValue.pageIndex !== undefined) {
            return oldValue.pageIndex === newValue.pageIndex && oldValue.pageSize === newValue.pageSize;
          } else if (oldValue.direction !== undefined) {
            return oldValue.active === newValue.active && oldValue.direction === newValue.direction;
          } else {
            return oldValue === newValue;
          }
        }),

        switchMap(() => {
          this.loading = true;

          return this.loadData({
            filter: this.dataSource.filter,
            sortColumn: this.sort.active,
            sortDirection: this.sort.direction,
            offset: this.paginator.pageIndex * this.paginator.pageSize,
            pageSize: this.paginator.pageSize
          });
        })
      )
      .subscribe((data) => {
        this.loading = false;

        // Really bad hack...
        this.dataCount = data.count + 1;
        setTimeout(() => {
          this.dataCount--;
        }, 1);

        for (const row of data.items) {
          let existingRowIndex;

          let i = 0;
          for (const existingRow of this.dataSource.data) {
            if (existingRow[this.uniqueColumn] === row[this.uniqueColumn]) {
              existingRowIndex = i;
              break;
            }
            i++;
          }

          if (existingRowIndex !== undefined) {
            this.dataSource.data[existingRowIndex] = row;
          } else {
            this.dataSource.data.push(row);
          }
        }

        // noinspection SillyAssignmentJS
        this.dataSource.data = this.dataSource.data; // This is here to force a table update
      });
  }

  filterChange(newValue: string) {
    this.filter = newValue.trim().toLowerCase(); // Remove whitespace; MatTableDataSource defaults to lowercase matches
    this.filterChanged.emit(this.filter);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => {
        this.selection.select(row);
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  private isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
}

export interface LoadDataOptions {
  filter: string;
  sortColumn: string;
  sortDirection: string;
  offset: number;
  pageSize: number;
}

export interface Column {
  name: string;
  label: string;
  width?: string;
  editable?: boolean;
  maxLength?: number;
  values?: (string | number)[];
}
