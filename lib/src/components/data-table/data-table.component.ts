import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatSort} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {merge} from 'rxjs';
import {skip} from 'rxjs/operators';

import {AsyncDataSource} from '../../async-data-source';

@Component({
  selector: 'ngx-mat-data-table',
  templateUrl: 'data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T> implements OnInit {

  @Input() title: string;
  @Input() columns: Column[];
  @Input() sortColumn: string;
  @Input() uniqueColumn: string;
  @Input() pageSizeOptions: number[] = [5, 10, 15];
  @Input() pageSize = 5;
  @Input() buttons: Button<T>[];

  @Input() dataSource: AsyncDataSource<T>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['select'];
  selection = new SelectionModel<T>(true, []);

  filter: string;
  private filterChanged = new EventEmitter<string>();

  private cellChanged = new EventEmitter<{column: string, values: T, rowIndex: number}>();

  constructor(private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    for (const column of this.columns) {
      this.displayedColumns.push(column.name);
    }

    this.dataSource.setup(this.paginator, this.sort, this.filterChanged, this.cellChanged);

    // If the user changes the sort or the filter, reset back to the first page.
    merge(this.sort.sortChange, this.filterChanged).subscribe(() => this.paginator.pageIndex = 0);

    this.dataSource.saveError.pipe(skip(1)).subscribe((error) => {
      this.snackBar.open(error, null, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    });
  }

  cellChange(column: string, row: T, newValue: any, rowIndex: number) {
    row[column] = newValue;

    this.cellChanged.emit({column: column, values: row, rowIndex: rowIndex});
  }

  filterChange(newValue: string) {
    this.filter = newValue.trim().toLowerCase(); // Remove whitespace; MatTableDataSource defaults to lowercase matches
    this.filterChanged.emit(this.filter);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.renderedRows);
    }
  }

  /** Whether the number of selected elements matches the total number of rows displayed. */
  private isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedRows.length;
    return numSelected === numRows;
  }
}

export interface Column {
  name: string;
  label: string;
  width?: string;
  editable?: boolean;
  maxLength?: number;
  values?: (string | number)[];
}

export interface Button<T> {
  icon: string;
  action: (selected: T[]) => void;
  selectionRequired: boolean;
  multiSelection: boolean;
}
