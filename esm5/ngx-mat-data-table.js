import { __values, __spread } from 'tslib';
import 'rxjs/BehaviorSubject';
import { merge } from 'rxjs/observable/merge';
import 'rxjs/operators';
import 'rxjs/operators/debounceTime';
import 'rxjs/operators/distinctUntilChanged';
import { Component, EventEmitter, Input, ViewChild, NgModule } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatIconModule, MatMenuModule, MatPaginatorModule, MatSortModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import 'rxjs/add/operator/skip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

var DataTableComponent = /** @class */ (function () {
    function DataTableComponent(snackBar) {
        this.snackBar = snackBar;
        this.displayedColumns = ['select'];
        this.selection = new SelectionModel(true, []);
        this.filterChanged = new EventEmitter();
        this.cellChanged = new EventEmitter();
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
        merge(this.sort.sortChange, this.filterChanged).subscribe(function () { return _this.paginator.pageIndex = 0; });
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
    { type: Component, args: [{
                selector: 'ngx-mat-data-table',
                template: "<mat-card>\n  <mat-card-header>\n    <mat-card-title>{{title}}</mat-card-title>\n    <mat-card-subtitle>\n      <mat-form-field>\n        <input [ngModel]=\"filter\" (ngModelChange)=\"filterChange($event)\" matInput placeholder=\"Filter\">\n      </mat-form-field>\n    </mat-card-subtitle>\n  </mat-card-header>\n  <mat-card-content>\n    <mat-progress-bar [class.show]=\"(dataSource.loading | async) || (dataSource.buffering | async)\" [mode]=\"(dataSource.buffering | async) ? 'buffer' : 'indeterminate'\"></mat-progress-bar>\n    <mat-table #table [dataSource]=\"dataSource\"\n               matSort [matSortActive]=\"sortColumn\" matSortDisableClear matSortDirection=\"asc\">\n      <!-- Checkbox Column -->\n      <ng-container matColumnDef=\"select\">\n        <mat-header-cell *matHeaderCellDef>\n          <mat-checkbox (change)=\"$event ? masterToggle() : null\"\n                        [checked]=\"selection.hasValue() && isAllSelected()\"\n                        [indeterminate]=\"selection.hasValue() && !isAllSelected()\">\n          </mat-checkbox>\n        </mat-header-cell>\n        <mat-cell *matCellDef=\"let row\">\n          <mat-checkbox (click)=\"$event.stopPropagation()\"\n                        (change)=\"$event ? selection.toggle(row) : null\"\n                        [checked]=\"selection.isSelected(row)\">\n          </mat-checkbox>\n        </mat-cell>\n      </ng-container>\n      <ng-container *ngFor=\"let column of columns\" [matColumnDef]=\"column.name\">\n        <mat-header-cell mat-sort-header *matHeaderCellDef [style.max-width]=\"(column.width + 24) + 'px'\">{{column.label}}</mat-header-cell>\n        <mat-cell *matCellDef=\"let row; let rowIndex = index\" [style.max-width]=\"(column.width + 24) + 'px'\">\n          <ng-container *ngIf=\"!column.editable; else editable\">\n            <ng-container *ngIf=\"row[column.name].constructor.name !== 'Date'; else date\">\n              {{row[column.name]}}\n            </ng-container>\n            <ng-template #date>\n              {{row[column.name] | date:'short'}}\n            </ng-template>\n          </ng-container>\n          <ng-template #editable>\n            <mat-progress-bar [class.show]=\"dataSource.renderedSavingRows[rowIndex].get(column.name) | async\" mode=\"indeterminate\"></mat-progress-bar>\n            <ng-container *ngIf=\"column.values; else elseIf\">\n              <mat-form-field [style.max-width]=\"column.width + 'px'\">\n                <mat-select [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                  <mat-option *ngFor=\"let value of column.values\" [value]=\"value\">\n                    {{ value }}\n                  </mat-option>\n                </mat-select>\n              </mat-form-field>\n            </ng-container>\n            <ng-template #elseIf>\n              <ng-container *ngIf=\"row[column.name].constructor.name !== 'Date'; else datepicker\">\n                <div class=\"edit-button\" [matMenuTriggerFor]=\"menu\">\n                  {{row[column.name]}}\n                  <mat-icon>edit_mode</mat-icon>\n                </div>\n                <mat-menu #menu=\"matMenu\">\n                  <div mat-menu-item disabled class=\"full-height-menu-item\">\n                    <mat-form-field class=\"mat-cell\" [style.max-width]=\"column.width + 'px'\"> <!-- mat-cell is a hack to override the disabled state of mat-menu-item -->\n                      <input matInput #message [attr.maxlength]=\"column.maxLength\" [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                      <mat-hint align=\"end\">{{message.value.length}} / {{column.maxLength}}</mat-hint>\n                    </mat-form-field>\n                  </div>\n                </mat-menu>\n              </ng-container>\n              <ng-template #datepicker>\n                <mat-form-field [style.max-width]=\"column.width + 'px'\">\n                  <input matInput [matDatepicker]=\"picker\" [ngModel]=\"row[column.name]\" (ngModelChange)=\"cellChange(column.name, row, $event, rowIndex)\">\n                  <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n                  <mat-datepicker #picker></mat-datepicker>\n                </mat-form-field>\n              </ng-template>\n            </ng-template>\n          </ng-template>\n        </mat-cell>\n      </ng-container>\n      <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n      <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n    </mat-table>\n    <mat-paginator [pageSize]=\"5\"\n                   [pageSizeOptions]=\"[5, 10, 20]\"\n                   [showFirstLastButtons]=\"true\">\n    </mat-paginator>\n  </mat-card-content>\n</mat-card>\n",
                styles: [":host{display:block}:host ::ng-deep .mat-card{padding:0}:host ::ng-deep .mat-card .mat-card-header{padding-left:24px;padding-right:24px;padding-top:24px}:host ::ng-deep .mat-cell .mat-input-underline{visibility:hidden}:host .mat-progress-bar{opacity:0}:host .mat-progress-bar.show{opacity:1}:host .mat-column-select{max-width:44px;overflow:visible}:host .mat-cell .edit-button{cursor:pointer;line-height:24px;margin-right:24px;padding-top:1.16em;padding-bottom:1.18em}:host .mat-cell .edit-button .mat-icon{float:right}.full-height-menu-item{height:auto;line-height:initial}"]
            },] },
];
DataTableComponent.ctorParameters = function () { return [
    { type: MatSnackBar, },
]; };
DataTableComponent.propDecorators = {
    "title": [{ type: Input },],
    "columns": [{ type: Input },],
    "sortColumn": [{ type: Input },],
    "uniqueColumn": [{ type: Input },],
    "dataSource": [{ type: Input },],
    "paginator": [{ type: ViewChild, args: [MatPaginator,] },],
    "sort": [{ type: ViewChild, args: [MatSort,] },],
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
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MatTableModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatCardModule,
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
DataTableModule.ctorParameters = function () { return []; };

export { DataTableModule, DataTableComponent as ɵa };
//# sourceMappingURL=ngx-mat-data-table.js.map
