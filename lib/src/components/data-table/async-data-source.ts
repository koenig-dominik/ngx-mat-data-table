import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatPaginator, MatSort} from '@angular/material';
import {merge} from 'rxjs/observable/merge';
import {tap} from 'rxjs/operators';
import {debounceTime} from 'rxjs/operators/debounceTime';
import {distinctUntilChanged} from 'rxjs/operators/distinctUntilChanged';
import {EventEmitter} from '@angular/core';

type FetchFunction<T> = (
  filter: string,
  sortColumn: string,
  sortDirection: string,
  offset: number,
  fetchSize: number
) => Promise<{
  count: number,
  items: T[]
}>;

export class AsyncDataSource<T> implements DataSource<T> {

  private renderedRowsSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject(false);
  private bufferingSubject = new BehaviorSubject(false);

  private rows = new Map<string, T[]>();
  private rowsViews = new Map<string, T[]>();
  private currentView: T[];
  private currentOffset: number;

  public readonly loading = this.loadingSubject.asObservable();
  public readonly buffering = this.bufferingSubject.asObservable();
  public get renderedRows() {
    return this.renderedRowsSubject.value;
  }

  private paginator: MatPaginator;
  private sort: MatSort;
  private filter = '';

  constructor(private uniqueKey, private fetchData: FetchFunction<T>, private debounce = 300) {}

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.renderedRowsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.renderedRowsSubject.complete();
    this.loadingSubject.complete();
    this.bufferingSubject.complete();
  }

  public setup(paginator: MatPaginator, sort: MatSort, filterEvent: EventEmitter<string>): void {
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
    }
    this.currentView = this.rowsViews.get(viewKey);

    for (let i = 0, length = result.items.length; i < length; i++) {
      const row = result.items[i];
      this.rows[row[this.uniqueKey]] = row;

      this.currentView[this.currentOffset + i] = this.rows[row[this.uniqueKey]];
    }

    console.log('rowsView', this.currentView);
    this.updateRenderedRows();

    this.loadingSubject.next(false);
  }

  private updateRenderedRows() {
    this.renderedRowsSubject.next(
      this.currentView.slice(
        this.currentOffset,
        this.currentOffset + this.paginator.pageSize
      )
    );
  }

}
