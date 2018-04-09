import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
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
  templateUrl: 'data-table.component.html',
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

        console.log(this.dataSource.data);

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
