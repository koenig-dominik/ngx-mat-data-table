(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/core'), require('@angular/material'), require('@angular/cdk/collections'), require('rxjs'), require('rxjs/operators'), require('@angular/common'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('ngx-mat-data-table', ['exports', 'tslib', '@angular/core', '@angular/material', '@angular/cdk/collections', 'rxjs', 'rxjs/operators', '@angular/common', '@angular/forms'], factory) :
    (factory((global['ngx-mat-data-table'] = {}),global.tslib,global.ng.core,global.ng.material,global.ng.cdk.collections,null,global.Rx.Observable.prototype,global.ng.common,global.ng.forms));
}(this, (function (exports,tslib_1,core,material,collections,rxjs,operators,common,forms) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @template T
     */
    var DataTableComponent = (function () {
        function DataTableComponent(snackBar) {
            this.snackBar = snackBar;
            this.pageSizeOptions = [5, 10, 15];
            this.pageSize = 5;
            this.displayedColumns = ['select'];
            this.selection = new collections.SelectionModel(true, []);
            this.filterChanged = new core.EventEmitter();
            this.cellChanged = new core.EventEmitter();
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
                    for (var _a = tslib_1.__values(this.columns), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var column = _b.value;
                        this.displayedColumns.push(column.name);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return))
                            _c.call(_a);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                this.dataSource.setup(this.paginator, this.sort, this.filterChanged, this.cellChanged);
                // If the user changes the sort or the filter, reset back to the first page.
                rxjs.merge(this.sort.sortChange, this.filterChanged).subscribe(function () { return _this.paginator.pageIndex = 0; });
                this.dataSource.saveError.pipe(operators.skip(1)).subscribe(function (error) {
                    _this.snackBar.open(error, null, {
                        duration: 2000,
                        horizontalPosition: 'right',
                        verticalPosition: 'bottom'
                    });
                });
                // Deselects rows if they are not in the current filter or page
                this.renderedRowsSubscription = this.dataSource.renderedRowsObservable.subscribe(function (renderedRows) {
                    try {
                        for (var _a = tslib_1.__values(_this.selection.selected), _b = _a.next(); !_b.done; _b = _a.next()) {
                            var selected = _b.value;
                            if (renderedRows.indexOf(selected) === -1) {
                                _this.selection.deselect(selected);
                            }
                        }
                    }
                    catch (e_2_1) {
                        e_2 = { error: e_2_1 };
                    }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return))
                                _c.call(_a);
                        }
                        finally {
                            if (e_2)
                                throw e_2.error;
                        }
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
                    (_a = this.selection).select.apply(_a, tslib_1.__spread(this.dataSource.renderedRows));
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
            { type: core.Component, args: [{
                        selector: 'ngx-mat-data-table',
                        template: "<div class=\"mat-typography mat-elevation-z2\">\n  <div class=\"header\">\n    <h2>{{title}}</h2>\n    <div class=\"actions\">\n\n      <button *ngFor=\"let button of buttons\"\n              mat-icon-button\n              (click)=\"button.action(selection.selected)\"\n              [disabled]=\"button.selectionRequired && selection.selected.length === 0 || button.selectionRequired && !button.multiSelection && selection.selected.length > 1\">\n        <mat-icon>{{button.icon}}</mat-icon>\n      </button>\n      <mat-form-field class=\"search-field\">\n        <input [ngModel]=\"filter\" (ngModelChange)=\"filterChange($event)\" matInput placeholder=\"Filter\">\n      </mat-form-field>\n    </div>\n  </div>\n\n  <mat-progress-bar [class.show]=\"(dataSource.loading | async) || (dataSource.buffering | async)\" [mode]=\"(dataSource.buffering | async) ? 'buffer' : 'indeterminate'\"></mat-progress-bar>\n  <mat-table #table [dataSource]=\"dataSource\"\n             matSort [matSortActive]=\"sortColumn\" matSortDisableClear matSortDirection=\"asc\">\n\n    <!-- Checkbox Column -->\n    <ng-container matColumnDef=\"select\">\n      <mat-header-cell *matHeaderCellDef>\n        <mat-checkbox color=\"primary\" (change)=\"$event ? masterToggle() : null\"\n                      [checked]=\"selection.hasValue() && isAllSelected()\"\n                      [indeterminate]=\"selection.hasValue() && !isAllSelected()\">\n        </mat-checkbox>\n      </mat-header-cell>\n      <mat-cell *matCellDef=\"let row\">\n        <mat-checkbox color=\"primary\" (click)=\"$event.stopPropagation()\"\n                      (change)=\"$event ? selection.toggle(row) : null\"\n                      [checked]=\"selection.isSelected(row)\">\n        </mat-checkbox>\n      </mat-cell>\n    </ng-container>\n\n    <ng-container *ngFor=\"let column of columns\" [matColumnDef]=\"column.name\">\n      <mat-header-cell mat-sort-header *matHeaderCellDef [style.max-width]=\"(column.width + 24) + 'px'\">{{column.label}}</mat-header-cell>\n      <mat-cell *matCellDef=\"let row; let rowIndex = index\" [style.max-width]=\"(column.width + 24) + 'px'\">\n        <ng-container *ngIf=\"!column.editable; else editable\">\n\n          <ng-container *ngIf=\"row[column.name].constructor.name !== 'Date'; else date\">\n            {{row[column.name]}}\n          </ng-container>\n\n          <ng-template #date>\n            {{row[column.name] | date:'short'}}\n          </ng-template>\n\n        </ng-container>\n        <ng-template #editable>\n\n          <mat-progress-bar [class.show]=\"dataSource.renderedSavingRows[rowIndex].get(column.name) | async\" mode=\"indeterminate\"></mat-progress-bar>\n\n          <ng-container *ngIf=\"column.values; else elseIf\">\n            <mat-form-field [style.max-width]=\"column.width + 'px'\">\n              <mat-select [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                <mat-option *ngFor=\"let value of column.values\" [value]=\"value\">\n                  {{ value }}\n                </mat-option>\n              </mat-select>\n            </mat-form-field>\n          </ng-container>\n\n          <ng-template #elseIf>\n            <ng-container *ngIf=\"row[column.name].constructor.name !== 'Date'; else datepicker\">\n              <div class=\"edit-button\" [matMenuTriggerFor]=\"menu\">\n                {{row[column.name]}}\n                <mat-icon>edit_mode</mat-icon>\n              </div>\n              <mat-menu #menu=\"matMenu\">\n                <div mat-menu-item disabled class=\"full-height-menu-item\">\n                  <mat-form-field class=\"mat-cell\" [style.max-width]=\"column.width + 'px'\"> <!-- mat-cell is a hack to override the disabled state of mat-menu-item -->\n                    <input matInput #message [attr.maxlength]=\"column.maxLength\" [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                    <mat-hint align=\"end\">{{message.value.length}} / {{column.maxLength}}</mat-hint>\n                  </mat-form-field>\n                </div>\n              </mat-menu>\n            </ng-container>\n\n            <ng-template #datepicker>\n              <mat-form-field [style.max-width]=\"column.width + 'px'\">\n                <input matInput [matDatepicker]=\"picker\" [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n                <mat-datepicker #picker></mat-datepicker>\n              </mat-form-field>\n            </ng-template>\n          </ng-template>\n\n        </ng-template>\n      </mat-cell>\n    </ng-container>\n\n    <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n    <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n  </mat-table>\n  <mat-paginator [pageSize]=\"pageSize\"\n                 [pageSizeOptions]=\"pageSizeOptions\"\n                 [showFirstLastButtons]=\"true\">\n  </mat-paginator>\n</div>\n",
                        styles: [":host{display:block}:host ::ng-deep .mat-cell .mat-form-field-underline{visibility:hidden}:host .header{padding-top:24px;padding-left:24px;padding-right:24px}:host .header h2{display:inline}:host .header .actions{display:inline-block;float:right}:host .header .actions .search-field,:host .header .actions button{margin-left:10px}:host .mat-progress-bar{opacity:0}:host .mat-progress-bar.show{opacity:1}:host .mat-column-select{max-width:44px;overflow:visible}:host .mat-cell{flex-direction:column;align-items:flex-start;justify-content:center}:host .mat-cell .edit-button{cursor:pointer;line-height:24px;width:100%;box-sizing:border-box;padding-right:24px;padding-top:1.16em;padding-bottom:1.18em}:host .mat-cell .edit-button .mat-icon{float:right;margin-left:5px}.full-height-menu-item{height:auto;line-height:initial}"]
                    },] },
        ];
        /** @nocollapse */
        DataTableComponent.ctorParameters = function () {
            return [
                { type: material.MatSnackBar, },
            ];
        };
        DataTableComponent.propDecorators = {
            "title": [{ type: core.Input },],
            "columns": [{ type: core.Input },],
            "sortColumn": [{ type: core.Input },],
            "pageSizeOptions": [{ type: core.Input },],
            "pageSize": [{ type: core.Input },],
            "buttons": [{ type: core.Input },],
            "dataSource": [{ type: core.Input },],
            "paginator": [{ type: core.ViewChild, args: [material.MatPaginator,] },],
            "sort": [{ type: core.ViewChild, args: [material.MatSort,] },],
        };
        return DataTableComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var DataTableModule = (function () {
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
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            material.MatTableModule,
                            material.MatFormFieldModule,
                            material.MatInputModule,
                            material.MatCheckboxModule,
                            material.MatNativeDateModule,
                            material.MatDatepickerModule,
                            material.MatSelectModule,
                            material.MatIconModule,
                            material.MatMenuModule,
                            material.MatPaginatorModule,
                            material.MatSortModule,
                            material.MatProgressBarModule,
                            material.MatSnackBarModule,
                            material.MatButtonModule,
                            forms.FormsModule
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
     * @template T
     */
    var /**
     * @template T
     */ AsyncDataSource = (function () {
        function AsyncDataSource(uniqueKey, fetchData, changeData, debounce) {
            if (debounce === void 0) {
                debounce = 300;
            }
            this.uniqueKey = uniqueKey;
            this.fetchData = fetchData;
            this.changeData = changeData;
            this.debounce = debounce;
            this.filter = '';
            this.renderedRowsSubject = new rxjs.BehaviorSubject([]);
            this.loadingSubject = new rxjs.BehaviorSubject(false);
            this.bufferingSubject = new rxjs.BehaviorSubject(false);
            this.saveErrorSubject = new rxjs.BehaviorSubject('');
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
             */ function () {
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
                rxjs.merge(filterEvent, this.sort.sortChange, this.paginator.page).pipe(operators.tap(function (value) {
                    if (typeof value === 'string') {
                        // If the value is of type string it must be the filter
                        _this.filter = value;
                    }
                    _this.bufferingSubject.next(true);
                }), operators.debounceTime(this.debounce), operators.tap(function () {
                    _this.bufferingSubject.next(false);
                }), operators.distinctUntilChanged(function (oldValue, newValue) {
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
                editedEvent.pipe(operators.debounceTime(this.debounce)).subscribe(function (event) {
                    return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var renderedSavingRow, error_1;
                        return tslib_1.__generator(this, function (_a) {
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
                    });
                });
            };
        /**
         * @return {?}
         */
        AsyncDataSource.prototype.updateCurrentView = /**
         * @return {?}
         */
            function () {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var result, viewKey, i, length_1, row, uniqueValue, column, columns, column;
                    return tslib_1.__generator(this, function (_a) {
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
                                            columns.set(column, new rxjs.BehaviorSubject(false));
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
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.DataTableModule = DataTableModule;
    exports.AsyncDataSource = AsyncDataSource;
    exports.ɵa = DataTableComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW1hdC1kYXRhLXRhYmxlLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmd4LW1hdC1kYXRhLXRhYmxlL2NvbXBvbmVudHMvZGF0YS10YWJsZS9kYXRhLXRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LW1hdC1kYXRhLXRhYmxlL2RhdGEtdGFibGUubW9kdWxlLnRzIiwibmc6Ly9uZ3gtbWF0LWRhdGEtdGFibGUvYXN5bmMtZGF0YS1zb3VyY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge01hdFBhZ2luYXRvciwgTWF0U25hY2tCYXIsIE1hdFNvcnR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcclxuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcclxuaW1wb3J0IHttZXJnZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7c2tpcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuaW1wb3J0IHtBc3luY0RhdGFTb3VyY2V9IGZyb20gJy4uLy4uL2FzeW5jLWRhdGEtc291cmNlJztcclxuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMvaW50ZXJuYWwvU3Vic2NyaXB0aW9uJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LW1hdC1kYXRhLXRhYmxlJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJtYXQtdHlwb2dyYXBoeSBtYXQtZWxldmF0aW9uLXoyXCI+XHJcbiAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgPGgyPnt7dGl0bGV9fTwvaDI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uc1wiPlxyXG5cclxuICAgICAgPGJ1dHRvbiAqbmdGb3I9XCJsZXQgYnV0dG9uIG9mIGJ1dHRvbnNcIlxyXG4gICAgICAgICAgICAgIG1hdC1pY29uLWJ1dHRvblxyXG4gICAgICAgICAgICAgIChjbGljayk9XCJidXR0b24uYWN0aW9uKHNlbGVjdGlvbi5zZWxlY3RlZClcIlxyXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJidXR0b24uc2VsZWN0aW9uUmVxdWlyZWQgJiYgc2VsZWN0aW9uLnNlbGVjdGVkLmxlbmd0aCA9PT0gMCB8fCBidXR0b24uc2VsZWN0aW9uUmVxdWlyZWQgJiYgIWJ1dHRvbi5tdWx0aVNlbGVjdGlvbiAmJiBzZWxlY3Rpb24uc2VsZWN0ZWQubGVuZ3RoID4gMVwiPlxyXG4gICAgICAgIDxtYXQtaWNvbj57e2J1dHRvbi5pY29ufX08L21hdC1pY29uPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPG1hdC1mb3JtLWZpZWxkIGNsYXNzPVwic2VhcmNoLWZpZWxkXCI+XHJcbiAgICAgICAgPGlucHV0IFtuZ01vZGVsXT1cImZpbHRlclwiIChuZ01vZGVsQ2hhbmdlKT1cImZpbHRlckNoYW5nZSgkZXZlbnQpXCIgbWF0SW5wdXQgcGxhY2Vob2xkZXI9XCJGaWx0ZXJcIj5cclxuICAgICAgPC9tYXQtZm9ybS1maWVsZD5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG5cclxuICA8bWF0LXByb2dyZXNzLWJhciBbY2xhc3Muc2hvd109XCIoZGF0YVNvdXJjZS5sb2FkaW5nIHwgYXN5bmMpIHx8IChkYXRhU291cmNlLmJ1ZmZlcmluZyB8IGFzeW5jKVwiIFttb2RlXT1cIihkYXRhU291cmNlLmJ1ZmZlcmluZyB8IGFzeW5jKSA/ICdidWZmZXInIDogJ2luZGV0ZXJtaW5hdGUnXCI+PC9tYXQtcHJvZ3Jlc3MtYmFyPlxyXG4gIDxtYXQtdGFibGUgI3RhYmxlIFtkYXRhU291cmNlXT1cImRhdGFTb3VyY2VcIlxyXG4gICAgICAgICAgICAgbWF0U29ydCBbbWF0U29ydEFjdGl2ZV09XCJzb3J0Q29sdW1uXCIgbWF0U29ydERpc2FibGVDbGVhciBtYXRTb3J0RGlyZWN0aW9uPVwiYXNjXCI+XHJcblxyXG4gICAgPCEtLSBDaGVja2JveCBDb2x1bW4gLS0+XHJcbiAgICA8bmctY29udGFpbmVyIG1hdENvbHVtbkRlZj1cInNlbGVjdFwiPlxyXG4gICAgICA8bWF0LWhlYWRlci1jZWxsICptYXRIZWFkZXJDZWxsRGVmPlxyXG4gICAgICAgIDxtYXQtY2hlY2tib3ggY29sb3I9XCJwcmltYXJ5XCIgKGNoYW5nZSk9XCIkZXZlbnQgPyBtYXN0ZXJUb2dnbGUoKSA6IG51bGxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgW2NoZWNrZWRdPVwic2VsZWN0aW9uLmhhc1ZhbHVlKCkgJiYgaXNBbGxTZWxlY3RlZCgpXCJcclxuICAgICAgICAgICAgICAgICAgICAgIFtpbmRldGVybWluYXRlXT1cInNlbGVjdGlvbi5oYXNWYWx1ZSgpICYmICFpc0FsbFNlbGVjdGVkKClcIj5cclxuICAgICAgICA8L21hdC1jaGVja2JveD5cclxuICAgICAgPC9tYXQtaGVhZGVyLWNlbGw+XHJcbiAgICAgIDxtYXQtY2VsbCAqbWF0Q2VsbERlZj1cImxldCByb3dcIj5cclxuICAgICAgICA8bWF0LWNoZWNrYm94IGNvbG9yPVwicHJpbWFyeVwiIChjbGljayk9XCIkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgKGNoYW5nZSk9XCIkZXZlbnQgPyBzZWxlY3Rpb24udG9nZ2xlKHJvdykgOiBudWxsXCJcclxuICAgICAgICAgICAgICAgICAgICAgIFtjaGVja2VkXT1cInNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdylcIj5cclxuICAgICAgICA8L21hdC1jaGVja2JveD5cclxuICAgICAgPC9tYXQtY2VsbD5cclxuICAgIDwvbmctY29udGFpbmVyPlxyXG5cclxuICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGNvbHVtbiBvZiBjb2x1bW5zXCIgW21hdENvbHVtbkRlZl09XCJjb2x1bW4ubmFtZVwiPlxyXG4gICAgICA8bWF0LWhlYWRlci1jZWxsIG1hdC1zb3J0LWhlYWRlciAqbWF0SGVhZGVyQ2VsbERlZiBbc3R5bGUubWF4LXdpZHRoXT1cIihjb2x1bW4ud2lkdGggKyAyNCkgKyAncHgnXCI+e3tjb2x1bW4ubGFiZWx9fTwvbWF0LWhlYWRlci1jZWxsPlxyXG4gICAgICA8bWF0LWNlbGwgKm1hdENlbGxEZWY9XCJsZXQgcm93OyBsZXQgcm93SW5kZXggPSBpbmRleFwiIFtzdHlsZS5tYXgtd2lkdGhdPVwiKGNvbHVtbi53aWR0aCArIDI0KSArICdweCdcIj5cclxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWNvbHVtbi5lZGl0YWJsZTsgZWxzZSBlZGl0YWJsZVwiPlxyXG5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJyb3dbY29sdW1uLm5hbWVdLmNvbnN0cnVjdG9yLm5hbWUgIT09ICdEYXRlJzsgZWxzZSBkYXRlXCI+XHJcbiAgICAgICAgICAgIHt7cm93W2NvbHVtbi5uYW1lXX19XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgI2RhdGU+XHJcbiAgICAgICAgICAgIHt7cm93W2NvbHVtbi5uYW1lXSB8IGRhdGU6J3Nob3J0J319XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgI2VkaXRhYmxlPlxyXG5cclxuICAgICAgICAgIDxtYXQtcHJvZ3Jlc3MtYmFyIFtjbGFzcy5zaG93XT1cImRhdGFTb3VyY2UucmVuZGVyZWRTYXZpbmdSb3dzW3Jvd0luZGV4XS5nZXQoY29sdW1uLm5hbWUpIHwgYXN5bmNcIiBtb2RlPVwiaW5kZXRlcm1pbmF0ZVwiPjwvbWF0LXByb2dyZXNzLWJhcj5cclxuXHJcbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29sdW1uLnZhbHVlczsgZWxzZSBlbHNlSWZcIj5cclxuICAgICAgICAgICAgPG1hdC1mb3JtLWZpZWxkIFtzdHlsZS5tYXgtd2lkdGhdPVwiY29sdW1uLndpZHRoICsgJ3B4J1wiPlxyXG4gICAgICAgICAgICAgIDxtYXQtc2VsZWN0IFtuZ01vZGVsXT1cInJvd1tjb2x1bW4ubmFtZV1cIiAobmdNb2RlbENoYW5nZSk9XCJjZWxsQ2hhbmdlKGNvbHVtbi5uYW1lLCByb3csICRldmVudCwgcm93SW5kZXgpXCI+XHJcbiAgICAgICAgICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgdmFsdWUgb2YgY29sdW1uLnZhbHVlc1wiIFt2YWx1ZV09XCJ2YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7eyB2YWx1ZSB9fVxyXG4gICAgICAgICAgICAgICAgPC9tYXQtb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDwvbWF0LXNlbGVjdD5cclxuICAgICAgICAgICAgPC9tYXQtZm9ybS1maWVsZD5cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZWxzZUlmPlxyXG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwicm93W2NvbHVtbi5uYW1lXS5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnRGF0ZSc7IGVsc2UgZGF0ZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlZGl0LWJ1dHRvblwiIFttYXRNZW51VHJpZ2dlckZvcl09XCJtZW51XCI+XHJcbiAgICAgICAgICAgICAgICB7e3Jvd1tjb2x1bW4ubmFtZV19fVxyXG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPmVkaXRfbW9kZTwvbWF0LWljb24+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPG1hdC1tZW51ICNtZW51PVwibWF0TWVudVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBtYXQtbWVudS1pdGVtIGRpc2FibGVkIGNsYXNzPVwiZnVsbC1oZWlnaHQtbWVudS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cIm1hdC1jZWxsXCIgW3N0eWxlLm1heC13aWR0aF09XCJjb2x1bW4ud2lkdGggKyAncHgnXCI+IDwhLS0gbWF0LWNlbGwgaXMgYSBoYWNrIHRvIG92ZXJyaWRlIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiBtYXQtbWVudS1pdGVtIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBtYXRJbnB1dCAjbWVzc2FnZSBbYXR0ci5tYXhsZW5ndGhdPVwiY29sdW1uLm1heExlbmd0aFwiIFtuZ01vZGVsXT1cInJvd1tjb2x1bW4ubmFtZV1cIiAobmdNb2RlbENoYW5nZSk9XCJjZWxsQ2hhbmdlKGNvbHVtbi5uYW1lLCByb3csICRldmVudCwgcm93SW5kZXgpXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG1hdC1oaW50IGFsaWduPVwiZW5kXCI+e3ttZXNzYWdlLnZhbHVlLmxlbmd0aH19IC8ge3tjb2x1bW4ubWF4TGVuZ3RofX08L21hdC1oaW50PlxyXG4gICAgICAgICAgICAgICAgICA8L21hdC1mb3JtLWZpZWxkPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9tYXQtbWVudT5cclxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgI2RhdGVwaWNrZXI+XHJcbiAgICAgICAgICAgICAgPG1hdC1mb3JtLWZpZWxkIFtzdHlsZS5tYXgtd2lkdGhdPVwiY29sdW1uLndpZHRoICsgJ3B4J1wiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IG1hdElucHV0IFttYXREYXRlcGlja2VyXT1cInBpY2tlclwiIFtuZ01vZGVsXT1cInJvd1tjb2x1bW4ubmFtZV1cIiAobmdNb2RlbENoYW5nZSk9XCJjZWxsQ2hhbmdlKGNvbHVtbi5uYW1lLCByb3csICRldmVudCwgcm93SW5kZXgpXCI+XHJcbiAgICAgICAgICAgICAgICA8bWF0LWRhdGVwaWNrZXItdG9nZ2xlIG1hdFN1ZmZpeCBbZm9yXT1cInBpY2tlclwiPjwvbWF0LWRhdGVwaWNrZXItdG9nZ2xlPlxyXG4gICAgICAgICAgICAgICAgPG1hdC1kYXRlcGlja2VyICNwaWNrZXI+PC9tYXQtZGF0ZXBpY2tlcj5cclxuICAgICAgICAgICAgICA8L21hdC1mb3JtLWZpZWxkPlxyXG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgPC9tYXQtY2VsbD5cclxuICAgIDwvbmctY29udGFpbmVyPlxyXG5cclxuICAgIDxtYXQtaGVhZGVyLXJvdyAqbWF0SGVhZGVyUm93RGVmPVwiZGlzcGxheWVkQ29sdW1uc1wiPjwvbWF0LWhlYWRlci1yb3c+XHJcbiAgICA8bWF0LXJvdyAqbWF0Um93RGVmPVwibGV0IHJvdzsgY29sdW1uczogZGlzcGxheWVkQ29sdW1ucztcIj48L21hdC1yb3c+XHJcbiAgPC9tYXQtdGFibGU+XHJcbiAgPG1hdC1wYWdpbmF0b3IgW3BhZ2VTaXplXT1cInBhZ2VTaXplXCJcclxuICAgICAgICAgICAgICAgICBbcGFnZVNpemVPcHRpb25zXT1cInBhZ2VTaXplT3B0aW9uc1wiXHJcbiAgICAgICAgICAgICAgICAgW3Nob3dGaXJzdExhc3RCdXR0b25zXT1cInRydWVcIj5cclxuICA8L21hdC1wYWdpbmF0b3I+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2A6aG9zdHtkaXNwbGF5OmJsb2NrfTpob3N0IDo6bmctZGVlcCAubWF0LWNlbGwgLm1hdC1mb3JtLWZpZWxkLXVuZGVybGluZXt2aXNpYmlsaXR5OmhpZGRlbn06aG9zdCAuaGVhZGVye3BhZGRpbmctdG9wOjI0cHg7cGFkZGluZy1sZWZ0OjI0cHg7cGFkZGluZy1yaWdodDoyNHB4fTpob3N0IC5oZWFkZXIgaDJ7ZGlzcGxheTppbmxpbmV9Omhvc3QgLmhlYWRlciAuYWN0aW9uc3tkaXNwbGF5OmlubGluZS1ibG9jaztmbG9hdDpyaWdodH06aG9zdCAuaGVhZGVyIC5hY3Rpb25zIC5zZWFyY2gtZmllbGQsOmhvc3QgLmhlYWRlciAuYWN0aW9ucyBidXR0b257bWFyZ2luLWxlZnQ6MTBweH06aG9zdCAubWF0LXByb2dyZXNzLWJhcntvcGFjaXR5OjB9Omhvc3QgLm1hdC1wcm9ncmVzcy1iYXIuc2hvd3tvcGFjaXR5OjF9Omhvc3QgLm1hdC1jb2x1bW4tc2VsZWN0e21heC13aWR0aDo0NHB4O292ZXJmbG93OnZpc2libGV9Omhvc3QgLm1hdC1jZWxse2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpmbGV4LXN0YXJ0O2p1c3RpZnktY29udGVudDpjZW50ZXJ9Omhvc3QgLm1hdC1jZWxsIC5lZGl0LWJ1dHRvbntjdXJzb3I6cG9pbnRlcjtsaW5lLWhlaWdodDoyNHB4O3dpZHRoOjEwMCU7Ym94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmctcmlnaHQ6MjRweDtwYWRkaW5nLXRvcDoxLjE2ZW07cGFkZGluZy1ib3R0b206MS4xOGVtfTpob3N0IC5tYXQtY2VsbCAuZWRpdC1idXR0b24gLm1hdC1pY29ue2Zsb2F0OnJpZ2h0O21hcmdpbi1sZWZ0OjVweH0uZnVsbC1oZWlnaHQtbWVudS1pdGVte2hlaWdodDphdXRvO2xpbmUtaGVpZ2h0OmluaXRpYWx9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZUNvbXBvbmVudDxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuXHJcbiAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcclxuICBASW5wdXQoKSBjb2x1bW5zOiBDb2x1bW5bXTtcclxuICBASW5wdXQoKSBzb3J0Q29sdW1uOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcGFnZVNpemVPcHRpb25zOiBudW1iZXJbXSA9IFs1LCAxMCwgMTVdO1xyXG4gIEBJbnB1dCgpIHBhZ2VTaXplID0gNTtcclxuICBASW5wdXQoKSBidXR0b25zOiBCdXR0b248VD5bXTtcclxuXHJcbiAgQElucHV0KCkgZGF0YVNvdXJjZTogQXN5bmNEYXRhU291cmNlPFQ+O1xyXG5cclxuICBAVmlld0NoaWxkKE1hdFBhZ2luYXRvcikgcGFnaW5hdG9yOiBNYXRQYWdpbmF0b3I7XHJcbiAgQFZpZXdDaGlsZChNYXRTb3J0KSBzb3J0OiBNYXRTb3J0O1xyXG5cclxuICBkaXNwbGF5ZWRDb2x1bW5zID0gWydzZWxlY3QnXTtcclxuICBzZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uTW9kZWw8VD4odHJ1ZSwgW10pO1xyXG5cclxuICBmaWx0ZXI6IHN0cmluZztcclxuICBwcml2YXRlIGZpbHRlckNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuXHJcbiAgcHJpdmF0ZSBjZWxsQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8e2NvbHVtbjogc3RyaW5nLCB2YWx1ZXM6IFQsIHJvd0luZGV4OiBudW1iZXJ9PigpO1xyXG5cclxuICBwcml2YXRlIHJlbmRlcmVkUm93c1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNuYWNrQmFyOiBNYXRTbmFja0Jhcikge1xyXG5cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgZm9yIChjb25zdCBjb2x1bW4gb2YgdGhpcy5jb2x1bW5zKSB7XHJcbiAgICAgIHRoaXMuZGlzcGxheWVkQ29sdW1ucy5wdXNoKGNvbHVtbi5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRhdGFTb3VyY2Uuc2V0dXAodGhpcy5wYWdpbmF0b3IsIHRoaXMuc29ydCwgdGhpcy5maWx0ZXJDaGFuZ2VkLCB0aGlzLmNlbGxDaGFuZ2VkKTtcclxuXHJcbiAgICAvLyBJZiB0aGUgdXNlciBjaGFuZ2VzIHRoZSBzb3J0IG9yIHRoZSBmaWx0ZXIsIHJlc2V0IGJhY2sgdG8gdGhlIGZpcnN0IHBhZ2UuXHJcbiAgICBtZXJnZSh0aGlzLnNvcnQuc29ydENoYW5nZSwgdGhpcy5maWx0ZXJDaGFuZ2VkKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5wYWdpbmF0b3IucGFnZUluZGV4ID0gMCk7XHJcblxyXG4gICAgdGhpcy5kYXRhU291cmNlLnNhdmVFcnJvci5waXBlKHNraXAoMSkpLnN1YnNjcmliZSgoZXJyb3IpID0+IHtcclxuICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKGVycm9yLCBudWxsLCB7XHJcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXHJcbiAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgIHZlcnRpY2FsUG9zaXRpb246ICdib3R0b20nXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGVzZWxlY3RzIHJvd3MgaWYgdGhleSBhcmUgbm90IGluIHRoZSBjdXJyZW50IGZpbHRlciBvciBwYWdlXHJcbiAgICB0aGlzLnJlbmRlcmVkUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZFJvd3NPYnNlcnZhYmxlLnN1YnNjcmliZSgocmVuZGVyZWRSb3dzKSA9PiB7XHJcbiAgICAgIGZvciAoY29uc3Qgc2VsZWN0ZWQgb2YgdGhpcy5zZWxlY3Rpb24uc2VsZWN0ZWQpIHtcclxuICAgICAgICBpZiAocmVuZGVyZWRSb3dzLmluZGV4T2Yoc2VsZWN0ZWQpID09PSAtMSkge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24uZGVzZWxlY3Qoc2VsZWN0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMucmVuZGVyZWRSb3dzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgfVxyXG5cclxuICBjZWxsQ2hhbmdlKGNvbHVtbjogc3RyaW5nLCByb3c6IFQsIG5ld1ZhbHVlOiBhbnksIHJvd0luZGV4OiBudW1iZXIpIHtcclxuICAgIHJvd1tjb2x1bW5dID0gbmV3VmFsdWU7XHJcblxyXG4gICAgdGhpcy5jZWxsQ2hhbmdlZC5lbWl0KHtjb2x1bW46IGNvbHVtbiwgdmFsdWVzOiByb3csIHJvd0luZGV4OiByb3dJbmRleH0pO1xyXG4gIH1cclxuXHJcbiAgZmlsdGVyQ2hhbmdlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZmlsdGVyID0gbmV3VmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7IC8vIFJlbW92ZSB3aGl0ZXNwYWNlOyBNYXRUYWJsZURhdGFTb3VyY2UgZGVmYXVsdHMgdG8gbG93ZXJjYXNlIG1hdGNoZXNcclxuICAgIHRoaXMuZmlsdGVyQ2hhbmdlZC5lbWl0KHRoaXMuZmlsdGVyKTtcclxuICB9XHJcblxyXG4gIC8qKiBTZWxlY3RzIGFsbCByb3dzIGlmIHRoZXkgYXJlIG5vdCBhbGwgc2VsZWN0ZWQ7IG90aGVyd2lzZSBjbGVhciBzZWxlY3Rpb24uICovXHJcbiAgbWFzdGVyVG9nZ2xlKCkge1xyXG4gICAgaWYgKHRoaXMuaXNBbGxTZWxlY3RlZCgpKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmNsZWFyKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3QoLi4udGhpcy5kYXRhU291cmNlLnJlbmRlcmVkUm93cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogV2hldGhlciB0aGUgbnVtYmVyIG9mIHNlbGVjdGVkIGVsZW1lbnRzIG1hdGNoZXMgdGhlIHRvdGFsIG51bWJlciBvZiByb3dzIGRpc3BsYXllZC4gKi9cclxuICBpc0FsbFNlbGVjdGVkKCkge1xyXG4gICAgY29uc3QgbnVtU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGg7XHJcbiAgICBjb25zdCBudW1Sb3dzID0gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkUm93cy5sZW5ndGg7XHJcbiAgICByZXR1cm4gbnVtU2VsZWN0ZWQgPT09IG51bVJvd3M7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbHVtbiB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgd2lkdGg/OiBzdHJpbmc7XHJcbiAgZWRpdGFibGU/OiBib29sZWFuO1xyXG4gIG1heExlbmd0aD86IG51bWJlcjtcclxuICB2YWx1ZXM/OiAoc3RyaW5nIHwgbnVtYmVyKVtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEJ1dHRvbjxUPiB7XHJcbiAgaWNvbjogc3RyaW5nO1xyXG4gIGFjdGlvbjogKHNlbGVjdGVkOiBUW10pID0+IHZvaWQ7XHJcbiAgc2VsZWN0aW9uUmVxdWlyZWQ6IGJvb2xlYW47XHJcbiAgbXVsdGlTZWxlY3Rpb246IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5pbXBvcnQge1xyXG4gIE1hdENhcmRNb2R1bGUsIE1hdENoZWNrYm94TW9kdWxlLCBNYXRGb3JtRmllbGRNb2R1bGUsIE1hdElucHV0TW9kdWxlLCBNYXRUYWJsZU1vZHVsZSwgTWF0RGF0ZXBpY2tlck1vZHVsZSxcclxuICBNYXROYXRpdmVEYXRlTW9kdWxlLCBNYXRTZWxlY3RNb2R1bGUsIE1hdEljb25Nb2R1bGUsIE1hdE1lbnVNb2R1bGUsIE1hdFBhZ2luYXRvck1vZHVsZSwgTWF0U29ydE1vZHVsZSwgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUsXHJcbiAgTWF0U25hY2tCYXJNb2R1bGUsIE1hdEJ1dHRvbk1vZHVsZVxyXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcclxuXHJcbmltcG9ydCB7IERhdGFUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9kYXRhLXRhYmxlL2RhdGEtdGFibGUuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgTWF0VGFibGVNb2R1bGUsXHJcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXHJcbiAgICBNYXRJbnB1dE1vZHVsZSxcclxuICAgIE1hdENoZWNrYm94TW9kdWxlLFxyXG4gICAgTWF0TmF0aXZlRGF0ZU1vZHVsZSxcclxuICAgIE1hdERhdGVwaWNrZXJNb2R1bGUsXHJcbiAgICBNYXRTZWxlY3RNb2R1bGUsXHJcbiAgICBNYXRJY29uTW9kdWxlLFxyXG4gICAgTWF0TWVudU1vZHVsZSxcclxuICAgIE1hdFBhZ2luYXRvck1vZHVsZSxcclxuICAgIE1hdFNvcnRNb2R1bGUsXHJcbiAgICBNYXRQcm9ncmVzc0Jhck1vZHVsZSxcclxuICAgIE1hdFNuYWNrQmFyTW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgRGF0YVRhYmxlQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBEYXRhVGFibGVDb21wb25lbnRcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG5cclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVNb2R1bGUge1xyXG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogRGF0YVRhYmxlTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb2xsZWN0aW9uVmlld2VyLCBEYXRhU291cmNlfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xyXG5pbXBvcnQge09ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCwgbWVyZ2V9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge01hdFBhZ2luYXRvciwgTWF0U29ydH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xyXG5pbXBvcnQge3RhcCwgZGVib3VuY2VUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5leHBvcnQgdHlwZSBGZXRjaEZ1bmN0aW9uPFQ+ID0gKFxyXG4gIGZpbHRlcjogc3RyaW5nLFxyXG4gIHNvcnRDb2x1bW46IHN0cmluZyxcclxuICBzb3J0RGlyZWN0aW9uOiBzdHJpbmcsXHJcbiAgb2Zmc2V0OiBudW1iZXIsXHJcbiAgZmV0Y2hTaXplOiBudW1iZXJcclxuKSA9PiBQcm9taXNlPHtcclxuICBjb3VudDogbnVtYmVyLFxyXG4gIGl0ZW1zOiBUW11cclxufT47XHJcblxyXG5leHBvcnQgdHlwZSBDaGFuZ2VGdW5jdGlvbjxUPiA9IChcclxuICBjb2x1bW46IHN0cmluZyxcclxuICB2YWx1ZXM6IFRcclxuKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzeW5jRGF0YVNvdXJjZTxUPiBpbXBsZW1lbnRzIERhdGFTb3VyY2U8VD4ge1xyXG5cclxuICBwcml2YXRlIHBhZ2luYXRvcjogTWF0UGFnaW5hdG9yO1xyXG4gIHByaXZhdGUgc29ydDogTWF0U29ydDtcclxuICBwcml2YXRlIGZpbHRlciA9ICcnO1xyXG5cclxuICBwcml2YXRlIHJlbmRlcmVkUm93c1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFRbXT4oW10pO1xyXG4gIHByaXZhdGUgbG9hZGluZ1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcclxuICBwcml2YXRlIGJ1ZmZlcmluZ1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcclxuICBwcml2YXRlIHNhdmVFcnJvclN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KCcnKTtcclxuXHJcbiAgcHJpdmF0ZSByb3dzID0gbmV3IE1hcDxzdHJpbmcsIFQ+KCk7XHJcbiAgcHJpdmF0ZSByb3dzVmlld3MgPSBuZXcgTWFwPHN0cmluZywgVFtdPigpO1xyXG4gIHByaXZhdGUgY3VycmVudFZpZXc6IFRbXTtcclxuICBwcml2YXRlIGN1cnJlbnRPZmZzZXQ6IG51bWJlcjtcclxuXHJcbiAgcHJpdmF0ZSBzYXZpbmdSb3dzID0gbmV3IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDxib29sZWFuPj4+KCk7XHJcbiAgcHJpdmF0ZSBzYXZpbmdSb3dzVmlld3MgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+PltdPigpO1xyXG4gIHByaXZhdGUgY3VycmVudFNhdmluZ1Jvd3NWaWV3OiBNYXA8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4+W107XHJcblxyXG4gIHB1YmxpYyByZW5kZXJlZFNhdmluZ1Jvd3M6IE1hcDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDxib29sZWFuPj5bXTtcclxuXHJcbiAgcHVibGljIHJlYWRvbmx5IGxvYWRpbmcgPSB0aGlzLmxvYWRpbmdTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIHB1YmxpYyByZWFkb25seSBidWZmZXJpbmcgPSB0aGlzLmJ1ZmZlcmluZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgcHVibGljIHJlYWRvbmx5IHNhdmVFcnJvciA9IHRoaXMuc2F2ZUVycm9yU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICBwdWJsaWMgZ2V0IHJlbmRlcmVkUm93cygpIHtcclxuICAgIHJldHVybiB0aGlzLnJlbmRlcmVkUm93c1N1YmplY3QudmFsdWU7XHJcbiAgfVxyXG4gIHB1YmxpYyByZWFkb25seSByZW5kZXJlZFJvd3NPYnNlcnZhYmxlID0gdGhpcy5yZW5kZXJlZFJvd3NTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVuaXF1ZUtleSwgcHJpdmF0ZSBmZXRjaERhdGE6IEZldGNoRnVuY3Rpb248VD4sIHByaXZhdGUgY2hhbmdlRGF0YTogQ2hhbmdlRnVuY3Rpb248VD4sIHByaXZhdGUgZGVib3VuY2UgPSAzMDApIHt9XHJcblxyXG4gIGNvbm5lY3QoY29sbGVjdGlvblZpZXdlcjogQ29sbGVjdGlvblZpZXdlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlZFJvd3NTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgZGlzY29ubmVjdChjb2xsZWN0aW9uVmlld2VyOiBDb2xsZWN0aW9uVmlld2VyKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlbmRlcmVkUm93c1N1YmplY3QuY29tcGxldGUoKTtcclxuICAgIHRoaXMubG9hZGluZ1N1YmplY3QuY29tcGxldGUoKTtcclxuICAgIHRoaXMuYnVmZmVyaW5nU3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgdGhpcy5zYXZlRXJyb3JTdWJqZWN0LmNvbXBsZXRlKCk7XHJcblxyXG4gICAgLypmb3IgKGNvbnN0IHNhdmluZ1JvdyBvZiB0aGlzLnNhdmluZ0NlbGxzKSB7XHJcbiAgICAgIGZvciAoY29uc3Qgc2F2aW5nU3ViamVjdCBvZiBBcnJheS5mcm9tKHNhdmluZ1Jvdy52YWx1ZXMoKSkpIHtcclxuICAgICAgICBzYXZpbmdTdWJqZWN0LmNvbXBsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0qL1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldHVwKFxyXG4gICAgcGFnaW5hdG9yOiBNYXRQYWdpbmF0b3IsXHJcbiAgICBzb3J0OiBNYXRTb3J0LFxyXG4gICAgZmlsdGVyRXZlbnQ6IEV2ZW50RW1pdHRlcjxzdHJpbmc+LFxyXG4gICAgZWRpdGVkRXZlbnQ6IEV2ZW50RW1pdHRlcjx7Y29sdW1uOiBzdHJpbmcsIHZhbHVlczogVCwgcm93SW5kZXg6IG51bWJlcn0+XHJcbiAgKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhZ2luYXRvciA9IHBhZ2luYXRvcjtcclxuICAgIHRoaXMuc29ydCA9IHNvcnQ7XHJcblxyXG4gICAgbWVyZ2UoXHJcbiAgICAgIGZpbHRlckV2ZW50LFxyXG4gICAgICB0aGlzLnNvcnQuc29ydENoYW5nZSxcclxuICAgICAgdGhpcy5wYWdpbmF0b3IucGFnZVxyXG4gICAgKS5waXBlKFxyXG4gICAgICB0YXAoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHsgLy8gSWYgdGhlIHZhbHVlIGlzIG9mIHR5cGUgc3RyaW5nIGl0IG11c3QgYmUgdGhlIGZpbHRlclxyXG4gICAgICAgICAgdGhpcy5maWx0ZXIgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYnVmZmVyaW5nU3ViamVjdC5uZXh0KHRydWUpO1xyXG4gICAgICB9KSxcclxuICAgICAgZGVib3VuY2VUaW1lKHRoaXMuZGVib3VuY2UpLFxyXG4gICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuYnVmZmVyaW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcclxuICAgICAgfSksXHJcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKChvbGRWYWx1ZTogYW55LCBuZXdWYWx1ZTogYW55KSA9PiB7IC8vIElnbm9yZSBhbGwgZXZlbnRzIHVudGlsIHRoZSB2YWx1ZSB3YXMgYWN0dWFsbHkgY2hhbmdlZFxyXG4gICAgICAgIGlmIChvbGRWYWx1ZS5wYWdlSW5kZXggIT09IHVuZGVmaW5lZCkgeyAvLyBIYW5kbGUgcGFnaW5hdG9yIGV2ZW50c1xyXG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLnBhZ2VJbmRleCA9PT0gbmV3VmFsdWUucGFnZUluZGV4ICYmIG9sZFZhbHVlLnBhZ2VTaXplID09PSBuZXdWYWx1ZS5wYWdlU2l6ZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChvbGRWYWx1ZS5kaXJlY3Rpb24gIT09IHVuZGVmaW5lZCkgeyAvLyBIYW5kbGUgc29ydCBldmVudHNcclxuICAgICAgICAgIHJldHVybiBvbGRWYWx1ZS5hY3RpdmUgPT09IG5ld1ZhbHVlLmFjdGl2ZSAmJiBvbGRWYWx1ZS5kaXJlY3Rpb24gPT09IG5ld1ZhbHVlLmRpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgfSBlbHNlIHsgLy8gSGFuZGxlIGZpbHRlciBldmVudHNcclxuICAgICAgICAgIHJldHVybiBvbGRWYWx1ZSA9PT0gbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAvLyBub2luc3BlY3Rpb24gSlNJZ25vcmVkUHJvbWlzZUZyb21DYWxsXHJcbiAgICAgIHRoaXMudXBkYXRlQ3VycmVudFZpZXcoKTtcclxuICAgIH0pO1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7IC8vIFRoaXMgc2tpcHMgb25lIHRpY2suIFRoaXMgaXMgbmVlZGVkIGZvciB0aGUgcGFnaW5hdG9yIGFuZCBzb3J0ZXIgdG8gd29yayBjb3JyZWN0bHlcclxuICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTSWdub3JlZFByb21pc2VGcm9tQ2FsbFxyXG4gICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRWaWV3KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBlZGl0ZWRFdmVudC5waXBlKFxyXG4gICAgICBkZWJvdW5jZVRpbWUodGhpcy5kZWJvdW5jZSlcclxuICAgICkuc3Vic2NyaWJlKGFzeW5jIChldmVudCkgPT4ge1xyXG4gICAgICBjb25zdCByZW5kZXJlZFNhdmluZ1JvdyA9IHRoaXMucmVuZGVyZWRTYXZpbmdSb3dzW2V2ZW50LnJvd0luZGV4XTtcclxuICAgICAgcmVuZGVyZWRTYXZpbmdSb3cuZ2V0KGV2ZW50LmNvbHVtbikubmV4dCh0cnVlKTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5jaGFuZ2VEYXRhKGV2ZW50LmNvbHVtbiwgZXZlbnQudmFsdWVzKTtcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLnNhdmVFcnJvclN1YmplY3QubmV4dChlcnJvcik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgcmVuZGVyZWRTYXZpbmdSb3cuZ2V0KGV2ZW50LmNvbHVtbikubmV4dChmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVDdXJyZW50VmlldygpIHtcclxuICAgIHRoaXMuY3VycmVudE9mZnNldCA9IHRoaXMucGFnaW5hdG9yLnBhZ2VJbmRleCAqIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplO1xyXG5cclxuICAgIHRoaXMubG9hZGluZ1N1YmplY3QubmV4dCh0cnVlKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZmV0Y2hEYXRhKFxyXG4gICAgICB0aGlzLmZpbHRlcixcclxuICAgICAgdGhpcy5zb3J0LmFjdGl2ZSxcclxuICAgICAgdGhpcy5zb3J0LmRpcmVjdGlvbixcclxuICAgICAgdGhpcy5jdXJyZW50T2Zmc2V0LFxyXG4gICAgICB0aGlzLnBhZ2luYXRvci5wYWdlU2l6ZVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLnBhZ2luYXRvci5sZW5ndGggPSByZXN1bHQuY291bnQ7XHJcblxyXG4gICAgY29uc3Qgdmlld0tleSA9IGAke3RoaXMuZmlsdGVyfTske3RoaXMuc29ydC5hY3RpdmV9OyR7dGhpcy5zb3J0LmRpcmVjdGlvbn1gO1xyXG4gICAgaWYgKHRoaXMucm93c1ZpZXdzLmhhcyh2aWV3S2V5KSA9PT0gZmFsc2UpIHtcclxuICAgICAgdGhpcy5yb3dzVmlld3Muc2V0KHZpZXdLZXksIFtdKTtcclxuICAgICAgdGhpcy5zYXZpbmdSb3dzVmlld3Muc2V0KHZpZXdLZXksIFtdKTtcclxuICAgIH1cclxuICAgIHRoaXMuY3VycmVudFZpZXcgPSB0aGlzLnJvd3NWaWV3cy5nZXQodmlld0tleSk7XHJcbiAgICB0aGlzLmN1cnJlbnRTYXZpbmdSb3dzVmlldyA9IHRoaXMuc2F2aW5nUm93c1ZpZXdzLmdldCh2aWV3S2V5KTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcmVzdWx0Lml0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHJvdyA9IHJlc3VsdC5pdGVtc1tpXTtcclxuICAgICAgY29uc3QgdW5pcXVlVmFsdWUgPSByb3dbdGhpcy51bmlxdWVLZXldO1xyXG5cclxuICAgICAgLy8gVGhpcyBpcyBoZXJlLCBzbyB0aGF0IHRoZSByb3dzVmlld3MgZG9uJ3QgbG9zZSB0aGVpciByZWZlcmVuY2VzIHRvIHRoZSBvcmlnaW5hbCByb3dcclxuICAgICAgaWYgKCF0aGlzLnJvd3MuaGFzKHVuaXF1ZVZhbHVlKSkge1xyXG4gICAgICAgIHRoaXMucm93cy5zZXQodW5pcXVlVmFsdWUsIHJvdyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb2x1bW4gaW4gcm93KSB7XHJcbiAgICAgICAgICBpZiAoIXJvdy5oYXNPd25Qcm9wZXJ0eShjb2x1bW4pKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMucm93cy5nZXQodW5pcXVlVmFsdWUpW2NvbHVtbl0gPSByb3dbY29sdW1uXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5zYXZpbmdSb3dzLmhhcyh1bmlxdWVWYWx1ZSkpIHtcclxuICAgICAgICBjb25zdCBjb2x1bW5zID0gbmV3IE1hcDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDxib29sZWFuPj4oKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbHVtbiBpbiByb3cpIHtcclxuICAgICAgICAgIGlmICghcm93Lmhhc093blByb3BlcnR5KGNvbHVtbikpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29sdW1ucy5zZXQoY29sdW1uLCBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2F2aW5nUm93cy5zZXQodW5pcXVlVmFsdWUsIGNvbHVtbnMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmN1cnJlbnRWaWV3W3RoaXMuY3VycmVudE9mZnNldCArIGldID0gdGhpcy5yb3dzLmdldCh1bmlxdWVWYWx1ZSk7XHJcbiAgICAgIHRoaXMuY3VycmVudFNhdmluZ1Jvd3NWaWV3W3RoaXMuY3VycmVudE9mZnNldCArIGldID0gdGhpcy5zYXZpbmdSb3dzLmdldCh1bmlxdWVWYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVSZW5kZXJlZFJvd3MoKTtcclxuXHJcbiAgICB0aGlzLmxvYWRpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVSZW5kZXJlZFJvd3MoKSB7XHJcbiAgICB0aGlzLnJlbmRlcmVkU2F2aW5nUm93cyA9IHRoaXMuY3VycmVudFNhdmluZ1Jvd3NWaWV3LnNsaWNlKFxyXG4gICAgICB0aGlzLmN1cnJlbnRPZmZzZXQsXHJcbiAgICAgIHRoaXMuY3VycmVudE9mZnNldCArIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMucmVuZGVyZWRSb3dzU3ViamVjdC5uZXh0KFxyXG4gICAgICB0aGlzLmN1cnJlbnRWaWV3LnNsaWNlKFxyXG4gICAgICAgIHRoaXMuY3VycmVudE9mZnNldCxcclxuICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgKyB0aGlzLnBhZ2luYXRvci5wYWdlU2l6ZVxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn1cclxuIl0sIm5hbWVzIjpbIlNlbGVjdGlvbk1vZGVsIiwiRXZlbnRFbWl0dGVyIiwidHNsaWJfMS5fX3ZhbHVlcyIsIm1lcmdlIiwic2tpcCIsIkNvbXBvbmVudCIsIk1hdFNuYWNrQmFyIiwiSW5wdXQiLCJWaWV3Q2hpbGQiLCJNYXRQYWdpbmF0b3IiLCJNYXRTb3J0IiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJNYXRUYWJsZU1vZHVsZSIsIk1hdEZvcm1GaWVsZE1vZHVsZSIsIk1hdElucHV0TW9kdWxlIiwiTWF0Q2hlY2tib3hNb2R1bGUiLCJNYXROYXRpdmVEYXRlTW9kdWxlIiwiTWF0RGF0ZXBpY2tlck1vZHVsZSIsIk1hdFNlbGVjdE1vZHVsZSIsIk1hdEljb25Nb2R1bGUiLCJNYXRNZW51TW9kdWxlIiwiTWF0UGFnaW5hdG9yTW9kdWxlIiwiTWF0U29ydE1vZHVsZSIsIk1hdFByb2dyZXNzQmFyTW9kdWxlIiwiTWF0U25hY2tCYXJNb2R1bGUiLCJNYXRCdXR0b25Nb2R1bGUiLCJGb3Jtc01vZHVsZSIsIkJlaGF2aW9yU3ViamVjdCIsInRhcCIsImRlYm91bmNlVGltZSIsImRpc3RpbmN0VW50aWxDaGFuZ2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztRQTRJRSw0QkFBb0IsUUFBcUI7WUFBckIsYUFBUSxHQUFSLFFBQVEsQ0FBYTttQ0FuQkosQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQzs0QkFDNUIsQ0FBQztvQ0FRRixDQUFDLFFBQVEsQ0FBQzs2QkFDakIsSUFBSUEsMEJBQWMsQ0FBSSxJQUFJLEVBQUUsRUFBRSxDQUFDO2lDQUduQixJQUFJQyxpQkFBWSxFQUFVOytCQUU1QixJQUFJQSxpQkFBWSxFQUFpRDtTQU10Rjs7OztRQUVELHFDQUFROzs7WUFBUjtnQkFBQSxpQkEwQkM7O29CQXpCQyxLQUFxQixJQUFBLEtBQUFDLGlCQUFBLElBQUksQ0FBQyxPQUFPLENBQUEsZ0JBQUE7d0JBQTVCLElBQU0sTUFBTSxXQUFBO3dCQUNmLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN6Qzs7Ozs7Ozs7Ozs7Ozs7O2dCQUVELElB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