import { __values, __spread, __awaiter, __generator } from 'tslib';
import { BehaviorSubject, merge } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { Component, EventEmitter, Input, ViewChild, NgModule } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatIconModule, MatMenuModule, MatPaginatorModule, MatSortModule, MatProgressBarModule, MatSnackBarModule, MatButtonModule } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 */
var  /**
 * @template T
 */
AsyncDataSource = /** @class */ (function () {
    function AsyncDataSource(uniqueKey, fetchData, changeData, debounce) {
        if (debounce === void 0) { debounce = 300; }
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
    Object.defineProperty(AsyncDataSource.prototype, "renderedRows", {
        get: /**
         * @return {?}
         */
        function () {
            return this.renderedRowsSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} collectionViewer
     * @return {?}
     */
    AsyncDataSource.prototype.connect = /**
     * @param {?} collectionViewer
     * @return {?}
     */
    function (collectionViewer) {
        return this.renderedRowsSubject.asObservable();
    };
    /**
     * @param {?} collectionViewer
     * @return {?}
     */
    AsyncDataSource.prototype.disconnect = /**
     * @param {?} collectionViewer
     * @return {?}
     */
    function (collectionViewer) {
        this.renderedRowsSubject.complete();
        this.loadingSubject.complete();
        this.bufferingSubject.complete();
        this.saveErrorSubject.complete();
        /*for (const savingRow of this.savingCells) {
              for (const savingSubject of Array.from(savingRow.values())) {
                savingSubject.complete();
              }
            }*/
    };
    /**
     * @param {?} paginator
     * @param {?} sort
     * @param {?} filterEvent
     * @param {?} editedEvent
     * @return {?}
     */
    AsyncDataSource.prototype.setup = /**
     * @param {?} paginator
     * @param {?} sort
     * @param {?} filterEvent
     * @param {?} editedEvent
     * @return {?}
     */
    function (paginator, sort, filterEvent, editedEvent) {
        var _this = this;
        this.paginator = paginator;
        this.sort = sort;
        merge(filterEvent, this.sort.sortChange, this.paginator.page).pipe(tap(function (value) {
            if (typeof value === 'string') {
                // If the value is of type string it must be the filter
                _this.filter = value;
            }
            _this.bufferingSubject.next(true);
        }), debounceTime(this.debounce), tap(function () {
            _this.bufferingSubject.next(false);
        }), distinctUntilChanged(function (oldValue, newValue) {
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
        })).subscribe(function () {
            // noinspection JSIgnoredPromiseFromCall
            // noinspection JSIgnoredPromiseFromCall
            _this.updateCurrentView();
        });
        Promise.resolve().then(function () {
            // This skips one tick. This is needed for the paginator and sorter to work correctly
            // noinspection JSIgnoredPromiseFromCall
            // noinspection JSIgnoredPromiseFromCall
            _this.updateCurrentView();
        });
        editedEvent.pipe(debounceTime(this.debounce)).subscribe(function (event) { return __awaiter(_this, void 0, void 0, function () {
            var renderedSavingRow, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderedSavingRow = this.renderedSavingRows[event.rowIndex];
                        renderedSavingRow.get(event.column).next(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.changeData(event.column, event.values)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        this.saveErrorSubject.next(error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        renderedSavingRow.get(event.column).next(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @return {?}
     */
    AsyncDataSource.prototype.updateCurrentView = /**
     * @return {?}
     */
    function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, viewKey, i, length_1, row, uniqueValue, column, columns, column;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.currentOffset = this.paginator.pageIndex * this.paginator.pageSize;
                        this.loadingSubject.next(true);
                        return [4 /*yield*/, this.fetchData(this.filter, this.sort.active, this.sort.direction, this.currentOffset, this.paginator.pageSize)];
                    case 1:
                        result = _a.sent();
                        this.paginator.length = result.count;
                        viewKey = this.filter + ";" + this.sort.active + ";" + this.sort.direction;
                        if (this.rowsViews.has(viewKey) === false) {
                            this.rowsViews.set(viewKey, []);
                            this.savingRowsViews.set(viewKey, []);
                        }
                        this.currentView = this.rowsViews.get(viewKey);
                        this.currentSavingRowsView = this.savingRowsViews.get(viewKey);
                        for (i = 0, length_1 = result.items.length; i < length_1; i++) {
                            row = result.items[i];
                            uniqueValue = row[this.uniqueKey];
                            // This is here, so that the rowsViews don't lose their references to the original row
                            if (!this.rows.has(uniqueValue)) {
                                this.rows.set(uniqueValue, row);
                            }
                            else {
                                for (column in row) {
                                    if (!row.hasOwnProperty(column)) {
                                        continue;
                                    }
                                    this.rows.get(uniqueValue)[column] = row[column];
                                }
                            }
                            if (!this.savingRows.has(uniqueValue)) {
                                columns = new Map();
                                for (column in row) {
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
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return {?}
     */
    AsyncDataSource.prototype.updateRenderedRows = /**
     * @return {?}
     */
    function () {
        this.renderedSavingRows = this.currentSavingRowsView.slice(this.currentOffset, this.currentOffset + this.paginator.pageSize);
        this.renderedRowsSubject.next(this.currentView.slice(this.currentOffset, this.currentOffset + this.paginator.pageSize));
    };
    return AsyncDataSource;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 */
var DataTableComponent = /** @class */ (function () {
    function DataTableComponent(snackBar) {
        this.snackBar = snackBar;
        this.pageSizeOptions = [5, 10, 15];
        this.pageSize = 5;
        this.displayedColumns = ['select'];
        this.selection = new SelectionModel(true, []);
        this.filterChanged = new EventEmitter();
        this.cellChanged = new EventEmitter();
    }
    /**
     * @return {?}
     */
    DataTableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        try {
            for (var _a = __values(this.columns), _b = _a.next(); !_b.done; _b = _a.next()) {
                var column = _b.value;
                this.displayedColumns.push(column.name);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.dataSource.setup(this.paginator, this.sort, this.filterChanged, this.cellChanged);
        // If the user changes the sort or the filter, reset back to the first page.
        merge(this.sort.sortChange, this.filterChanged).subscribe(function () { return _this.paginator.pageIndex = 0; });
        this.dataSource.saveError.pipe(skip(1)).subscribe(function (error) {
            _this.snackBar.open(error, null, {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom'
            });
        });
        // Deselects rows if they are not in the current filter or page
        this.renderedRowsSubscription = this.dataSource.renderedRowsObservable.subscribe(function (renderedRows) {
            try {
                for (var _a = __values(_this.selection.selected), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var selected = _b.value;
                    if (renderedRows.indexOf(selected) === -1) {
                        _this.selection.deselect(selected);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var e_2, _c;
        });
        var e_1, _c;
    };
    /**
     * @return {?}
     */
    DataTableComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.renderedRowsSubscription.unsubscribe();
    };
    /**
     * @param {?} column
     * @param {?} row
     * @param {?} newValue
     * @param {?} rowIndex
     * @return {?}
     */
    DataTableComponent.prototype.cellChange = /**
     * @param {?} column
     * @param {?} row
     * @param {?} newValue
     * @param {?} rowIndex
     * @return {?}
     */
    function (column, row, newValue, rowIndex) {
        row[column] = newValue;
        this.cellChanged.emit({ column: column, values: row, rowIndex: rowIndex });
    };
    /**
     * @param {?} newValue
     * @return {?}
     */
    DataTableComponent.prototype.filterChange = /**
     * @param {?} newValue
     * @return {?}
     */
    function (newValue) {
        this.filter = newValue.trim().toLowerCase(); // Remove whitespace; MatTableDataSource defaults to lowercase matches
        this.filterChanged.emit(this.filter);
    };
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     * @return {?}
     */
    DataTableComponent.prototype.masterToggle = /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     * @return {?}
     */
    function () {
        if (this.isAllSelected()) {
            this.selection.clear();
        }
        else {
            (_a = this.selection).select.apply(_a, __spread(this.dataSource.renderedRows));
        }
        var _a;
    };
    /** Whether the number of selected elements matches the total number of rows displayed. */
    /**
     * Whether the number of selected elements matches the total number of rows displayed.
     * @return {?}
     */
    DataTableComponent.prototype.isAllSelected = /**
     * Whether the number of selected elements matches the total number of rows displayed.
     * @return {?}
     */
    function () {
        var /** @type {?} */ numSelected = this.selection.selected.length;
        var /** @type {?} */ numRows = this.dataSource.renderedRows.length;
        return numSelected === numRows;
    };
    DataTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-mat-data-table',
                    template: "<div class=\"mat-typography mat-elevation-z2\">\n  <div class=\"header\">\n    <h2>{{title}}</h2>\n    <div class=\"actions\">\n\n      <button *ngFor=\"let button of buttons\"\n              mat-icon-button\n              (click)=\"button.action(selection.selected)\"\n              [disabled]=\"button.selectionRequired && selection.selected.length === 0 || button.selectionRequired && !button.multiSelection && selection.selected.length > 1\">\n        <mat-icon>{{button.icon}}</mat-icon>\n      </button>\n      <mat-form-field class=\"search-field\">\n        <input [ngModel]=\"filter\" (ngModelChange)=\"filterChange($event)\" matInput placeholder=\"Filter\">\n      </mat-form-field>\n    </div>\n  </div>\n\n  <mat-progress-bar [class.show]=\"(dataSource.loading | async) || (dataSource.buffering | async)\" [mode]=\"(dataSource.buffering | async) ? 'buffer' : 'indeterminate'\"></mat-progress-bar>\n  <mat-table #table [dataSource]=\"dataSource\"\n             matSort [matSortActive]=\"sortColumn\" matSortDisableClear matSortDirection=\"asc\">\n\n    <!-- Checkbox Column -->\n    <ng-container matColumnDef=\"select\">\n      <mat-header-cell *matHeaderCellDef>\n        <mat-checkbox color=\"primary\" (change)=\"$event ? masterToggle() : null\"\n                      [checked]=\"selection.hasValue() && isAllSelected()\"\n                      [indeterminate]=\"selection.hasValue() && !isAllSelected()\">\n        </mat-checkbox>\n      </mat-header-cell>\n      <mat-cell *matCellDef=\"let row\">\n        <mat-checkbox color=\"primary\" (click)=\"$event.stopPropagation()\"\n                      (change)=\"$event ? selection.toggle(row) : null\"\n                      [checked]=\"selection.isSelected(row)\">\n        </mat-checkbox>\n      </mat-cell>\n    </ng-container>\n\n    <ng-container *ngFor=\"let column of columns\" [matColumnDef]=\"column.name\">\n      <mat-header-cell mat-sort-header *matHeaderCellDef [style.max-width]=\"(column.width + 24) + 'px'\">{{column.label}}</mat-header-cell>\n      <mat-cell *matCellDef=\"let row; let rowIndex = index\" [style.max-width]=\"(column.width + 24) + 'px'\">\n        <ng-container *ngIf=\"!column.editable; else editable\">\n\n          <ng-container *ngIf=\"row[column.name].constructor.name !== 'Date'; else date\">\n            {{row[column.name]}}\n          </ng-container>\n\n          <ng-template #date>\n            {{row[column.name] | date:'short'}}\n          </ng-template>\n\n        </ng-container>\n        <ng-template #editable>\n\n          <mat-progress-bar [class.show]=\"dataSource.renderedSavingRows[rowIndex].get(column.name) | async\" mode=\"indeterminate\"></mat-progress-bar>\n\n          <ng-container *ngIf=\"column.values; else elseIf\">\n            <mat-form-field [style.max-width]=\"column.width + 'px'\">\n              <mat-select [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                <mat-option *ngFor=\"let value of column.values\" [value]=\"value\">\n                  {{ value }}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n          </ng-container>\n\n          <ng-template #elseIf>\n            <ng-container *ngIf=\"row[column.name].constructor.name !== 'Date'; else datepicker\">\n              <div class=\"edit-button\" [matMenuTriggerFor]=\"menu\">\n                {{row[column.name]}}\n                <mat-icon>edit_mode</mat-icon>\n              </div>\n              <mat-menu #menu=\"matMenu\">\n                <div mat-menu-item disabled class=\"full-height-menu-item\">\n                  <mat-form-field class=\"mat-cell\" [style.max-width]=\"column.width + 'px'\"> <!-- mat-cell is a hack to override the disabled state of mat-menu-item -->\n                    <input matInput #message [attr.maxlength]=\"column.maxLength\" [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                    <mat-hint align=\"end\">{{message.value.length}} / {{column.maxLength}}</mat-hint>\n                  </mat-form-field>\n                </div>\n              </mat-menu>\n            </ng-container>\n\n            <ng-template #datepicker>\n              <mat-form-field [style.max-width]=\"column.width + 'px'\">\n                <input matInput [matDatepicker]=\"picker\" [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n                <mat-datepicker #picker></mat-datepicker>\n              </mat-form-field>\n            </ng-template>\n          </ng-template>\n\n        </ng-template>\n      </mat-cell>\n    </ng-container>\n\n    <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n    <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n  </mat-table>\n  <mat-paginator [pageSize]=\"pageSize\"\n                 [pageSizeOptions]=\"pageSizeOptions\"\n                 [showFirstLastButtons]=\"true\">\n  </mat-paginator>\n</div>\n",
                    styles: [":host{display:block}:host ::ng-deep .mat-cell .mat-form-field-underline{visibility:hidden}:host .header{padding-top:24px;padding-left:24px;padding-right:24px}:host .header h2{display:inline}:host .header .actions{display:inline-block;float:right}:host .header .actions .search-field,:host .header .actions button{margin-left:10px}:host .mat-progress-bar{opacity:0}:host .mat-progress-bar.show{opacity:1}:host .mat-column-select{max-width:44px;overflow:visible}:host .mat-cell{flex-direction:column;align-items:flex-start;justify-content:center}:host .mat-cell .edit-button{cursor:pointer;line-height:24px;width:100%;box-sizing:border-box;padding-right:24px;padding-top:1.16em;padding-bottom:1.18em}:host .mat-cell .edit-button .mat-icon{float:right;margin-left:5px}.full-height-menu-item{height:auto;line-height:initial}"]
                },] },
    ];
    /** @nocollapse */
    DataTableComponent.ctorParameters = function () { return [
        { type: MatSnackBar, },
    ]; };
    DataTableComponent.propDecorators = {
        "title": [{ type: Input },],
        "columns": [{ type: Input },],
        "sortColumn": [{ type: Input },],
        "pageSizeOptions": [{ type: Input },],
        "pageSize": [{ type: Input },],
        "buttons": [{ type: Input },],
        "dataSource": [{ type: Input },],
        "paginator": [{ type: ViewChild, args: [MatPaginator,] },],
        "sort": [{ type: ViewChild, args: [MatSort,] },],
    };
    return DataTableComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DataTableModule = /** @class */ (function () {
    function DataTableModule() {
    }
    /**
     * @return {?}
     */
    DataTableModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: DataTableModule,
            providers: []
        };
    };
    DataTableModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        MatTableModule,
                        MatFormFieldModule,
                        MatInputModule,
                        MatCheckboxModule,
                        MatNativeDateModule,
                        MatDatepickerModule,
                        MatSelectModule,
                        MatIconModule,
                        MatMenuModule,
                        MatPaginatorModule,
                        MatSortModule,
                        MatProgressBarModule,
                        MatSnackBarModule,
                        MatButtonModule,
                        FormsModule
                    ],
                    declarations: [
                        DataTableComponent
                    ],
                    exports: [
                        DataTableComponent
                    ],
                    providers: []
                },] },
    ];
    return DataTableModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { DataTableModule, AsyncDataSource, DataTableComponent as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW1hdC1kYXRhLXRhYmxlLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZ3gtbWF0LWRhdGEtdGFibGUvYXN5bmMtZGF0YS1zb3VyY2UudHMiLCJuZzovL25neC1tYXQtZGF0YS10YWJsZS9jb21wb25lbnRzL2RhdGEtdGFibGUvZGF0YS10YWJsZS5jb21wb25lbnQudHMiLCJuZzovL25neC1tYXQtZGF0YS10YWJsZS9kYXRhLXRhYmxlLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbGxlY3Rpb25WaWV3ZXIsIERhdGFTb3VyY2V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0LCBtZXJnZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7TWF0UGFnaW5hdG9yLCBNYXRTb3J0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XHJcbmltcG9ydCB7dGFwLCBkZWJvdW5jZVRpbWUsIGRpc3RpbmN0VW50aWxDaGFuZ2VkfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmV4cG9ydCB0eXBlIEZldGNoRnVuY3Rpb248VD4gPSAoXHJcbiAgZmlsdGVyOiBzdHJpbmcsXHJcbiAgc29ydENvbHVtbjogc3RyaW5nLFxyXG4gIHNvcnREaXJlY3Rpb246IHN0cmluZyxcclxuICBvZmZzZXQ6IG51bWJlcixcclxuICBmZXRjaFNpemU6IG51bWJlclxyXG4pID0+IFByb21pc2U8e1xyXG4gIGNvdW50OiBudW1iZXIsXHJcbiAgaXRlbXM6IFRbXVxyXG59PjtcclxuXHJcbmV4cG9ydCB0eXBlIENoYW5nZUZ1bmN0aW9uPFQ+ID0gKFxyXG4gIGNvbHVtbjogc3RyaW5nLFxyXG4gIHZhbHVlczogVFxyXG4pID0+IFByb21pc2U8dm9pZD47XHJcblxyXG5leHBvcnQgY2xhc3MgQXN5bmNEYXRhU291cmNlPFQ+IGltcGxlbWVudHMgRGF0YVNvdXJjZTxUPiB7XHJcblxyXG4gIHByaXZhdGUgcGFnaW5hdG9yOiBNYXRQYWdpbmF0b3I7XHJcbiAgcHJpdmF0ZSBzb3J0OiBNYXRTb3J0O1xyXG4gIHByaXZhdGUgZmlsdGVyID0gJyc7XHJcblxyXG4gIHByaXZhdGUgcmVuZGVyZWRSb3dzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VFtdPihbXSk7XHJcbiAgcHJpdmF0ZSBsb2FkaW5nU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG4gIHByaXZhdGUgYnVmZmVyaW5nU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG4gIHByaXZhdGUgc2F2ZUVycm9yU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoJycpO1xyXG5cclxuICBwcml2YXRlIHJvd3MgPSBuZXcgTWFwPHN0cmluZywgVD4oKTtcclxuICBwcml2YXRlIHJvd3NWaWV3cyA9IG5ldyBNYXA8c3RyaW5nLCBUW10+KCk7XHJcbiAgcHJpdmF0ZSBjdXJyZW50VmlldzogVFtdO1xyXG4gIHByaXZhdGUgY3VycmVudE9mZnNldDogbnVtYmVyO1xyXG5cclxuICBwcml2YXRlIHNhdmluZ1Jvd3MgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+Pj4oKTtcclxuICBwcml2YXRlIHNhdmluZ1Jvd3NWaWV3cyA9IG5ldyBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4+W10+KCk7XHJcbiAgcHJpdmF0ZSBjdXJyZW50U2F2aW5nUm93c1ZpZXc6IE1hcDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDxib29sZWFuPj5bXTtcclxuXHJcbiAgcHVibGljIHJlbmRlcmVkU2F2aW5nUm93czogTWFwPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+PltdO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgbG9hZGluZyA9IHRoaXMubG9hZGluZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgcHVibGljIHJlYWRvbmx5IGJ1ZmZlcmluZyA9IHRoaXMuYnVmZmVyaW5nU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICBwdWJsaWMgcmVhZG9ubHkgc2F2ZUVycm9yID0gdGhpcy5zYXZlRXJyb3JTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIHB1YmxpYyBnZXQgcmVuZGVyZWRSb3dzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZWRSb3dzU3ViamVjdC52YWx1ZTtcclxuICB9XHJcbiAgcHVibGljIHJlYWRvbmx5IHJlbmRlcmVkUm93c09ic2VydmFibGUgPSB0aGlzLnJlbmRlcmVkUm93c1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdW5pcXVlS2V5LCBwcml2YXRlIGZldGNoRGF0YTogRmV0Y2hGdW5jdGlvbjxUPiwgcHJpdmF0ZSBjaGFuZ2VEYXRhOiBDaGFuZ2VGdW5jdGlvbjxUPiwgcHJpdmF0ZSBkZWJvdW5jZSA9IDMwMCkge31cclxuXHJcbiAgY29ubmVjdChjb2xsZWN0aW9uVmlld2VyOiBDb2xsZWN0aW9uVmlld2VyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgIHJldHVybiB0aGlzLnJlbmRlcmVkUm93c1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0KGNvbGxlY3Rpb25WaWV3ZXI6IENvbGxlY3Rpb25WaWV3ZXIpOiB2b2lkIHtcclxuICAgIHRoaXMucmVuZGVyZWRSb3dzU3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgdGhpcy5sb2FkaW5nU3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgdGhpcy5idWZmZXJpbmdTdWJqZWN0LmNvbXBsZXRlKCk7XHJcbiAgICB0aGlzLnNhdmVFcnJvclN1YmplY3QuY29tcGxldGUoKTtcclxuXHJcbiAgICAvKmZvciAoY29uc3Qgc2F2aW5nUm93IG9mIHRoaXMuc2F2aW5nQ2VsbHMpIHtcclxuICAgICAgZm9yIChjb25zdCBzYXZpbmdTdWJqZWN0IG9mIEFycmF5LmZyb20oc2F2aW5nUm93LnZhbHVlcygpKSkge1xyXG4gICAgICAgIHNhdmluZ1N1YmplY3QuY29tcGxldGUoKTtcclxuICAgICAgfVxyXG4gICAgfSovXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0dXAoXHJcbiAgICBwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcixcclxuICAgIHNvcnQ6IE1hdFNvcnQsXHJcbiAgICBmaWx0ZXJFdmVudDogRXZlbnRFbWl0dGVyPHN0cmluZz4sXHJcbiAgICBlZGl0ZWRFdmVudDogRXZlbnRFbWl0dGVyPHtjb2x1bW46IHN0cmluZywgdmFsdWVzOiBULCByb3dJbmRleDogbnVtYmVyfT5cclxuICApOiB2b2lkIHtcclxuICAgIHRoaXMucGFnaW5hdG9yID0gcGFnaW5hdG9yO1xyXG4gICAgdGhpcy5zb3J0ID0gc29ydDtcclxuXHJcbiAgICBtZXJnZShcclxuICAgICAgZmlsdGVyRXZlbnQsXHJcbiAgICAgIHRoaXMuc29ydC5zb3J0Q2hhbmdlLFxyXG4gICAgICB0aGlzLnBhZ2luYXRvci5wYWdlXHJcbiAgICApLnBpcGUoXHJcbiAgICAgIHRhcCgodmFsdWUpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgeyAvLyBJZiB0aGUgdmFsdWUgaXMgb2YgdHlwZSBzdHJpbmcgaXQgbXVzdCBiZSB0aGUgZmlsdGVyXHJcbiAgICAgICAgICB0aGlzLmZpbHRlciA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5idWZmZXJpbmdTdWJqZWN0Lm5leHQodHJ1ZSk7XHJcbiAgICAgIH0pLFxyXG4gICAgICBkZWJvdW5jZVRpbWUodGhpcy5kZWJvdW5jZSksXHJcbiAgICAgIHRhcCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5idWZmZXJpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xyXG4gICAgICB9KSxcclxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKG9sZFZhbHVlOiBhbnksIG5ld1ZhbHVlOiBhbnkpID0+IHsgLy8gSWdub3JlIGFsbCBldmVudHMgdW50aWwgdGhlIHZhbHVlIHdhcyBhY3R1YWxseSBjaGFuZ2VkXHJcbiAgICAgICAgaWYgKG9sZFZhbHVlLnBhZ2VJbmRleCAhPT0gdW5kZWZpbmVkKSB7IC8vIEhhbmRsZSBwYWdpbmF0b3IgZXZlbnRzXHJcbiAgICAgICAgICByZXR1cm4gb2xkVmFsdWUucGFnZUluZGV4ID09PSBuZXdWYWx1ZS5wYWdlSW5kZXggJiYgb2xkVmFsdWUucGFnZVNpemUgPT09IG5ld1ZhbHVlLnBhZ2VTaXplO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKG9sZFZhbHVlLmRpcmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7IC8vIEhhbmRsZSBzb3J0IGV2ZW50c1xyXG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmFjdGl2ZSA9PT0gbmV3VmFsdWUuYWN0aXZlICYmIG9sZFZhbHVlLmRpcmVjdGlvbiA9PT0gbmV3VmFsdWUuZGlyZWN0aW9uO1xyXG5cclxuICAgICAgICB9IGVsc2UgeyAvLyBIYW5kbGUgZmlsdGVyIGV2ZW50c1xyXG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlID09PSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICApLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0lnbm9yZWRQcm9taXNlRnJvbUNhbGxcclxuICAgICAgdGhpcy51cGRhdGVDdXJyZW50VmlldygpO1xyXG4gICAgfSk7XHJcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHsgLy8gVGhpcyBza2lwcyBvbmUgdGljay4gVGhpcyBpcyBuZWVkZWQgZm9yIHRoZSBwYWdpbmF0b3IgYW5kIHNvcnRlciB0byB3b3JrIGNvcnJlY3RseVxyXG4gICAgICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXHJcbiAgICAgIHRoaXMudXBkYXRlQ3VycmVudFZpZXcoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVkaXRlZEV2ZW50LnBpcGUoXHJcbiAgICAgIGRlYm91bmNlVGltZSh0aGlzLmRlYm91bmNlKVxyXG4gICAgKS5zdWJzY3JpYmUoYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlbmRlcmVkU2F2aW5nUm93ID0gdGhpcy5yZW5kZXJlZFNhdmluZ1Jvd3NbZXZlbnQucm93SW5kZXhdO1xyXG4gICAgICByZW5kZXJlZFNhdmluZ1Jvdy5nZXQoZXZlbnQuY29sdW1uKS5uZXh0KHRydWUpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLmNoYW5nZURhdGEoZXZlbnQuY29sdW1uLCBldmVudC52YWx1ZXMpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHRoaXMuc2F2ZUVycm9yU3ViamVjdC5uZXh0KGVycm9yKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICByZW5kZXJlZFNhdmluZ1Jvdy5nZXQoZXZlbnQuY29sdW1uKS5uZXh0KGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZUN1cnJlbnRWaWV3KCkge1xyXG4gICAgdGhpcy5jdXJyZW50T2Zmc2V0ID0gdGhpcy5wYWdpbmF0b3IucGFnZUluZGV4ICogdGhpcy5wYWdpbmF0b3IucGFnZVNpemU7XHJcblxyXG4gICAgdGhpcy5sb2FkaW5nU3ViamVjdC5uZXh0KHRydWUpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5mZXRjaERhdGEoXHJcbiAgICAgIHRoaXMuZmlsdGVyLFxyXG4gICAgICB0aGlzLnNvcnQuYWN0aXZlLFxyXG4gICAgICB0aGlzLnNvcnQuZGlyZWN0aW9uLFxyXG4gICAgICB0aGlzLmN1cnJlbnRPZmZzZXQsXHJcbiAgICAgIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMucGFnaW5hdG9yLmxlbmd0aCA9IHJlc3VsdC5jb3VudDtcclxuXHJcbiAgICBjb25zdCB2aWV3S2V5ID0gYCR7dGhpcy5maWx0ZXJ9OyR7dGhpcy5zb3J0LmFjdGl2ZX07JHt0aGlzLnNvcnQuZGlyZWN0aW9ufWA7XHJcbiAgICBpZiAodGhpcy5yb3dzVmlld3MuaGFzKHZpZXdLZXkpID09PSBmYWxzZSkge1xyXG4gICAgICB0aGlzLnJvd3NWaWV3cy5zZXQodmlld0tleSwgW10pO1xyXG4gICAgICB0aGlzLnNhdmluZ1Jvd3NWaWV3cy5zZXQodmlld0tleSwgW10pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jdXJyZW50VmlldyA9IHRoaXMucm93c1ZpZXdzLmdldCh2aWV3S2V5KTtcclxuICAgIHRoaXMuY3VycmVudFNhdmluZ1Jvd3NWaWV3ID0gdGhpcy5zYXZpbmdSb3dzVmlld3MuZ2V0KHZpZXdLZXkpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSByZXN1bHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3Qgcm93ID0gcmVzdWx0Lml0ZW1zW2ldO1xyXG4gICAgICBjb25zdCB1bmlxdWVWYWx1ZSA9IHJvd1t0aGlzLnVuaXF1ZUtleV07XHJcblxyXG4gICAgICAvLyBUaGlzIGlzIGhlcmUsIHNvIHRoYXQgdGhlIHJvd3NWaWV3cyBkb24ndCBsb3NlIHRoZWlyIHJlZmVyZW5jZXMgdG8gdGhlIG9yaWdpbmFsIHJvd1xyXG4gICAgICBpZiAoIXRoaXMucm93cy5oYXModW5pcXVlVmFsdWUpKSB7XHJcbiAgICAgICAgdGhpcy5yb3dzLnNldCh1bmlxdWVWYWx1ZSwgcm93KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbHVtbiBpbiByb3cpIHtcclxuICAgICAgICAgIGlmICghcm93Lmhhc093blByb3BlcnR5KGNvbHVtbikpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5yb3dzLmdldCh1bmlxdWVWYWx1ZSlbY29sdW1uXSA9IHJvd1tjb2x1bW5dO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLnNhdmluZ1Jvd3MuaGFzKHVuaXF1ZVZhbHVlKSkge1xyXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBuZXcgTWFwPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+PigpO1xyXG4gICAgICAgIGZvciAoY29uc3QgY29sdW1uIGluIHJvdykge1xyXG4gICAgICAgICAgaWYgKCFyb3cuaGFzT3duUHJvcGVydHkoY29sdW1uKSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb2x1bW5zLnNldChjb2x1bW4sIG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zYXZpbmdSb3dzLnNldCh1bmlxdWVWYWx1ZSwgY29sdW1ucyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3VycmVudFZpZXdbdGhpcy5jdXJyZW50T2Zmc2V0ICsgaV0gPSB0aGlzLnJvd3MuZ2V0KHVuaXF1ZVZhbHVlKTtcclxuICAgICAgdGhpcy5jdXJyZW50U2F2aW5nUm93c1ZpZXdbdGhpcy5jdXJyZW50T2Zmc2V0ICsgaV0gPSB0aGlzLnNhdmluZ1Jvd3MuZ2V0KHVuaXF1ZVZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVJlbmRlcmVkUm93cygpO1xyXG5cclxuICAgIHRoaXMubG9hZGluZ1N1YmplY3QubmV4dChmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVJlbmRlcmVkUm93cygpIHtcclxuICAgIHRoaXMucmVuZGVyZWRTYXZpbmdSb3dzID0gdGhpcy5jdXJyZW50U2F2aW5nUm93c1ZpZXcuc2xpY2UoXHJcbiAgICAgIHRoaXMuY3VycmVudE9mZnNldCxcclxuICAgICAgdGhpcy5jdXJyZW50T2Zmc2V0ICsgdGhpcy5wYWdpbmF0b3IucGFnZVNpemVcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJlZFJvd3NTdWJqZWN0Lm5leHQoXHJcbiAgICAgIHRoaXMuY3VycmVudFZpZXcuc2xpY2UoXHJcbiAgICAgICAgdGhpcy5jdXJyZW50T2Zmc2V0LFxyXG4gICAgICAgIHRoaXMuY3VycmVudE9mZnNldCArIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TWF0UGFnaW5hdG9yLCBNYXRTbmFja0JhciwgTWF0U29ydH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xyXG5pbXBvcnQge1NlbGVjdGlvbk1vZGVsfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xyXG5pbXBvcnQge21lcmdlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtza2lwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5pbXBvcnQge0FzeW5jRGF0YVNvdXJjZX0gZnJvbSAnLi4vLi4vYXN5bmMtZGF0YS1zb3VyY2UnO1xyXG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcy9pbnRlcm5hbC9TdWJzY3JpcHRpb24nO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtbWF0LWRhdGEtdGFibGUnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cIm1hdC10eXBvZ3JhcGh5IG1hdC1lbGV2YXRpb24tejJcIj5cclxuICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICA8aDI+e3t0aXRsZX19PC9oMj5cclxuICAgIDxkaXYgY2xhc3M9XCJhY3Rpb25zXCI+XHJcblxyXG4gICAgICA8YnV0dG9uICpuZ0Zvcj1cImxldCBidXR0b24gb2YgYnV0dG9uc1wiXHJcbiAgICAgICAgICAgICAgbWF0LWljb24tYnV0dG9uXHJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cImJ1dHRvbi5hY3Rpb24oc2VsZWN0aW9uLnNlbGVjdGVkKVwiXHJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImJ1dHRvbi5zZWxlY3Rpb25SZXF1aXJlZCAmJiBzZWxlY3Rpb24uc2VsZWN0ZWQubGVuZ3RoID09PSAwIHx8IGJ1dHRvbi5zZWxlY3Rpb25SZXF1aXJlZCAmJiAhYnV0dG9uLm11bHRpU2VsZWN0aW9uICYmIHNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGggPiAxXCI+XHJcbiAgICAgICAgPG1hdC1pY29uPnt7YnV0dG9uLmljb259fTwvbWF0LWljb24+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8bWF0LWZvcm0tZmllbGQgY2xhc3M9XCJzZWFyY2gtZmllbGRcIj5cclxuICAgICAgICA8aW5wdXQgW25nTW9kZWxdPVwiZmlsdGVyXCIgKG5nTW9kZWxDaGFuZ2UpPVwiZmlsdGVyQ2hhbmdlKCRldmVudClcIiBtYXRJbnB1dCBwbGFjZWhvbGRlcj1cIkZpbHRlclwiPlxyXG4gICAgICA8L21hdC1mb3JtLWZpZWxkPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxtYXQtcHJvZ3Jlc3MtYmFyIFtjbGFzcy5zaG93XT1cIihkYXRhU291cmNlLmxvYWRpbmcgfCBhc3luYykgfHwgKGRhdGFTb3VyY2UuYnVmZmVyaW5nIHwgYXN5bmMpXCIgW21vZGVdPVwiKGRhdGFTb3VyY2UuYnVmZmVyaW5nIHwgYXN5bmMpID8gJ2J1ZmZlcicgOiAnaW5kZXRlcm1pbmF0ZSdcIj48L21hdC1wcm9ncmVzcy1iYXI+XHJcbiAgPG1hdC10YWJsZSAjdGFibGUgW2RhdGFTb3VyY2VdPVwiZGF0YVNvdXJjZVwiXHJcbiAgICAgICAgICAgICBtYXRTb3J0IFttYXRTb3J0QWN0aXZlXT1cInNvcnRDb2x1bW5cIiBtYXRTb3J0RGlzYWJsZUNsZWFyIG1hdFNvcnREaXJlY3Rpb249XCJhc2NcIj5cclxuXHJcbiAgICA8IS0tIENoZWNrYm94IENvbHVtbiAtLT5cclxuICAgIDxuZy1jb250YWluZXIgbWF0Q29sdW1uRGVmPVwic2VsZWN0XCI+XHJcbiAgICAgIDxtYXQtaGVhZGVyLWNlbGwgKm1hdEhlYWRlckNlbGxEZWY+XHJcbiAgICAgICAgPG1hdC1jaGVja2JveCBjb2xvcj1cInByaW1hcnlcIiAoY2hhbmdlKT1cIiRldmVudCA/IG1hc3RlclRvZ2dsZSgpIDogbnVsbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBbY2hlY2tlZF09XCJzZWxlY3Rpb24uaGFzVmFsdWUoKSAmJiBpc0FsbFNlbGVjdGVkKClcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgW2luZGV0ZXJtaW5hdGVdPVwic2VsZWN0aW9uLmhhc1ZhbHVlKCkgJiYgIWlzQWxsU2VsZWN0ZWQoKVwiPlxyXG4gICAgICAgIDwvbWF0LWNoZWNrYm94PlxyXG4gICAgICA8L21hdC1oZWFkZXItY2VsbD5cclxuICAgICAgPG1hdC1jZWxsICptYXRDZWxsRGVmPVwibGV0IHJvd1wiPlxyXG4gICAgICAgIDxtYXQtY2hlY2tib3ggY29sb3I9XCJwcmltYXJ5XCIgKGNsaWNrKT1cIiRldmVudC5zdG9wUHJvcGFnYXRpb24oKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAoY2hhbmdlKT1cIiRldmVudCA/IHNlbGVjdGlvbi50b2dnbGUocm93KSA6IG51bGxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgW2NoZWNrZWRdPVwic2VsZWN0aW9uLmlzU2VsZWN0ZWQocm93KVwiPlxyXG4gICAgICAgIDwvbWF0LWNoZWNrYm94PlxyXG4gICAgICA8L21hdC1jZWxsPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgY29sdW1uIG9mIGNvbHVtbnNcIiBbbWF0Q29sdW1uRGVmXT1cImNvbHVtbi5uYW1lXCI+XHJcbiAgICAgIDxtYXQtaGVhZGVyLWNlbGwgbWF0LXNvcnQtaGVhZGVyICptYXRIZWFkZXJDZWxsRGVmIFtzdHlsZS5tYXgtd2lkdGhdPVwiKGNvbHVtbi53aWR0aCArIDI0KSArICdweCdcIj57e2NvbHVtbi5sYWJlbH19PC9tYXQtaGVhZGVyLWNlbGw+XHJcbiAgICAgIDxtYXQtY2VsbCAqbWF0Q2VsbERlZj1cImxldCByb3c7IGxldCByb3dJbmRleCA9IGluZGV4XCIgW3N0eWxlLm1heC13aWR0aF09XCIoY29sdW1uLndpZHRoICsgMjQpICsgJ3B4J1wiPlxyXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhY29sdW1uLmVkaXRhYmxlOyBlbHNlIGVkaXRhYmxlXCI+XHJcblxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInJvd1tjb2x1bW4ubmFtZV0uY29uc3RydWN0b3IubmFtZSAhPT0gJ0RhdGUnOyBlbHNlIGRhdGVcIj5cclxuICAgICAgICAgICAge3tyb3dbY29sdW1uLm5hbWVdfX1cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGF0ZT5cclxuICAgICAgICAgICAge3tyb3dbY29sdW1uLm5hbWVdIHwgZGF0ZTonc2hvcnQnfX1cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZWRpdGFibGU+XHJcblxyXG4gICAgICAgICAgPG1hdC1wcm9ncmVzcy1iYXIgW2NsYXNzLnNob3ddPVwiZGF0YVNvdXJjZS5yZW5kZXJlZFNhdmluZ1Jvd3Nbcm93SW5kZXhdLmdldChjb2x1bW4ubmFtZSkgfCBhc3luY1wiIG1vZGU9XCJpbmRldGVybWluYXRlXCI+PC9tYXQtcHJvZ3Jlc3MtYmFyPlxyXG5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4udmFsdWVzOyBlbHNlIGVsc2VJZlwiPlxyXG4gICAgICAgICAgICA8bWF0LWZvcm0tZmllbGQgW3N0eWxlLm1heC13aWR0aF09XCJjb2x1bW4ud2lkdGggKyAncHgnXCI+XHJcbiAgICAgICAgICAgICAgPG1hdC1zZWxlY3QgW25nTW9kZWxdPVwicm93W2NvbHVtbi5uYW1lXVwiIChuZ01vZGVsQ2hhbmdlKT1cImNlbGxDaGFuZ2UoY29sdW1uLm5hbWUsIHJvdywgJGV2ZW50LCByb3dJbmRleClcIj5cclxuICAgICAgICAgICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCB2YWx1ZSBvZiBjb2x1bW4udmFsdWVzXCIgW3ZhbHVlXT1cInZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHt7IHZhbHVlIH19XHJcbiAgICAgICAgICAgICAgICA8L21hdC1vcHRpb24+XHJcbiAgICAgICAgICAgICAgPC9tYXQtc2VsZWN0PlxyXG4gICAgICAgICAgICA8L21hdC1mb3JtLWZpZWxkPlxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlICNlbHNlSWY+XHJcbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJyb3dbY29sdW1uLm5hbWVdLmNvbnN0cnVjdG9yLm5hbWUgIT09ICdEYXRlJzsgZWxzZSBkYXRlcGlja2VyXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVkaXQtYnV0dG9uXCIgW21hdE1lbnVUcmlnZ2VyRm9yXT1cIm1lbnVcIj5cclxuICAgICAgICAgICAgICAgIHt7cm93W2NvbHVtbi5uYW1lXX19XHJcbiAgICAgICAgICAgICAgICA8bWF0LWljb24+ZWRpdF9tb2RlPC9tYXQtaWNvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8bWF0LW1lbnUgI21lbnU9XCJtYXRNZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IG1hdC1tZW51LWl0ZW0gZGlzYWJsZWQgY2xhc3M9XCJmdWxsLWhlaWdodC1tZW51LWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgPG1hdC1mb3JtLWZpZWxkIGNsYXNzPVwibWF0LWNlbGxcIiBbc3R5bGUubWF4LXdpZHRoXT1cImNvbHVtbi53aWR0aCArICdweCdcIj4gPCEtLSBtYXQtY2VsbCBpcyBhIGhhY2sgdG8gb3ZlcnJpZGUgdGhlIGRpc2FibGVkIHN0YXRlIG9mIG1hdC1tZW51LWl0ZW0gLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IG1hdElucHV0ICNtZXNzYWdlIFthdHRyLm1heGxlbmd0aF09XCJjb2x1bW4ubWF4TGVuZ3RoXCIgW25nTW9kZWxdPVwicm93W2NvbHVtbi5uYW1lXVwiIChuZ01vZGVsQ2hhbmdlKT1cImNlbGxDaGFuZ2UoY29sdW1uLm5hbWUsIHJvdywgJGV2ZW50LCByb3dJbmRleClcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bWF0LWhpbnQgYWxpZ249XCJlbmRcIj57e21lc3NhZ2UudmFsdWUubGVuZ3RofX0gLyB7e2NvbHVtbi5tYXhMZW5ndGh9fTwvbWF0LWhpbnQ+XHJcbiAgICAgICAgICAgICAgICAgIDwvbWF0LWZvcm0tZmllbGQ+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L21hdC1tZW51PlxyXG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGF0ZXBpY2tlcj5cclxuICAgICAgICAgICAgICA8bWF0LWZvcm0tZmllbGQgW3N0eWxlLm1heC13aWR0aF09XCJjb2x1bW4ud2lkdGggKyAncHgnXCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgbWF0SW5wdXQgW21hdERhdGVwaWNrZXJdPVwicGlja2VyXCIgW25nTW9kZWxdPVwicm93W2NvbHVtbi5uYW1lXVwiIChuZ01vZGVsQ2hhbmdlKT1cImNlbGxDaGFuZ2UoY29sdW1uLm5hbWUsIHJvdywgJGV2ZW50LCByb3dJbmRleClcIj5cclxuICAgICAgICAgICAgICAgIDxtYXQtZGF0ZXBpY2tlci10b2dnbGUgbWF0U3VmZml4IFtmb3JdPVwicGlja2VyXCI+PC9tYXQtZGF0ZXBpY2tlci10b2dnbGU+XHJcbiAgICAgICAgICAgICAgICA8bWF0LWRhdGVwaWNrZXIgI3BpY2tlcj48L21hdC1kYXRlcGlja2VyPlxyXG4gICAgICAgICAgICAgIDwvbWF0LWZvcm0tZmllbGQ+XHJcbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8L21hdC1jZWxsPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gICAgPG1hdC1oZWFkZXItcm93ICptYXRIZWFkZXJSb3dEZWY9XCJkaXNwbGF5ZWRDb2x1bW5zXCI+PC9tYXQtaGVhZGVyLXJvdz5cclxuICAgIDxtYXQtcm93ICptYXRSb3dEZWY9XCJsZXQgcm93OyBjb2x1bW5zOiBkaXNwbGF5ZWRDb2x1bW5zO1wiPjwvbWF0LXJvdz5cclxuICA8L21hdC10YWJsZT5cclxuICA8bWF0LXBhZ2luYXRvciBbcGFnZVNpemVdPVwicGFnZVNpemVcIlxyXG4gICAgICAgICAgICAgICAgIFtwYWdlU2l6ZU9wdGlvbnNdPVwicGFnZVNpemVPcHRpb25zXCJcclxuICAgICAgICAgICAgICAgICBbc2hvd0ZpcnN0TGFzdEJ1dHRvbnNdPVwidHJ1ZVwiPlxyXG4gIDwvbWF0LXBhZ2luYXRvcj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYDpob3N0e2Rpc3BsYXk6YmxvY2t9Omhvc3QgOjpuZy1kZWVwIC5tYXQtY2VsbCAubWF0LWZvcm0tZmllbGQtdW5kZXJsaW5le3Zpc2liaWxpdHk6aGlkZGVufTpob3N0IC5oZWFkZXJ7cGFkZGluZy10b3A6MjRweDtwYWRkaW5nLWxlZnQ6MjRweDtwYWRkaW5nLXJpZ2h0OjI0cHh9Omhvc3QgLmhlYWRlciBoMntkaXNwbGF5OmlubGluZX06aG9zdCAuaGVhZGVyIC5hY3Rpb25ze2Rpc3BsYXk6aW5saW5lLWJsb2NrO2Zsb2F0OnJpZ2h0fTpob3N0IC5oZWFkZXIgLmFjdGlvbnMgLnNlYXJjaC1maWVsZCw6aG9zdCAuaGVhZGVyIC5hY3Rpb25zIGJ1dHRvbnttYXJnaW4tbGVmdDoxMHB4fTpob3N0IC5tYXQtcHJvZ3Jlc3MtYmFye29wYWNpdHk6MH06aG9zdCAubWF0LXByb2dyZXNzLWJhci5zaG93e29wYWNpdHk6MX06aG9zdCAubWF0LWNvbHVtbi1zZWxlY3R7bWF4LXdpZHRoOjQ0cHg7b3ZlcmZsb3c6dmlzaWJsZX06aG9zdCAubWF0LWNlbGx7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7anVzdGlmeS1jb250ZW50OmNlbnRlcn06aG9zdCAubWF0LWNlbGwgLmVkaXQtYnV0dG9ue2N1cnNvcjpwb2ludGVyO2xpbmUtaGVpZ2h0OjI0cHg7d2lkdGg6MTAwJTtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZy1yaWdodDoyNHB4O3BhZGRpbmctdG9wOjEuMTZlbTtwYWRkaW5nLWJvdHRvbToxLjE4ZW19Omhvc3QgLm1hdC1jZWxsIC5lZGl0LWJ1dHRvbiAubWF0LWljb257ZmxvYXQ6cmlnaHQ7bWFyZ2luLWxlZnQ6NXB4fS5mdWxsLWhlaWdodC1tZW51LWl0ZW17aGVpZ2h0OmF1dG87bGluZS1oZWlnaHQ6aW5pdGlhbH1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlQ29tcG9uZW50PFQ+IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGNvbHVtbnM6IENvbHVtbltdO1xyXG4gIEBJbnB1dCgpIHNvcnRDb2x1bW46IHN0cmluZztcclxuICBASW5wdXQoKSBwYWdlU2l6ZU9wdGlvbnM6IG51bWJlcltdID0gWzUsIDEwLCAxNV07XHJcbiAgQElucHV0KCkgcGFnZVNpemUgPSA1O1xyXG4gIEBJbnB1dCgpIGJ1dHRvbnM6IEJ1dHRvbjxUPltdO1xyXG5cclxuICBASW5wdXQoKSBkYXRhU291cmNlOiBBc3luY0RhdGFTb3VyY2U8VD47XHJcblxyXG4gIEBWaWV3Q2hpbGQoTWF0UGFnaW5hdG9yKSBwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcjtcclxuICBAVmlld0NoaWxkKE1hdFNvcnQpIHNvcnQ6IE1hdFNvcnQ7XHJcblxyXG4gIGRpc3BsYXllZENvbHVtbnMgPSBbJ3NlbGVjdCddO1xyXG4gIHNlbGVjdGlvbiA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxUPih0cnVlLCBbXSk7XHJcblxyXG4gIGZpbHRlcjogc3RyaW5nO1xyXG4gIHByaXZhdGUgZmlsdGVyQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xyXG5cclxuICBwcml2YXRlIGNlbGxDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7Y29sdW1uOiBzdHJpbmcsIHZhbHVlczogVCwgcm93SW5kZXg6IG51bWJlcn0+KCk7XHJcblxyXG4gIHByaXZhdGUgcmVuZGVyZWRSb3dzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc25hY2tCYXI6IE1hdFNuYWNrQmFyKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBmb3IgKGNvbnN0IGNvbHVtbiBvZiB0aGlzLmNvbHVtbnMpIHtcclxuICAgICAgdGhpcy5kaXNwbGF5ZWRDb2x1bW5zLnB1c2goY29sdW1uLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGF0YVNvdXJjZS5zZXR1cCh0aGlzLnBhZ2luYXRvciwgdGhpcy5zb3J0LCB0aGlzLmZpbHRlckNoYW5nZWQsIHRoaXMuY2VsbENoYW5nZWQpO1xyXG5cclxuICAgIC8vIElmIHRoZSB1c2VyIGNoYW5nZXMgdGhlIHNvcnQgb3IgdGhlIGZpbHRlciwgcmVzZXQgYmFjayB0byB0aGUgZmlyc3QgcGFnZS5cclxuICAgIG1lcmdlKHRoaXMuc29ydC5zb3J0Q2hhbmdlLCB0aGlzLmZpbHRlckNoYW5nZWQpLnN1YnNjcmliZSgoKSA9PiB0aGlzLnBhZ2luYXRvci5wYWdlSW5kZXggPSAwKTtcclxuXHJcbiAgICB0aGlzLmRhdGFTb3VyY2Uuc2F2ZUVycm9yLnBpcGUoc2tpcCgxKSkuc3Vic2NyaWJlKChlcnJvcikgPT4ge1xyXG4gICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oZXJyb3IsIG51bGwsIHtcclxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcclxuICAgICAgICBob3Jpem9udGFsUG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgdmVydGljYWxQb3NpdGlvbjogJ2JvdHRvbSdcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZXNlbGVjdHMgcm93cyBpZiB0aGV5IGFyZSBub3QgaW4gdGhlIGN1cnJlbnQgZmlsdGVyIG9yIHBhZ2VcclxuICAgIHRoaXMucmVuZGVyZWRSb3dzU3Vic2NyaXB0aW9uID0gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkUm93c09ic2VydmFibGUuc3Vic2NyaWJlKChyZW5kZXJlZFJvd3MpID0+IHtcclxuICAgICAgZm9yIChjb25zdCBzZWxlY3RlZCBvZiB0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZCkge1xyXG4gICAgICAgIGlmIChyZW5kZXJlZFJvd3MuaW5kZXhPZihzZWxlY3RlZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5kZXNlbGVjdChzZWxlY3RlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5yZW5kZXJlZFJvd3NTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICB9XHJcblxyXG4gIGNlbGxDaGFuZ2UoY29sdW1uOiBzdHJpbmcsIHJvdzogVCwgbmV3VmFsdWU6IGFueSwgcm93SW5kZXg6IG51bWJlcikge1xyXG4gICAgcm93W2NvbHVtbl0gPSBuZXdWYWx1ZTtcclxuXHJcbiAgICB0aGlzLmNlbGxDaGFuZ2VkLmVtaXQoe2NvbHVtbjogY29sdW1uLCB2YWx1ZXM6IHJvdywgcm93SW5kZXg6IHJvd0luZGV4fSk7XHJcbiAgfVxyXG5cclxuICBmaWx0ZXJDaGFuZ2UobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5maWx0ZXIgPSBuZXdWYWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTsgLy8gUmVtb3ZlIHdoaXRlc3BhY2U7IE1hdFRhYmxlRGF0YVNvdXJjZSBkZWZhdWx0cyB0byBsb3dlcmNhc2UgbWF0Y2hlc1xyXG4gICAgdGhpcy5maWx0ZXJDaGFuZ2VkLmVtaXQodGhpcy5maWx0ZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNlbGVjdHMgYWxsIHJvd3MgaWYgdGhleSBhcmUgbm90IGFsbCBzZWxlY3RlZDsgb3RoZXJ3aXNlIGNsZWFyIHNlbGVjdGlvbi4gKi9cclxuICBtYXN0ZXJUb2dnbGUoKSB7XHJcbiAgICBpZiAodGhpcy5pc0FsbFNlbGVjdGVkKCkpIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb24uY2xlYXIoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdCguLi50aGlzLmRhdGFTb3VyY2UucmVuZGVyZWRSb3dzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBXaGV0aGVyIHRoZSBudW1iZXIgb2Ygc2VsZWN0ZWQgZWxlbWVudHMgbWF0Y2hlcyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3MgZGlzcGxheWVkLiAqL1xyXG4gIGlzQWxsU2VsZWN0ZWQoKSB7XHJcbiAgICBjb25zdCBudW1TZWxlY3RlZCA9IHRoaXMuc2VsZWN0aW9uLnNlbGVjdGVkLmxlbmd0aDtcclxuICAgIGNvbnN0IG51bVJvd3MgPSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWRSb3dzLmxlbmd0aDtcclxuICAgIHJldHVybiBudW1TZWxlY3RlZCA9PT0gbnVtUm93cztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29sdW1uIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICB3aWR0aD86IHN0cmluZztcclxuICBlZGl0YWJsZT86IGJvb2xlYW47XHJcbiAgbWF4TGVuZ3RoPzogbnVtYmVyO1xyXG4gIHZhbHVlcz86IChzdHJpbmcgfCBudW1iZXIpW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQnV0dG9uPFQ+IHtcclxuICBpY29uOiBzdHJpbmc7XHJcbiAgYWN0aW9uOiAoc2VsZWN0ZWQ6IFRbXSkgPT4gdm9pZDtcclxuICBzZWxlY3Rpb25SZXF1aXJlZDogYm9vbGVhbjtcclxuICBtdWx0aVNlbGVjdGlvbjogYm9vbGVhbjtcclxufVxyXG4iLCJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuXHJcbmltcG9ydCB7XHJcbiAgTWF0Q2FyZE1vZHVsZSwgTWF0Q2hlY2tib3hNb2R1bGUsIE1hdEZvcm1GaWVsZE1vZHVsZSwgTWF0SW5wdXRNb2R1bGUsIE1hdFRhYmxlTW9kdWxlLCBNYXREYXRlcGlja2VyTW9kdWxlLFxyXG4gIE1hdE5hdGl2ZURhdGVNb2R1bGUsIE1hdFNlbGVjdE1vZHVsZSwgTWF0SWNvbk1vZHVsZSwgTWF0TWVudU1vZHVsZSwgTWF0UGFnaW5hdG9yTW9kdWxlLCBNYXRTb3J0TW9kdWxlLCBNYXRQcm9ncmVzc0Jhck1vZHVsZSxcclxuICBNYXRTbmFja0Jhck1vZHVsZSwgTWF0QnV0dG9uTW9kdWxlXHJcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xyXG5cclxuaW1wb3J0IHsgRGF0YVRhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RhdGEtdGFibGUvZGF0YS10YWJsZS5jb21wb25lbnQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBNYXRUYWJsZU1vZHVsZSxcclxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcclxuICAgIE1hdElucHV0TW9kdWxlLFxyXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXHJcbiAgICBNYXROYXRpdmVEYXRlTW9kdWxlLFxyXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcclxuICAgIE1hdFNlbGVjdE1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRNZW51TW9kdWxlLFxyXG4gICAgTWF0UGFnaW5hdG9yTW9kdWxlLFxyXG4gICAgTWF0U29ydE1vZHVsZSxcclxuICAgIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxyXG4gICAgTWF0U25hY2tCYXJNb2R1bGUsXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBEYXRhVGFibGVDb21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIERhdGFUYWJsZUNvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcblxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZU1vZHVsZSB7XHJcbiAgcHVibGljIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBEYXRhVGFibGVNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX3ZhbHVlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQTs7O0FBQUE7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