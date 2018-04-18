import { OnInit } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import 'rxjs/add/operator/skip';
import { AsyncDataSource } from './async-data-source';
export declare class DataTableComponent<T> implements OnInit {
    private snackBar;
    title: string;
    columns: Column[];
    sortColumn: string;
    uniqueColumn: string;
    dataSource: AsyncDataSource<T>;
    paginator: MatPaginator;
    sort: MatSort;
    displayedColumns: string[];
    selection: SelectionModel<T>;
    filter: string;
    private filterChanged;
    private cellChanged;
    constructor(snackBar: MatSnackBar);
    ngOnInit(): void;
    cellChange(column: string, row: T, newValue: any, rowIndex: number): void;
    filterChange(newValue: string): void;
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void;
    /** Whether the number of selected elements matches the total number of rows displayed. */
    private isAllSelected();
}
export interface Column {
    name: string;
    label: string;
    width?: string;
    editable?: boolean;
    maxLength?: number;
    values?: (string | number)[];
}
