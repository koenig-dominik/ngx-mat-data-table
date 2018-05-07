import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable, BehaviorSubject, merge} from 'rxjs';
import {MatPaginator, MatSort} from '@angular/material';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EventEmitter} from '@angular/core';

export type FetchFunction<T> = (
  filter: string,
  sortColumn: string,
  sortDirection: string,
  offset: number,
  fetchSize: number
) => Promise<{
  count: number,
  items: T[]
}>;

export type ChangeFunction<T> = (
  column: string,
  values: T
) => Promise<void>;

export class AsyncDataSource<T> implements DataSource<T> {

  private paginator: MatPaginator;
  private sort: MatSort;
  private filter = '';

  private renderedRowsSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject(false);
  private bufferingSubject = new BehaviorSubject(false);
  private saveErrorSubject = new BehaviorSubject('');

  private rows = new Map<string, T>();
  private rowsViews = new Map<string, T[]>();
  private currentView: T[];
  private currentOffset: number;

  private savingRows = new Map<string, Map<string, BehaviorSubject<boolean>>>();
  private savingRowsViews = new Map<string, Map<string, BehaviorSubject<boolean>>[]>();
  private currentSavingRowsView: Map<string, BehaviorSubject<boolean>>[];

  public renderedSavingRows: Map<string, BehaviorSubject<boolean>>[];

  public readonly loading = this.loadingSubject.asObservable();
  public readonly buffering = this.bufferingSubject.asObservable();
  public readonly saveError = this.saveErrorSubject.asObservable();
  public get renderedRows() {
    return this.renderedRowsSubject.value;
  }

  constructor(private uniqueKey, private fetchData: FetchFunction<T>, private changeData: ChangeFunction<T>, private debounce = 300) {}

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.renderedRowsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.renderedRowsSubject.complete();
    this.loadingSubject.complete();
    this.bufferingSubject.complete();
    this.saveErrorSubject.complete();

    /*for (const savingRow of this.savingCells) {
      for (const savingSubject of Array.from(savingRow.values())) {
        savingSubject.complete();
      }
    }*/
  }

  public setup(
    paginator: MatPaginator,
    sort: MatSort,
    filterEvent: EventEmitter<string>,
    editedEvent: EventEmitter<{column: string, values: T, rowIndex: number}>
  ): void {
    this.paginator = paginator;
    this.sort = sort;

    merge(
      filterEvent,
      this.sort.sortChange,
      this.paginator.page
    ).pipe(
      tap((value) => {
        if (typeof value === 'string') { // If the value is of type string it must be the filter
          this.filter = value;
        }

        this.bufferingSubject.next(true);
      }),
      debounceTime(this.debounce),
      tap(() => {
        this.bufferingSubject.next(false);
      }),
      distinctUntilChanged((oldValue: any, newValue: any) => { // Ignore all events until the value was actually changed
        if (oldValue.pageIndex !== undefined) { // Handle paginator events
          return oldValue.pageIndex === newValue.pageIndex && oldValue.pageSize === newValue.pageSize;

        } else if (oldValue.direction !== undefined) { // Handle sort events
          return oldValue.active === newValue.active && oldValue.direction === newValue.direction;

        } else { // Handle filter events
          return oldValue === newValue;
        }
      })
    ).subscribe(() => {
      // noinspection JSIgnoredPromiseFromCall
      this.updateCurrentView();
    });
    Promise.resolve().then(() => { // This skips one tick. This is needed for the paginator and sorter to work correctly
      // noinspection JSIgnoredPromiseFromCall
      this.updateCurrentView();
    });

    editedEvent.pipe(
      debounceTime(this.debounce)
    ).subscribe(async (event) => {
      const renderedSavingRow = this.renderedSavingRows[event.rowIndex];
      renderedSavingRow.get(event.column).next(true);

      try {
        await this.changeData(event.column, event.values);
      } catch (error) {
        this.saveErrorSubject.next(error);
      } finally {
        renderedSavingRow.get(event.column).next(false);
      }
    });
  }

  private async updateCurrentView() {
    this.currentOffset = this.paginator.pageIndex * this.paginator.pageSize;

    this.loadingSubject.next(true);
    const result = await this.fetchData(
      this.filter,
      this.sort.active,
      this.sort.direction,
      this.currentOffset,
      this.paginator.pageSize
    );

    this.paginator.length = result.count;

    const viewKey = `${this.filter};${this.sort.active};${this.sort.direction}`;
    if (this.rowsViews.has(viewKey) === false) {
      this.rowsViews.set(viewKey, []);
      this.savingRowsViews.set(viewKey, []);
    }
    this.currentView = this.rowsViews.get(viewKey);
    this.currentSavingRowsView = this.savingRowsViews.get(viewKey);

    for (let i = 0, length = result.items.length; i < length; i++) {
      const row = result.items[i];
      const uniqueValue = row[this.uniqueKey];

      // This is here, so that the rowsViews don't lose their references to the original row
      if (!this.rows.has(uniqueValue)) {
        this.rows.set(uniqueValue, row);
      } else {
        for (const column in row) {
          if (!row.hasOwnProperty(column)) {
            continue;
          }

          this.rows.get(uniqueValue)[column] = row[column];
        }
      }

      if (!this.savingRows.has(uniqueValue)) {
        const columns = new Map<string, BehaviorSubject<boolean>>();
        for (const column in row) {
          if (!row.hasOwnProperty(column)) {
            continue;
          }

          columns.set(column, new BehaviorSubject(false));
        }
        this.savingRows.set(uniqueValue, columns);
      }

      this.currentView[this.currentOffset + i] = this.rows.get(uniqueValue);
      this.currentSavingRowsView[this.currentOffset + i] = this.savingRows.get(uniqueValue);
    }

    this.updateRenderedRows();

    this.loadingSubject.next(false);
  }

  private updateRenderedRows() {
    this.renderedSavingRows = this.currentSavingRowsView.slice(
      this.currentOffset,
      this.currentOffset + this.paginator.pageSize
    );

    this.renderedRowsSubject.next(
      this.currentView.slice(
        this.currentOffset,
        this.currentOffset + this.paginator.pageSize
      )
    );
  }

}
