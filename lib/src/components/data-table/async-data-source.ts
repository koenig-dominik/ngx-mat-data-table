import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

type FetchFunction<T> = (filter: string, sortColumn: string, sortDirection: string, offset: number, pageSize: number) => Promise<T[]>;

export class AsyncDataSource<T> implements DataSource<T> {

  private renderedRows = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject(false);
  private bufferingSubject = new BehaviorSubject(false);

  private rows = new Map<string, T[]>();
  private sortedRows = new Map<string, T[]>();

  public readonly loading = this.loadingSubject.asObservable();
  public readonly buffering = this.bufferingSubject.asObservable();

  constructor(private uniqueKey, private fetchData: FetchFunction<T>) {}

  /**
   * Used by the MatTable. Called when it connects to the data source.
   * @docs-private
   */
  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.renderedRows.asObservable();
  }

  /**
   * Used by the MatTable. Called when it is destroyed. No-op.
   * @docs-private
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.renderedRows.complete();
    this.loadingSubject.complete();
    this.bufferingSubject.complete();
  }

  public async fetch(filter: string, sortColumn: string, sortDirection: string, offset: number, pageSize: number) {
    const newRows = await this.fetchData(filter, sortColumn, sortDirection, offset, pageSize);
  }

}
