import { OnDestroy, OnInit } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AsyncDataSource } from '../../async-data-source';
export declare class DataTableComponent<T> implements OnInit, OnDestroy {
    private snackBar;
    title: string;
    columns: Column[];
    sortColumn: string;
    pageSizeOptions: number[];
    pageSize: number;
    buttons: Button<T>[];
    dataSource: AsyncDataSource<T>;
    paginator: MatPaginator;
    sort: MatSort;
    displayedColumns: string[];
    selection: SelectionModel<T>;
    filter: string;
    private filterChanged;
    private cellChanged;
    private renderedRowsSubscription;
    constructor(snackBar: MatSnackBar);
    ngOnInit(): void;
    ngOnDestroy(): void;
    cellChange(column: string, row: T, newValue: any, rowIndex: number): void;
    filterChange(newValue: string): void;
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void;
    /** Whether the number of selected elements matches the total number of rows displayed. */
    isAllSelected(): boolean;
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
