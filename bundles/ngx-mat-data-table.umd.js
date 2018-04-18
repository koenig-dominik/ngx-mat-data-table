(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/BehaviorSubject'), require('rxjs/observable/merge'), require('rxjs/operators'), require('rxjs/operators/debounceTime'), require('rxjs/operators/distinctUntilChanged'), require('@angular/core'), require('@angular/material'), require('@angular/cdk/collections'), require('rxjs/add/operator/skip'), require('@angular/common'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', 'rxjs/BehaviorSubject', 'rxjs/observable/merge', 'rxjs/operators', 'rxjs/operators/debounceTime', 'rxjs/operators/distinctUntilChanged', '@angular/core', '@angular/material', '@angular/cdk/collections', 'rxjs/add/operator/skip', '@angular/common', '@angular/forms'], factory) :
	(factory((global['ngx-mat-data-table'] = {}),global.Rx,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.ng.core,global.ng.material,global.ng.cdk.collections,global.Rx.Observable.prototype,global.ng.common,global.ng.forms));
}(this, (function (exports,BehaviorSubject,merge,operators,debounceTime,distinctUntilChanged,core,material,collections,skip,common,forms) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */






function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var AsyncDataSource = /** @class */ (function () {
    function AsyncDataSource(uniqueKey, fetchData, changeData, debounce) {
        if (debounce === void 0) { debounce = 300; }
        this.uniqueKey = uniqueKey;
        this.fetchData = fetchData;
        this.changeData = changeData;
        this.debounce = debounce;
        this.filter = '';
        this.renderedRowsSubject = new BehaviorSubject.BehaviorSubject([]);
        this.loadingSubject = new BehaviorSubject.BehaviorSubject(false);
        this.bufferingSubject = new BehaviorSubject.BehaviorSubject(false);
        this.saveErrorSubject = new BehaviorSubject.BehaviorSubject('');
        this.rows = new Map();
        this.rowsViews = new Map();
        this.savingRows = new Map();
        this.savingRowsViews = new Map();
        this.loading = this.loadingSubject.asObservable();
        this.buffering = this.bufferingSubject.asObservable();
        this.saveError = this.saveErrorSubject.asObservable();
    }
    Object.defineProperty(AsyncDataSource.prototype, "renderedRows", {
        get: function () {
            return this.renderedRowsSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    AsyncDataSource.prototype.connect = function (collectionViewer) {
        return this.renderedRowsSubject.asObservable();
    };
    AsyncDataSource.prototype.disconnect = function (collectionViewer) {
        this.renderedRowsSubject.complete();
        this.loadingSubject.complete();
        this.bufferingSubject.complete();
        this.saveErrorSubject.complete();
    };
    AsyncDataSource.prototype.setup = function (paginator, sort, filterEvent, editedEvent) {
        var _this = this;
        this.paginator = paginator;
        this.sort = sort;
        merge.merge(filterEvent, this.sort.sortChange, this.paginator.page).pipe(operators.tap(function (value) {
            if (typeof value === 'string') {
                _this.filter = value;
            }
            _this.bufferingSubject.next(true);
        }), debounceTime.debounceTime(this.debounce), operators.tap(function () {
            _this.bufferingSubject.next(false);
        }), distinctUntilChanged.distinctUntilChanged(function (oldValue, newValue) {
            if (oldValue.pageIndex !== undefined) {
                return oldValue.pageIndex === newValue.pageIndex && oldValue.pageSize === newValue.pageSize;
            }
            else if (oldValue.direction !== undefined) {
                return oldValue.active === newValue.active && oldValue.direction === newValue.direction;
            }
            else {
                return oldValue === newValue;
            }
        })).subscribe(function () {
            _this.updateCurrentView();
        });
        Promise.resolve().then(function () {
            _this.updateCurrentView();
        });
        editedEvent.pipe(debounceTime.debounceTime(this.debounce)).subscribe(function (event) { return __awaiter(_this, void 0, void 0, function () {
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
    AsyncDataSource.prototype.updateCurrentView = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, viewKey, i, length, row, uniqueValue, column, columns, column;
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
                        for (i = 0, length = result.items.length; i < length; i++) {
                            row = result.items[i];
                            uniqueValue = row[this.uniqueKey];
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
                                    columns.set(column, new BehaviorSubject.BehaviorSubject(false));
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
    AsyncDataSource.prototype.updateRenderedRows = function () {
        this.renderedSavingRows = this.currentSavingRowsView.slice(this.currentOffset, this.currentOffset + this.paginator.pageSize);
        this.renderedRowsSubject.next(this.currentView.slice(this.currentOffset, this.currentOffset + this.paginator.pageSize));
    };
    return AsyncDataSource;
}());
var DataTableComponent = /** @class */ (function () {
    function DataTableComponent(snackBar) {
        this.snackBar = snackBar;
        this.displayedColumns = ['select'];
        this.selection = new collections.SelectionModel(true, []);
        this.filterChanged = new core.EventEmitter();
        this.cellChanged = new core.EventEmitter();
    }
    DataTableComponent.prototype.ngOnInit = function () {
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
        merge.merge(this.sort.sortChange, this.filterChanged).subscribe(function () { return _this.paginator.pageIndex = 0; });
        this.dataSource.saveError.skip(1).subscribe(function (error) {
            _this.snackBar.open(error, null, {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom'
            });
        });
        var e_1, _c;
    };
    DataTableComponent.prototype.cellChange = function (column, row, newValue, rowIndex) {
        row[column] = newValue;
        this.cellChanged.emit({ column: column, values: row, rowIndex: rowIndex });
    };
    DataTableComponent.prototype.filterChange = function (newValue) {
        this.filter = newValue.trim().toLowerCase();
        this.filterChanged.emit(this.filter);
    };
    DataTableComponent.prototype.masterToggle = function () {
        if (this.isAllSelected()) {
            this.selection.clear();
        }
        else {
            (_a = this.selection).select.apply(_a, __spread(this.dataSource.renderedRows));
        }
        var _a;
    };
    DataTableComponent.prototype.isAllSelected = function () {
        var numSelected = this.selection.selected.length;
        var numRows = this.dataSource.renderedRows.length;
        return numSelected === numRows;
    };
    return DataTableComponent;
}());
DataTableComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ngx-mat-data-table',
                template: "<mat-card>\n  <mat-card-header>\n    <mat-card-title>{{title}}</mat-card-title>\n    <mat-card-subtitle>\n      <mat-form-field>\n        <input [ngModel]=\"filter\" (ngModelChange)=\"filterChange($event)\" matInput placeholder=\"Filter\">\n      </mat-form-field>\n    </mat-card-subtitle>\n  </mat-card-header>\n  <mat-card-content>\n    <mat-progress-bar [class.show]=\"(dataSource.loading | async) || (dataSource.buffering | async)\" [mode]=\"(dataSource.buffering | async) ? 'buffer' : 'indeterminate'\"></mat-progress-bar>\n    <mat-table #table [dataSource]=\"dataSource\"\n               matSort [matSortActive]=\"sortColumn\" matSortDisableClear matSortDirection=\"asc\">\n      <!-- Checkbox Column -->\n      <ng-container matColumnDef=\"select\">\n        <mat-header-cell *matHeaderCellDef>\n          <mat-checkbox (change)=\"$event ? masterToggle() : null\"\n                        [checked]=\"selection.hasValue() && isAllSelected()\"\n                        [indeterminate]=\"selection.hasValue() && !isAllSelected()\">\n          </mat-checkbox>\n        </mat-header-cell>\n        <mat-cell *matCellDef=\"let row\">\n          <mat-checkbox (click)=\"$event.stopPropagation()\"\n                        (change)=\"$event ? selection.toggle(row) : null\"\n                        [checked]=\"selection.isSelected(row)\">\n          </mat-checkbox>\n        </mat-cell>\n      </ng-container>\n      <ng-container *ngFor=\"let column of columns\" [matColumnDef]=\"column.name\">\n        <mat-header-cell mat-sort-header *matHeaderCellDef [style.max-width]=\"(column.width + 24) + 'px'\">{{column.label}}</mat-header-cell>\n        <mat-cell *matCellDef=\"let row; let rowIndex = index\" [style.max-width]=\"(column.width + 24) + 'px'\">\n          <ng-container *ngIf=\"!column.editable; else editable\">\n            <ng-container *ngIf=\"row[column.name].constructor.name !== 'Date'; else date\">\n              {{row[column.name]}}\n            </ng-container>\n            <ng-template #date>\n              {{row[column.name] | date:'short'}}\n            </ng-template>\n          </ng-container>\n          <ng-template #editable>\n            <mat-progress-bar [class.show]=\"dataSource.renderedSavingRows[rowIndex].get(column.name) | async\" mode=\"indeterminate\"></mat-progress-bar>\n            <ng-container *ngIf=\"column.values; else elseIf\">\n              <mat-form-field [style.max-width]=\"column.width + 'px'\">\n                <mat-select [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                  <mat-option *ngFor=\"let value of column.values\" [value]=\"value\">\n                    {{ value }}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n            </ng-container>\n            <ng-template #elseIf>\n              <ng-container *ngIf=\"row[column.name].constructor.name !== 'Date'; else datepicker\">\n                <div class=\"edit-button\" [matMenuTriggerFor]=\"menu\">\n                  {{row[column.name]}}\n                  <mat-icon>edit_mode</mat-icon>\n                </div>\n                <mat-menu #menu=\"matMenu\">\n                  <div mat-menu-item disabled class=\"full-height-menu-item\">\n                    <mat-form-field class=\"mat-cell\" [style.max-width]=\"column.width + 'px'\"> <!-- mat-cell is a hack to override the disabled state of mat-menu-item -->\n                      <input matInput #message [attr.maxlength]=\"column.maxLength\" [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                      <mat-hint align=\"end\">{{message.value.length}} / {{column.maxLength}}</mat-hint>\n                    </mat-form-field>\n                  </div>\n                </mat-menu>\n              </ng-container>\n              <ng-template #datepicker>\n                <mat-form-field [style.max-width]=\"column.width + 'px'\">\n                  <input matInput [matDatepicker]=\"picker\" [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                  <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n                  <mat-datepicker #picker></mat-datepicker>\n                </mat-form-field>\n              </ng-template>\n            </ng-template>\n          </ng-template>\n        </mat-cell>\n      </ng-container>\n      <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n      <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n    </mat-table>\n    <mat-paginator [pageSize]=\"5\"\n                   [pageSizeOptions]=\"[5, 10, 20]\"\n                   [showFirstLastButtons]=\"true\">\n    </mat-paginator>\n  </mat-card-content>\n</mat-card>\n",
                styles: [":host{display:block}:host ::ng-deep .mat-card{padding:0}:host ::ng-deep .mat-card .mat-card-header{padding-left:24px;padding-right:24px;padding-top:24px}:host ::ng-deep .mat-cell .mat-input-underline{visibility:hidden}:host .mat-progress-bar{opacity:0}:host .mat-progress-bar.show{opacity:1}:host .mat-column-select{max-width:44px;overflow:visible}:host .mat-cell .edit-button{cursor:pointer;line-height:24px;margin-right:24px;padding-top:1.16em;padding-bottom:1.18em}:host .mat-cell .edit-button .mat-icon{float:right}.full-height-menu-item{height:auto;line-height:initial}"]
            },] },
];
DataTableComponent.ctorParameters = function () { return [
    { type: material.MatSnackBar, },
]; };
DataTableComponent.propDecorators = {
    "title": [{ type: core.Input },],
    "columns": [{ type: core.Input },],
    "sortColumn": [{ type: core.Input },],
    "uniqueColumn": [{ type: core.Input },],
    "dataSource": [{ type: core.Input },],
    "paginator": [{ type: core.ViewChild, args: [material.MatPaginator,] },],
    "sort": [{ type: core.ViewChild, args: [material.MatSort,] },],
};
var DataTableModule = /** @class */ (function () {
    function DataTableModule() {
    }
    DataTableModule.forRoot = function () {
        return {
            ngModule: DataTableModule,
            providers: []
        };
    };
    return DataTableModule;
}());
DataTableModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    material.MatTableModule,
                    material.MatFormFieldModule,
                    material.MatInputModule,
                    material.MatCardModule,
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
DataTableModule.ctorParameters = function () { return []; };

exports.DataTableModule = DataTableModule;
exports.AsyncDataSource = AsyncDataSource;
exports.ɵa = DataTableComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-mat-data-table.umd.js.map
