import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatPaginator, MatSort } from '@angular/material';
import { EventEmitter } from '@angular/core';
export declare type FetchFunction<T> = (filter: string, sortColumn: string, sortDirection: string, offset: number, fetchSize: number) => Promise<{
    count: number;
    items: T[];
}>;
export declare type ChangeFunction<T> = (column: string, values: T) => Promise<void>;
export declare class AsyncDataSource<T> implements DataSource<T> {
    private uniqueKey;
    private fetchData;
    private changeData;
    private debounce;
    private paginator;
    private sort;
    private filter;
    private renderedRowsSubject;
    private loadingSubject;
    private bufferingSubject;
    private saveErrorSubject;
    private rows;
    private rowsViews;
    private currentView;
    private currentOffset;
    private savingRows;
    private savingRowsViews;
    private currentSavingRowsView;
    renderedSavingRows: Map<string, BehaviorSubject<boolean>>[];
    readonly loading: Observable<boolean>;
    readonly buffering: Observable<boolean>;
    readonly saveError: Observable<string>;
    readonly renderedRows: T[];
    readonly renderedRowsObservable: Observable<T[]>;
    constructor(uniqueKey: any, fetchData: FetchFunction<T>, changeData: ChangeFunction<T>, debounce?: number);
    connect(collectionViewer: CollectionViewer): Observable<T[]>;
    disconnect(collectionViewer: CollectionViewer): void;
    setup(paginator: MatPaginator, sort: MatSort, filterEvent: EventEmitter<string>, editedEvent: EventEmitter<{
        column: string;
        values: T;
        rowIndex: number;
    }>): void;
    private updateCurrentView();
    private updateRenderedRows();
}
