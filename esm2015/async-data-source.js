/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { BehaviorSubject, merge } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
/**
 * @template T
 */
export class AsyncDataSource {
    /**
     * @param {?} uniqueKey
     * @param {?} fetchData
     * @param {?} changeData
     * @param {?=} debounce
     */
    constructor(uniqueKey, fetchData, changeData, debounce = 300) {
        this.uniqueKey = uniqueKey;
        this.fetchData = fetchData;
        this.changeData = changeData;
        this.debounce = debounce;
        this.filter = '';
        this.renderedRowsSubject = new BehaviorSubject([]);
        this.loadingSubject = new BehaviorSubject(false);
        this.bufferingSubject = new BehaviorSubject(false);
        this.saveErrorSubject = new BehaviorSubject('');
        this.rows = new Map();
        this.rowsViews = new Map();
        this.savingRows = new Map();
        this.savingRowsViews = new Map();
        this.loading = this.loadingSubject.asObservable();
        this.buffering = this.bufferingSubject.asObservable();
        this.saveError = this.saveErrorSubject.asObservable();
        this.renderedRowsObservable = this.renderedRowsSubject.asObservable();
    }
    /**
     * @return {?}
     */
    get renderedRows() {
        return this.renderedRowsSubject.value;
    }
    /**
     * @param {?} collectionViewer
     * @return {?}
     */
    connect(collectionViewer) {
        return this.renderedRowsSubject.asObservable();
    }
    /**
     * @param {?} collectionViewer
     * @return {?}
     */
    disconnect(collectionViewer) {
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
    /**
     * @param {?} paginator
     * @param {?} sort
     * @param {?} filterEvent
     * @param {?} editedEvent
     * @return {?}
     */
    setup(paginator, sort, filterEvent, editedEvent) {
        this.paginator = paginator;
        this.sort = sort;
        merge(filterEvent, this.sort.sortChange, this.paginator.page).pipe(tap((value) => {
            if (typeof value === 'string') {
                // If the value is of type string it must be the filter
                this.filter = value;
            }
            this.bufferingSubject.next(true);
        }), debounceTime(this.debounce), tap(() => {
            this.bufferingSubject.next(false);
        }), distinctUntilChanged((oldValue, newValue) => {
            // Ignore all events until the value was actually changed
            if (oldValue.pageIndex !== undefined) {
                // Handle paginator events
                return oldValue.pageIndex === newValue.pageIndex && oldValue.pageSize === newValue.pageSize;
            }
            else if (oldValue.direction !== undefined) {
                // Handle sort events
                return oldValue.active === newValue.active && oldValue.direction === newValue.direction;
            }
            else {
                // Handle filter events
                return oldValue === newValue;
            }
        })).subscribe(() => {
            // noinspection JSIgnoredPromiseFromCall
            this.updateCurrentView();
        });
        Promise.resolve().then(() => {
            // This skips one tick. This is needed for the paginator and sorter to work correctly
            // noinspection JSIgnoredPromiseFromCall
            this.updateCurrentView();
        });
        editedEvent.pipe(debounceTime(this.debounce)).subscribe((event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const /** @type {?} */ renderedSavingRow = this.renderedSavingRows[event.rowIndex];
            renderedSavingRow.get(event.column).next(true);
            try {
                yield this.changeData(event.column, event.values);
            }
            catch (/** @type {?} */ error) {
                this.saveErrorSubject.next(error);
            }
            finally {
                renderedSavingRow.get(event.column).next(false);
            }
        }));
    }
    /**
     * @return {?}
     */
    updateCurrentView() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.currentOffset = this.paginator.pageIndex * this.paginator.pageSize;
            this.loadingSubject.next(true);
            const /** @type {?} */ result = yield this.fetchData(this.filter, this.sort.active, this.sort.direction, this.currentOffset, this.paginator.pageSize);
            this.paginator.length = result.count;
            const /** @type {?} */ viewKey = `${this.filter};${this.sort.active};${this.sort.direction}`;
            if (this.rowsViews.has(viewKey) === false) {
                this.rowsViews.set(viewKey, []);
                this.savingRowsViews.set(viewKey, []);
            }
            this.currentView = this.rowsViews.get(viewKey);
            this.currentSavingRowsView = this.savingRowsViews.get(viewKey);
            for (let /** @type {?} */ i = 0, /** @type {?} */ length = result.items.length; i < length; i++) {
                const /** @type {?} */ row = result.items[i];
                const /** @type {?} */ uniqueValue = row[this.uniqueKey];
                // This is here, so that the rowsViews don't lose their references to the original row
                if (!this.rows.has(uniqueValue)) {
                    this.rows.set(uniqueValue, row);
                }
                else {
                    for (const /** @type {?} */ column in row) {
                        if (!row.hasOwnProperty(column)) {
                            continue;
                        }
                        this.rows.get(uniqueValue)[column] = row[column];
                    }
                }
                if (!this.savingRows.has(uniqueValue)) {
                    const /** @type {?} */ columns = new Map();
                    for (const /** @type {?} */ column in row) {
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
        });
    }
    /**
     * @return {?}
     */
    updateRenderedRows() {
        this.renderedSavingRows = this.currentSavingRowsView.slice(this.currentOffset, this.currentOffset + this.paginator.pageSize);
        this.renderedRowsSubject.next(this.currentView.slice(this.currentOffset, this.currentOffset + this.paginator.pageSize));
    }
}
function AsyncDataSource_tsickle_Closure_declarations() {
    /** @type {?} */
    AsyncDataSource.prototype.paginator;
    /** @type {?} */
    AsyncDataSource.prototype.sort;
    /** @type {?} */
    AsyncDataSource.prototype.filter;
    /** @type {?} */
    AsyncDataSource.prototype.renderedRowsSubject;
    /** @type {?} */
    AsyncDataSource.prototype.loadingSubject;
    /** @type {?} */
    AsyncDataSource.prototype.bufferingSubject;
    /** @type {?} */
    AsyncDataSource.prototype.saveErrorSubject;
    /** @type {?} */
    AsyncDataSource.prototype.rows;
    /** @type {?} */
    AsyncDataSource.prototype.rowsViews;
    /** @type {?} */
    AsyncDataSource.prototype.currentView;
    /** @type {?} */
    AsyncDataSource.prototype.currentOffset;
    /** @type {?} */
    AsyncDataSource.prototype.savingRows;
    /** @type {?} */
    AsyncDataSource.prototype.savingRowsViews;
    /** @type {?} */
    AsyncDataSource.prototype.currentSavingRowsView;
    /** @type {?} */
    AsyncDataSource.prototype.renderedSavingRows;
    /** @type {?} */
    AsyncDataSource.prototype.loading;
    /** @type {?} */
    AsyncDataSource.prototype.buffering;
    /** @type {?} */
    AsyncDataSource.prototype.saveError;
    /** @type {?} */
    AsyncDataSource.prototype.renderedRowsObservable;
    /** @type {?} */
    AsyncDataSource.prototype.uniqueKey;
    /** @type {?} */
    AsyncDataSource.prototype.fetchData;
    /** @type {?} */
    AsyncDataSource.prototype.changeData;
    /** @type {?} */
    AsyncDataSource.prototype.debounce;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMtZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtbWF0LWRhdGEtdGFibGUvIiwic291cmNlcyI6WyJhc3luYy1kYXRhLXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLE9BQU8sRUFBYSxlQUFlLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXhELE9BQU8sRUFBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFtQnZFLE1BQU07Ozs7Ozs7SUE4QkosWUFBb0IsU0FBUyxFQUFVLFNBQTJCLEVBQVUsVUFBNkIsRUFBVSxXQUFXLEdBQUc7UUFBN0csY0FBUyxHQUFULFNBQVMsQ0FBQTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBbUI7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFNO3NCQTFCaEgsRUFBRTttQ0FFVyxJQUFJLGVBQWUsQ0FBTSxFQUFFLENBQUM7OEJBQ2pDLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQztnQ0FDeEIsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDO2dDQUMxQixJQUFJLGVBQWUsQ0FBQyxFQUFFLENBQUM7b0JBRW5DLElBQUksR0FBRyxFQUFhO3lCQUNmLElBQUksR0FBRyxFQUFlOzBCQUlyQixJQUFJLEdBQUcsRUFBaUQ7K0JBQ25ELElBQUksR0FBRyxFQUFtRDt1QkFLMUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUU7eUJBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUU7eUJBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUU7c0NBSXZCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUU7S0FFcUQ7Ozs7UUFMMUgsWUFBWTtRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQzs7Ozs7O0lBTXhD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QyxXQUFXLENBQUMsS0FBSyxDQUNwQixJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUM3QyxDQUNGLENBQUM7O0NBR0wiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbGxlY3Rpb25WaWV3ZXIsIERhdGFTb3VyY2V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0LCBtZXJnZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7TWF0UGFnaW5hdG9yLCBNYXRTb3J0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XHJcbmltcG9ydCB7dGFwLCBkZWJvdW5jZVRpbWUsIGRpc3RpbmN0VW50aWxDaGFuZ2VkfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmV4cG9ydCB0eXBlIEZldGNoRnVuY3Rpb248VD4gPSAoXHJcbiAgZmlsdGVyOiBzdHJpbmcsXHJcbiAgc29ydENvbHVtbjogc3RyaW5nLFxyXG4gIHNvcnREaXJlY3Rpb246IHN0cmluZyxcclxuICBvZmZzZXQ6IG51bWJlcixcclxuICBmZXRjaFNpemU6IG51bWJlclxyXG4pID0+IFByb21pc2U8e1xyXG4gIGNvdW50OiBudW1iZXIsXHJcbiAgaXRlbXM6IFRbXVxyXG59PjtcclxuXHJcbmV4cG9ydCB0eXBlIENoYW5nZUZ1bmN0aW9uPFQ+ID0gKFxyXG4gIGNvbHVtbjogc3RyaW5nLFxyXG4gIHZhbHVlczogVFxyXG4pID0+IFByb21pc2U8dm9pZD47XHJcblxyXG5leHBvcnQgY2xhc3MgQXN5bmNEYXRhU291cmNlPFQ+IGltcGxlbWVudHMgRGF0YVNvdXJjZTxUPiB7XHJcblxyXG4gIHByaXZhdGUgcGFnaW5hdG9yOiBNYXRQYWdpbmF0b3I7XHJcbiAgcHJpdmF0ZSBzb3J0OiBNYXRTb3J0O1xyXG4gIHByaXZhdGUgZmlsdGVyID0gJyc7XHJcblxyXG4gIHByaXZhdGUgcmVuZGVyZWRSb3dzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihbXSk7XHJcbiAgcHJpdmF0ZSBsb2FkaW5nU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG4gIHByaXZhdGUgYnVmZmVyaW5nU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG4gIHByaXZhdGUgc2F2ZUVycm9yU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoJycpO1xyXG5cclxuICBwcml2YXRlIHJvd3MgPSBuZXcgTWFwPHN0cmluZywgVD4oKTtcclxuICBwcml2YXRlIHJvd3NWaWV3cyA9IG5ldyBNYXA8c3RyaW5nLCBUW10+KCk7XHJcbiAgcHJpdmF0ZSBjdXJyZW50VmlldzogVFtdO1xyXG4gIHByaXZhdGUgY3VycmVudE9mZnNldDogbnVtYmVyO1xyXG5cclxuICBwcml2YXRlIHNhdmluZ1Jvd3MgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+Pj4oKTtcclxuICBwcml2YXRlIHNhdmluZ1Jvd3NWaWV3cyA9IG5ldyBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4+W10+KCk7XHJcbiAgcHJpdmF0ZSBjdXJyZW50U2F2aW5nUm93c1ZpZXc6IE1hcDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDxib29sZWFuPj5bXTtcclxuXHJcbiAgcHVibGljIHJlbmRlcmVkU2F2aW5nUm93czogTWFwPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+PltdO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgbG9hZGluZyA9IHRoaXMubG9hZGluZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgcHVibGljIHJlYWRvbmx5IGJ1ZmZlcmluZyA9IHRoaXMuYnVmZmVyaW5nU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICBwdWJsaWMgcmVhZG9ubHkgc2F2ZUVycm9yID0gdGhpcy5zYXZlRXJyb3JTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIHB1YmxpYyBnZXQgcmVuZGVyZWRSb3dzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZWRSb3dzU3ViamVjdC52YWx1ZTtcclxuICB9XHJcbiAgcHVibGljIHJlYWRvbmx5IHJlbmRlcmVkUm93c09ic2VydmFibGUgPSB0aGlzLnJlbmRlcmVkUm93c1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdW5pcXVlS2V5LCBwcml2YXRlIGZldGNoRGF0YTogRmV0Y2hGdW5jdGlvbjxUPiwgcHJpdmF0ZSBjaGFuZ2VEYXRhOiBDaGFuZ2VGdW5jdGlvbjxUPiwgcHJpdmF0ZSBkZWJvdW5jZSA9IDMwMCkge31cclxuXHJcbiAgY29ubmVjdChjb2xsZWN0aW9uVmlld2VyOiBDb2xsZWN0aW9uVmlld2VyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgIHJldHVybiB0aGlzLnJlbmRlcmVkUm93c1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0KGNvbGxlY3Rpb25WaWV3ZXI6IENvbGxlY3Rpb25WaWV3ZXIpOiB2b2lkIHtcclxuICAgIHRoaXMucmVuZGVyZWRSb3dzU3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgdGhpcy5sb2FkaW5nU3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgdGhpcy5idWZmZXJpbmdTdWJqZWN0LmNvbXBsZXRlKCk7XHJcbiAgICB0aGlzLnNhdmVFcnJvclN1YmplY3QuY29tcGxldGUoKTtcclxuXHJcbiAgICAvKmZvciAoY29uc3Qgc2F2aW5nUm93IG9mIHRoaXMuc2F2aW5nQ2VsbHMpIHtcclxuICAgICAgZm9yIChjb25zdCBzYXZpbmdTdWJqZWN0IG9mIEFycmF5LmZyb20oc2F2aW5nUm93LnZhbHVlcygpKSkge1xyXG4gICAgICAgIHNhdmluZ1N1YmplY3QuY29tcGxldGUoKTtcclxuICAgICAgfVxyXG4gICAgfSovXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0dXAoXHJcbiAgICBwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcixcclxuICAgIHNvcnQ6IE1hdFNvcnQsXHJcbiAgICBmaWx0ZXJFdmVudDogRXZlbnRFbWl0dGVyPHN0cmluZz4sXHJcbiAgICBlZGl0ZWRFdmVudDogRXZlbnRFbWl0dGVyPHtjb2x1bW46IHN0cmluZywgdmFsdWVzOiBULCByb3dJbmRleDogbnVtYmVyfT5cclxuICApOiB2b2lkIHtcclxuICAgIHRoaXMucGFnaW5hdG9yID0gcGFnaW5hdG9yO1xyXG4gICAgdGhpcy5zb3J0ID0gc29ydDtcclxuXHJcbiAgICBtZXJnZShcclxuICAgICAgZmlsdGVyRXZlbnQsXHJcbiAgICAgIHRoaXMuc29ydC5zb3J0Q2hhbmdlLFxyXG4gICAgICB0aGlzLnBhZ2luYXRvci5wYWdlXHJcbiAgICApLnBpcGUoXHJcbiAgICAgIHRhcCgodmFsdWUpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgeyAvLyBJZiB0aGUgdmFsdWUgaXMgb2YgdHlwZSBzdHJpbmcgaXQgbXVzdCBiZSB0aGUgZmlsdGVyXHJcbiAgICAgICAgICB0aGlzLmZpbHRlciA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5idWZmZXJpbmdTdWJqZWN0Lm5leHQodHJ1ZSk7XHJcbiAgICAgIH0pLFxyXG4gICAgICBkZWJvdW5jZVRpbWUodGhpcy5kZWJvdW5jZSksXHJcbiAgICAgIHRhcCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5idWZmZXJpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xyXG4gICAgICB9KSxcclxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKG9sZFZhbHVlOiBhbnksIG5ld1ZhbHVlOiBhbnkpID0+IHsgLy8gSWdub3JlIGFsbCBldmVudHMgdW50aWwgdGhlIHZhbHVlIHdhcyBhY3R1YWxseSBjaGFuZ2VkXHJcbiAgICAgICAgaWYgKG9sZFZhbHVlLnBhZ2VJbmRleCAhPT0gdW5kZWZpbmVkKSB7IC8vIEhhbmRsZSBwYWdpbmF0b3IgZXZlbnRzXHJcbiAgICAgICAgICByZXR1cm4gb2xkVmFsdWUucGFnZUluZGV4ID09PSBuZXdWYWx1ZS5wYWdlSW5kZXggJiYgb2xkVmFsdWUucGFnZVNpemUgPT09IG5ld1ZhbHVlLnBhZ2VTaXplO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKG9sZFZhbHVlLmRpcmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7IC8vIEhhbmRsZSBzb3J0IGV2ZW50c1xyXG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmFjdGl2ZSA9PT0gbmV3VmFsdWUuYWN0aXZlICYmIG9sZFZhbHVlLmRpcmVjdGlvbiA9PT0gbmV3VmFsdWUuZGlyZWN0aW9uO1xyXG5cclxuICAgICAgICB9IGVsc2UgeyAvLyBIYW5kbGUgZmlsdGVyIGV2ZW50c1xyXG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlID09PSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICApLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0lnbm9yZWRQcm9taXNlRnJvbUNhbGxcclxuICAgICAgdGhpcy51cGRhdGVDdXJyZW50VmlldygpO1xyXG4gICAgfSk7XHJcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHsgLy8gVGhpcyBza2lwcyBvbmUgdGljay4gVGhpcyBpcyBuZWVkZWQgZm9yIHRoZSBwYWdpbmF0b3IgYW5kIHNvcnRlciB0byB3b3JrIGNvcnJlY3RseVxyXG4gICAgICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXHJcbiAgICAgIHRoaXMudXBkYXRlQ3VycmVudFZpZXcoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVkaXRlZEV2ZW50LnBpcGUoXHJcbiAgICAgIGRlYm91bmNlVGltZSh0aGlzLmRlYm91bmNlKVxyXG4gICAgKS5zdWJzY3JpYmUoYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlbmRlcmVkU2F2aW5nUm93ID0gdGhpcy5yZW5kZXJlZFNhdmluZ1Jvd3NbZXZlbnQucm93SW5kZXhdO1xyXG4gICAgICByZW5kZXJlZFNhdmluZ1Jvdy5nZXQoZXZlbnQuY29sdW1uKS5uZXh0KHRydWUpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLmNoYW5nZURhdGEoZXZlbnQuY29sdW1uLCBldmVudC52YWx1ZXMpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHRoaXMuc2F2ZUVycm9yU3ViamVjdC5uZXh0KGVycm9yKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICByZW5kZXJlZFNhdmluZ1Jvdy5nZXQoZXZlbnQuY29sdW1uKS5uZXh0KGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZUN1cnJlbnRWaWV3KCkge1xyXG4gICAgdGhpcy5jdXJyZW50T2Zmc2V0ID0gdGhpcy5wYWdpbmF0b3IucGFnZUluZGV4ICogdGhpcy5wYWdpbmF0b3IucGFnZVNpemU7XHJcblxyXG4gICAgdGhpcy5sb2FkaW5nU3ViamVjdC5uZXh0KHRydWUpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5mZXRjaERhdGEoXHJcbiAgICAgIHRoaXMuZmlsdGVyLFxyXG4gICAgICB0aGlzLnNvcnQuYWN0aXZlLFxyXG4gICAgICB0aGlzLnNvcnQuZGlyZWN0aW9uLFxyXG4gICAgICB0aGlzLmN1cnJlbnRPZmZzZXQsXHJcbiAgICAgIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMucGFnaW5hdG9yLmxlbmd0aCA9IHJlc3VsdC5jb3VudDtcclxuXHJcbiAgICBjb25zdCB2aWV3S2V5ID0gYCR7dGhpcy5maWx0ZXJ9OyR7dGhpcy5zb3J0LmFjdGl2ZX07JHt0aGlzLnNvcnQuZGlyZWN0aW9ufWA7XHJcbiAgICBpZiAodGhpcy5yb3dzVmlld3MuaGFzKHZpZXdLZXkpID09PSBmYWxzZSkge1xyXG4gICAgICB0aGlzLnJvd3NWaWV3cy5zZXQodmlld0tleSwgW10pO1xyXG4gICAgICB0aGlzLnNhdmluZ1Jvd3NWaWV3cy5zZXQodmlld0tleSwgW10pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jdXJyZW50VmlldyA9IHRoaXMucm93c1ZpZXdzLmdldCh2aWV3S2V5KTtcclxuICAgIHRoaXMuY3VycmVudFNhdmluZ1Jvd3NWaWV3ID0gdGhpcy5zYXZpbmdSb3dzVmlld3MuZ2V0KHZpZXdLZXkpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSByZXN1bHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3Qgcm93ID0gcmVzdWx0Lml0ZW1zW2ldO1xyXG4gICAgICBjb25zdCB1bmlxdWVWYWx1ZSA9IHJvd1t0aGlzLnVuaXF1ZUtleV07XHJcblxyXG4gICAgICAvLyBUaGlzIGlzIGhlcmUsIHNvIHRoYXQgdGhlIHJvd3NWaWV3cyBkb24ndCBsb3NlIHRoZWlyIHJlZmVyZW5jZXMgdG8gdGhlIG9yaWdpbmFsIHJvd1xyXG4gICAgICBpZiAoIXRoaXMucm93cy5oYXModW5pcXVlVmFsdWUpKSB7XHJcbiAgICAgICAgdGhpcy5yb3dzLnNldCh1bmlxdWVWYWx1ZSwgcm93KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbHVtbiBpbiByb3cpIHtcclxuICAgICAgICAgIGlmICghcm93Lmhhc093blByb3BlcnR5KGNvbHVtbikpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5yb3dzLmdldCh1bmlxdWVWYWx1ZSlbY29sdW1uXSA9IHJvd1tjb2x1bW5dO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLnNhdmluZ1Jvd3MuaGFzKHVuaXF1ZVZhbHVlKSkge1xyXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBuZXcgTWFwPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+PigpO1xyXG4gICAgICAgIGZvciAoY29uc3QgY29sdW1uIGluIHJvdykge1xyXG4gICAgICAgICAgaWYgKCFyb3cuaGFzT3duUHJvcGVydHkoY29sdW1uKSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb2x1bW5zLnNldChjb2x1bW4sIG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zYXZpbmdSb3dzLnNldCh1bmlxdWVWYWx1ZSwgY29sdW1ucyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3VycmVudFZpZXdbdGhpcy5jdXJyZW50T2Zmc2V0ICsgaV0gPSB0aGlzLnJvd3MuZ2V0KHVuaXF1ZVZhbHVlKTtcclxuICAgICAgdGhpcy5jdXJyZW50U2F2aW5nUm93c1ZpZXdbdGhpcy5jdXJyZW50T2Zmc2V0ICsgaV0gPSB0aGlzLnNhdmluZ1Jvd3MuZ2V0KHVuaXF1ZVZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVJlbmRlcmVkUm93cygpO1xyXG5cclxuICAgIHRoaXMubG9hZGluZ1N1YmplY3QubmV4dChmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVJlbmRlcmVkUm93cygpIHtcclxuICAgIHRoaXMucmVuZGVyZWRTYXZpbmdSb3dzID0gdGhpcy5jdXJyZW50U2F2aW5nUm93c1ZpZXcuc2xpY2UoXHJcbiAgICAgIHRoaXMuY3VycmVudE9mZnNldCxcclxuICAgICAgdGhpcy5jdXJyZW50T2Zmc2V0ICsgdGhpcy5wYWdpbmF0b3IucGFnZVNpemVcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJlZFJvd3NTdWJqZWN0Lm5leHQoXHJcbiAgICAgIHRoaXMuY3VycmVudFZpZXcuc2xpY2UoXHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2Zmc2V0LFxyXG4gICAgICAgIHRoaXMuY3VycmVudE9mZnNldCArIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=