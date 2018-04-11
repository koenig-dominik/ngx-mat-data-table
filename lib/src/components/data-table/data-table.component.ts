import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {merge} from 'rxjs/observable/merge';
import {AsyncDataSource} from './async-data-source';

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

  @Input() dataSource: AsyncDataSource<T>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['select'];
  selection = new SelectionModel<any[]>(true, []);
  filter: string;
  filterChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit() {
    for (const column of this.columns) {
      this.displayedColumns.push(column.name);
    }

    this.dataSource.setup(this.paginator, this.sort, this.filterChanged);

    // If the user changes the sort or the filter, reset back to the first page.
    merge(this.sort.sortChange, this.filterChanged).subscribe(() => this.paginator.pageIndex = 0);
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
      this.selection.select(this.dataSource.renderedRows);
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
