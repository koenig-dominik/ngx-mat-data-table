/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { merge } from 'rxjs';
import { skip } from 'rxjs/operators';
import { AsyncDataSource } from '../../async-data-source';
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
            for (var _a = tslib_1.__values(this.columns), _b = _a.next(); !_b.done; _b = _a.next()) {
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
                for (var _a = tslib_1.__values(_this.selection.selected), _b = _a.next(); !_b.done; _b = _a.next()) {
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
export { DataTableComponent };
function DataTableComponent_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    DataTableComponent.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    DataTableComponent.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    DataTableComponent.propDecorators;
    /** @type {?} */
    DataTableComponent.prototype.title;
    /** @type {?} */
    DataTableComponent.prototype.columns;
    /** @type {?} */
    DataTableComponent.prototype.sortColumn;
    /** @type {?} */
    DataTableComponent.prototype.pageSizeOptions;
    /** @type {?} */
    DataTableComponent.prototype.pageSize;
    /** @type {?} */
    DataTableComponent.prototype.buttons;
    /** @type {?} */
    DataTableComponent.prototype.dataSource;
    /** @type {?} */
    DataTableComponent.prototype.paginator;
    /** @type {?} */
    DataTableComponent.prototype.sort;
    /** @type {?} */
    DataTableComponent.prototype.displayedColumns;
    /** @type {?} */
    DataTableComponent.prototype.selection;
    /** @type {?} */
    DataTableComponent.prototype.filter;
    /** @type {?} */
    DataTableComponent.prototype.filterChanged;
    /** @type {?} */
    DataTableComponent.prototype.cellChanged;
    /** @type {?} */
    DataTableComponent.prototype.renderedRowsSubscription;
    /** @type {?} */
    DataTableComponent.prototype.snackBar;
}
/**
 * @record
 */
export function Column() { }
function Column_tsickle_Closure_declarations() {
    /** @type {?} */
    Column.prototype.name;
    /** @type {?} */
    Column.prototype.label;
    /** @type {?|undefined} */
    Column.prototype.width;
    /** @type {?|undefined} */
    Column.prototype.editable;
    /** @type {?|undefined} */
    Column.prototype.maxLength;
    /** @type {?|undefined} */
    Column.prototype.values;
}
/**
 * @record
 * @template T
 */
export function Button() { }
function Button_tsickle_Closure_declarations() {
    /** @type {?} */
    Button.prototype.icon;
    /** @type {?} */
    Button.prototype.action;
    /** @type {?} */
    Button.prototype.selectionRequired;
    /** @type {?} */
    Button.prototype.multiSelection;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtbWF0LWRhdGEtdGFibGUvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2RhdGEtdGFibGUvZGF0YS10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMzRixPQUFPLEVBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNyRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHlCQUF5QixDQUFDOzs7OztJQXNJdEQsNEJBQW9CLFFBQXFCO1FBQXJCLGFBQVEsR0FBUixRQUFRLENBQWE7K0JBbkJKLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7d0JBQzVCLENBQUM7Z0NBUUYsQ0FBQyxRQUFRLENBQUM7eUJBQ2pCLElBQUksY0FBYyxDQUFJLElBQUksRUFBRSxFQUFFLENBQUM7NkJBR25CLElBQUksWUFBWSxFQUFVOzJCQUU1QixJQUFJLFlBQVksRUFBaUQ7S0FNdEY7Ozs7SUFFRCxxQ0FBUTs7O0lBQVI7UUFBQSxpQkEwQkM7O1lBekJDLEdBQUcsQ0FBQyxDQUFpQixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQSxnQkFBQTtnQkFBNUIsSUFBTSxNQUFNLFdBQUE7Z0JBQ2YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDekM7Ozs7Ozs7OztRQUVELElB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QUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsUUFBUSxFQUFFLG9nS0FzR1g7b0JBQ0MsTUFBTSxFQUFFLENBQUMsc3pCQUFzekIsQ0FBQztpQkFDajBCOzs7O2dCQWxIcUIsV0FBVzs7OzBCQXFIOUIsS0FBSzs0QkFDTCxLQUFLOytCQUNMLEtBQUs7b0NBQ0wsS0FBSzs2QkFDTCxLQUFLOzRCQUNMLEtBQUs7K0JBRUwsS0FBSzs4QkFFTCxTQUFTLFNBQUMsWUFBWTt5QkFDdEIsU0FBUyxTQUFDLE9BQU87OzZCQWhJcEI7O1NBb0hhLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtNYXRQYWdpbmF0b3IsIE1hdFNuYWNrQmFyLCBNYXRTb3J0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XHJcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XHJcbmltcG9ydCB7bWVyZ2V9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge3NraXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmltcG9ydCB7QXN5bmNEYXRhU291cmNlfSBmcm9tICcuLi8uLi9hc3luYy1kYXRhLXNvdXJjZSc7XHJcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzL2ludGVybmFsL1N1YnNjcmlwdGlvbic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1tYXQtZGF0YS10YWJsZScsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwibWF0LXR5cG9ncmFwaHkgbWF0LWVsZXZhdGlvbi16MlwiPlxyXG4gIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgIDxoMj57e3RpdGxlfX08L2gyPlxyXG4gICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIj5cclxuXHJcbiAgICAgIDxidXR0b24gKm5nRm9yPVwibGV0IGJ1dHRvbiBvZiBidXR0b25zXCJcclxuICAgICAgICAgICAgICBtYXQtaWNvbi1idXR0b25cclxuICAgICAgICAgICAgICAoY2xpY2spPVwiYnV0dG9uLmFjdGlvbihzZWxlY3Rpb24uc2VsZWN0ZWQpXCJcclxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiYnV0dG9uLnNlbGVjdGlvblJlcXVpcmVkICYmIHNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGggPT09IDAgfHwgYnV0dG9uLnNlbGVjdGlvblJlcXVpcmVkICYmICFidXR0b24ubXVsdGlTZWxlY3Rpb24gJiYgc2VsZWN0aW9uLnNlbGVjdGVkLmxlbmd0aCA+IDFcIj5cclxuICAgICAgICA8bWF0LWljb24+e3tidXR0b24uaWNvbn19PC9tYXQtaWNvbj5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cInNlYXJjaC1maWVsZFwiPlxyXG4gICAgICAgIDxpbnB1dCBbbmdNb2RlbF09XCJmaWx0ZXJcIiAobmdNb2RlbENoYW5nZSk9XCJmaWx0ZXJDaGFuZ2UoJGV2ZW50KVwiIG1hdElucHV0IHBsYWNlaG9sZGVyPVwiRmlsdGVyXCI+XHJcbiAgICAgIDwvbWF0LWZvcm0tZmllbGQ+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPG1hdC1wcm9ncmVzcy1iYXIgW2NsYXNzLnNob3ddPVwiKGRhdGFTb3VyY2UubG9hZGluZyB8IGFzeW5jKSB8fCAoZGF0YVNvdXJjZS5idWZmZXJpbmcgfCBhc3luYylcIiBbbW9kZV09XCIoZGF0YVNvdXJjZS5idWZmZXJpbmcgfCBhc3luYykgPyAnYnVmZmVyJyA6ICdpbmRldGVybWluYXRlJ1wiPjwvbWF0LXByb2dyZXNzLWJhcj5cclxuICA8bWF0LXRhYmxlICN0YWJsZSBbZGF0YVNvdXJjZV09XCJkYXRhU291cmNlXCJcclxuICAgICAgICAgICAgIG1hdFNvcnQgW21hdFNvcnRBY3RpdmVdPVwic29ydENvbHVtblwiIG1hdFNvcnREaXNhYmxlQ2xlYXIgbWF0U29ydERpcmVjdGlvbj1cImFzY1wiPlxyXG5cclxuICAgIDwhLS0gQ2hlY2tib3ggQ29sdW1uIC0tPlxyXG4gICAgPG5nLWNvbnRhaW5lciBtYXRDb2x1bW5EZWY9XCJzZWxlY3RcIj5cclxuICAgICAgPG1hdC1oZWFkZXItY2VsbCAqbWF0SGVhZGVyQ2VsbERlZj5cclxuICAgICAgICA8bWF0LWNoZWNrYm94IGNvbG9yPVwicHJpbWFyeVwiIChjaGFuZ2UpPVwiJGV2ZW50ID8gbWFzdGVyVG9nZ2xlKCkgOiBudWxsXCJcclxuICAgICAgICAgICAgICAgICAgICAgIFtjaGVja2VkXT1cInNlbGVjdGlvbi5oYXNWYWx1ZSgpICYmIGlzQWxsU2VsZWN0ZWQoKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBbaW5kZXRlcm1pbmF0ZV09XCJzZWxlY3Rpb24uaGFzVmFsdWUoKSAmJiAhaXNBbGxTZWxlY3RlZCgpXCI+XHJcbiAgICAgICAgPC9tYXQtY2hlY2tib3g+XHJcbiAgICAgIDwvbWF0LWhlYWRlci1jZWxsPlxyXG4gICAgICA8bWF0LWNlbGwgKm1hdENlbGxEZWY9XCJsZXQgcm93XCI+XHJcbiAgICAgICAgPG1hdC1jaGVja2JveCBjb2xvcj1cInByaW1hcnlcIiAoY2xpY2spPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCJcclxuICAgICAgICAgICAgICAgICAgICAgIChjaGFuZ2UpPVwiJGV2ZW50ID8gc2VsZWN0aW9uLnRvZ2dsZShyb3cpIDogbnVsbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBbY2hlY2tlZF09XCJzZWxlY3Rpb24uaXNTZWxlY3RlZChyb3cpXCI+XHJcbiAgICAgICAgPC9tYXQtY2hlY2tib3g+XHJcbiAgICAgIDwvbWF0LWNlbGw+XHJcbiAgICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBjb2x1bW4gb2YgY29sdW1uc1wiIFttYXRDb2x1bW5EZWZdPVwiY29sdW1uLm5hbWVcIj5cclxuICAgICAgPG1hdC1oZWFkZXItY2VsbCBtYXQtc29ydC1oZWFkZXIgKm1hdEhlYWRlckNlbGxEZWYgW3N0eWxlLm1heC13aWR0aF09XCIoY29sdW1uLndpZHRoICsgMjQpICsgJ3B4J1wiPnt7Y29sdW1uLmxhYmVsfX08L21hdC1oZWFkZXItY2VsbD5cclxuICAgICAgPG1hdC1jZWxsICptYXRDZWxsRGVmPVwibGV0IHJvdzsgbGV0IHJvd0luZGV4ID0gaW5kZXhcIiBbc3R5bGUubWF4LXdpZHRoXT1cIihjb2x1bW4ud2lkdGggKyAyNCkgKyAncHgnXCI+XHJcbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFjb2x1bW4uZWRpdGFibGU7IGVsc2UgZWRpdGFibGVcIj5cclxuXHJcbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwicm93W2NvbHVtbi5uYW1lXS5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnRGF0ZSc7IGVsc2UgZGF0ZVwiPlxyXG4gICAgICAgICAgICB7e3Jvd1tjb2x1bW4ubmFtZV19fVxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlICNkYXRlPlxyXG4gICAgICAgICAgICB7e3Jvd1tjb2x1bW4ubmFtZV0gfCBkYXRlOidzaG9ydCd9fVxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICNlZGl0YWJsZT5cclxuXHJcbiAgICAgICAgICA8bWF0LXByb2dyZXNzLWJhciBbY2xhc3Muc2hvd109XCJkYXRhU291cmNlLnJlbmRlcmVkU2F2aW5nUm93c1tyb3dJbmRleF0uZ2V0KGNvbHVtbi5uYW1lKSB8IGFzeW5jXCIgbW9kZT1cImluZGV0ZXJtaW5hdGVcIj48L21hdC1wcm9ncmVzcy1iYXI+XHJcblxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi52YWx1ZXM7IGVsc2UgZWxzZUlmXCI+XHJcbiAgICAgICAgICAgIDxtYXQtZm9ybS1maWVsZCBbc3R5bGUubWF4LXdpZHRoXT1cImNvbHVtbi53aWR0aCArICdweCdcIj5cclxuICAgICAgICAgICAgICA8bWF0LXNlbGVjdCBbbmdNb2RlbF09XCJyb3dbY29sdW1uLm5hbWVdXCIgKG5nTW9kZWxDaGFuZ2UpPVwiY2VsbENoYW5nZShjb2x1bW4ubmFtZSwgcm93LCAkZXZlbnQsIHJvd0luZGV4KVwiPlxyXG4gICAgICAgICAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHZhbHVlIG9mIGNvbHVtbi52YWx1ZXNcIiBbdmFsdWVdPVwidmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge3sgdmFsdWUgfX1cclxuICAgICAgICAgICAgICAgIDwvbWF0LW9wdGlvbj5cclxuICAgICAgICAgICAgICA8L21hdC1zZWxlY3Q+XHJcbiAgICAgICAgICAgIDwvbWF0LWZvcm0tZmllbGQ+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgI2Vsc2VJZj5cclxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInJvd1tjb2x1bW4ubmFtZV0uY29uc3RydWN0b3IubmFtZSAhPT0gJ0RhdGUnOyBlbHNlIGRhdGVwaWNrZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdC1idXR0b25cIiBbbWF0TWVudVRyaWdnZXJGb3JdPVwibWVudVwiPlxyXG4gICAgICAgICAgICAgICAge3tyb3dbY29sdW1uLm5hbWVdfX1cclxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5lZGl0X21vZGU8L21hdC1pY29uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxtYXQtbWVudSAjbWVudT1cIm1hdE1lbnVcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgbWF0LW1lbnUtaXRlbSBkaXNhYmxlZCBjbGFzcz1cImZ1bGwtaGVpZ2h0LW1lbnUtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICA8bWF0LWZvcm0tZmllbGQgY2xhc3M9XCJtYXQtY2VsbFwiIFtzdHlsZS5tYXgtd2lkdGhdPVwiY29sdW1uLndpZHRoICsgJ3B4J1wiPiA8IS0tIG1hdC1jZWxsIGlzIGEgaGFjayB0byBvdmVycmlkZSB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgbWF0LW1lbnUtaXRlbSAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbWF0SW5wdXQgI21lc3NhZ2UgW2F0dHIubWF4bGVuZ3RoXT1cImNvbHVtbi5tYXhMZW5ndGhcIiBbbmdNb2RlbF09XCJyb3dbY29sdW1uLm5hbWVdXCIgKG5nTW9kZWxDaGFuZ2UpPVwiY2VsbENoYW5nZShjb2x1bW4ubmFtZSwgcm93LCAkZXZlbnQsIHJvd0luZGV4KVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxtYXQtaGludCBhbGlnbj1cImVuZFwiPnt7bWVzc2FnZS52YWx1ZS5sZW5ndGh9fSAvIHt7Y29sdW1uLm1heExlbmd0aH19PC9tYXQtaGludD5cclxuICAgICAgICAgICAgICAgICAgPC9tYXQtZm9ybS1maWVsZD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvbWF0LW1lbnU+XHJcbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG5cclxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNkYXRlcGlja2VyPlxyXG4gICAgICAgICAgICAgIDxtYXQtZm9ybS1maWVsZCBbc3R5bGUubWF4LXdpZHRoXT1cImNvbHVtbi53aWR0aCArICdweCdcIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBtYXRJbnB1dCBbbWF0RGF0ZXBpY2tlcl09XCJwaWNrZXJcIiBbbmdNb2RlbF09XCJyb3dbY29sdW1uLm5hbWVdXCIgKG5nTW9kZWxDaGFuZ2UpPVwiY2VsbENoYW5nZShjb2x1bW4ubmFtZSwgcm93LCAkZXZlbnQsIHJvd0luZGV4KVwiPlxyXG4gICAgICAgICAgICAgICAgPG1hdC1kYXRlcGlja2VyLXRvZ2dsZSBtYXRTdWZmaXggW2Zvcl09XCJwaWNrZXJcIj48L21hdC1kYXRlcGlja2VyLXRvZ2dsZT5cclxuICAgICAgICAgICAgICAgIDxtYXQtZGF0ZXBpY2tlciAjcGlja2VyPjwvbWF0LWRhdGVwaWNrZXI+XHJcbiAgICAgICAgICAgICAgPC9tYXQtZm9ybS1maWVsZD5cclxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDwvbWF0LWNlbGw+XHJcbiAgICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgICA8bWF0LWhlYWRlci1yb3cgKm1hdEhlYWRlclJvd0RlZj1cImRpc3BsYXllZENvbHVtbnNcIj48L21hdC1oZWFkZXItcm93PlxyXG4gICAgPG1hdC1yb3cgKm1hdFJvd0RlZj1cImxldCByb3c7IGNvbHVtbnM6IGRpc3BsYXllZENvbHVtbnM7XCI+PC9tYXQtcm93PlxyXG4gIDwvbWF0LXRhYmxlPlxyXG4gIDxtYXQtcGFnaW5hdG9yIFtwYWdlU2l6ZV09XCJwYWdlU2l6ZVwiXHJcbiAgICAgICAgICAgICAgICAgW3BhZ2VTaXplT3B0aW9uc109XCJwYWdlU2l6ZU9wdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgIFtzaG93Rmlyc3RMYXN0QnV0dG9uc109XCJ0cnVlXCI+XHJcbiAgPC9tYXQtcGFnaW5hdG9yPlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgOmhvc3R7ZGlzcGxheTpibG9ja306aG9zdCA6Om5nLWRlZXAgLm1hdC1jZWxsIC5tYXQtZm9ybS1maWVsZC11bmRlcmxpbmV7dmlzaWJpbGl0eTpoaWRkZW59Omhvc3QgLmhlYWRlcntwYWRkaW5nLXRvcDoyNHB4O3BhZGRpbmctbGVmdDoyNHB4O3BhZGRpbmctcmlnaHQ6MjRweH06aG9zdCAuaGVhZGVyIGgye2Rpc3BsYXk6aW5saW5lfTpob3N0IC5oZWFkZXIgLmFjdGlvbnN7ZGlzcGxheTppbmxpbmUtYmxvY2s7ZmxvYXQ6cmlnaHR9Omhvc3QgLmhlYWRlciAuYWN0aW9ucyAuc2VhcmNoLWZpZWxkLDpob3N0IC5oZWFkZXIgLmFjdGlvbnMgYnV0dG9ue21hcmdpbi1sZWZ0OjEwcHh9Omhvc3QgLm1hdC1wcm9ncmVzcy1iYXJ7b3BhY2l0eTowfTpob3N0IC5tYXQtcHJvZ3Jlc3MtYmFyLnNob3d7b3BhY2l0eToxfTpob3N0IC5tYXQtY29sdW1uLXNlbGVjdHttYXgtd2lkdGg6NDRweDtvdmVyZmxvdzp2aXNpYmxlfTpob3N0IC5tYXQtY2VsbHtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6ZmxleC1zdGFydDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfTpob3N0IC5tYXQtY2VsbCAuZWRpdC1idXR0b257Y3Vyc29yOnBvaW50ZXI7bGluZS1oZWlnaHQ6MjRweDt3aWR0aDoxMDAlO2JveC1zaXppbmc6Ym9yZGVyLWJveDtwYWRkaW5nLXJpZ2h0OjI0cHg7cGFkZGluZy10b3A6MS4xNmVtO3BhZGRpbmctYm90dG9tOjEuMThlbX06aG9zdCAubWF0LWNlbGwgLmVkaXQtYnV0dG9uIC5tYXQtaWNvbntmbG9hdDpyaWdodDttYXJnaW4tbGVmdDo1cHh9LmZ1bGwtaGVpZ2h0LW1lbnUtaXRlbXtoZWlnaHQ6YXV0bztsaW5lLWhlaWdodDppbml0aWFsfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVDb21wb25lbnQ8VD4gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcblxyXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgY29sdW1uczogQ29sdW1uW107XHJcbiAgQElucHV0KCkgc29ydENvbHVtbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHBhZ2VTaXplT3B0aW9uczogbnVtYmVyW10gPSBbNSwgMTAsIDE1XTtcclxuICBASW5wdXQoKSBwYWdlU2l6ZSA9IDU7XHJcbiAgQElucHV0KCkgYnV0dG9uczogQnV0dG9uPFQ+W107XHJcblxyXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IEFzeW5jRGF0YVNvdXJjZTxUPjtcclxuXHJcbiAgQFZpZXdDaGlsZChNYXRQYWdpbmF0b3IpIHBhZ2luYXRvcjogTWF0UGFnaW5hdG9yO1xyXG4gIEBWaWV3Q2hpbGQoTWF0U29ydCkgc29ydDogTWF0U29ydDtcclxuXHJcbiAgZGlzcGxheWVkQ29sdW1ucyA9IFsnc2VsZWN0J107XHJcbiAgc2VsZWN0aW9uID0gbmV3IFNlbGVjdGlvbk1vZGVsPFQ+KHRydWUsIFtdKTtcclxuXHJcbiAgZmlsdGVyOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBmaWx0ZXJDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcblxyXG4gIHByaXZhdGUgY2VsbENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtjb2x1bW46IHN0cmluZywgdmFsdWVzOiBULCByb3dJbmRleDogbnVtYmVyfT4oKTtcclxuXHJcbiAgcHJpdmF0ZSByZW5kZXJlZFJvd3NTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzbmFja0JhcjogTWF0U25hY2tCYXIpIHtcclxuXHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGZvciAoY29uc3QgY29sdW1uIG9mIHRoaXMuY29sdW1ucykge1xyXG4gICAgICB0aGlzLmRpc3BsYXllZENvbHVtbnMucHVzaChjb2x1bW4ubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kYXRhU291cmNlLnNldHVwKHRoaXMucGFnaW5hdG9yLCB0aGlzLnNvcnQsIHRoaXMuZmlsdGVyQ2hhbmdlZCwgdGhpcy5jZWxsQ2hhbmdlZCk7XHJcblxyXG4gICAgLy8gSWYgdGhlIHVzZXIgY2hhbmdlcyB0aGUgc29ydCBvciB0aGUgZmlsdGVyLCByZXNldCBiYWNrIHRvIHRoZSBmaXJzdCBwYWdlLlxyXG4gICAgbWVyZ2UodGhpcy5zb3J0LnNvcnRDaGFuZ2UsIHRoaXMuZmlsdGVyQ2hhbmdlZCkuc3Vic2NyaWJlKCgpID0+IHRoaXMucGFnaW5hdG9yLnBhZ2VJbmRleCA9IDApO1xyXG5cclxuICAgIHRoaXMuZGF0YVNvdXJjZS5zYXZlRXJyb3IucGlwZShza2lwKDEpKS5zdWJzY3JpYmUoKGVycm9yKSA9PiB7XHJcbiAgICAgIHRoaXMuc25hY2tCYXIub3BlbihlcnJvciwgbnVsbCwge1xyXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxyXG4gICAgICAgIGhvcml6b250YWxQb3NpdGlvbjogJ3JpZ2h0JyxcclxuICAgICAgICB2ZXJ0aWNhbFBvc2l0aW9uOiAnYm90dG9tJ1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIERlc2VsZWN0cyByb3dzIGlmIHRoZXkgYXJlIG5vdCBpbiB0aGUgY3VycmVudCBmaWx0ZXIgb3IgcGFnZVxyXG4gICAgdGhpcy5yZW5kZXJlZFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWRSb3dzT2JzZXJ2YWJsZS5zdWJzY3JpYmUoKHJlbmRlcmVkUm93cykgPT4ge1xyXG4gICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkIG9mIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgaWYgKHJlbmRlcmVkUm93cy5pbmRleE9mKHNlbGVjdGVkKSA9PT0gLTEpIHtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLmRlc2VsZWN0KHNlbGVjdGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLnJlbmRlcmVkUm93c1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gIH1cclxuXHJcbiAgY2VsbENoYW5nZShjb2x1bW46IHN0cmluZywgcm93OiBULCBuZXdWYWx1ZTogYW55LCByb3dJbmRleDogbnVtYmVyKSB7XHJcbiAgICByb3dbY29sdW1uXSA9IG5ld1ZhbHVlO1xyXG5cclxuICAgIHRoaXMuY2VsbENoYW5nZWQuZW1pdCh7Y29sdW1uOiBjb2x1bW4sIHZhbHVlczogcm93LCByb3dJbmRleDogcm93SW5kZXh9KTtcclxuICB9XHJcblxyXG4gIGZpbHRlckNoYW5nZShuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmZpbHRlciA9IG5ld1ZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpOyAvLyBSZW1vdmUgd2hpdGVzcGFjZTsgTWF0VGFibGVEYXRhU291cmNlIGRlZmF1bHRzIHRvIGxvd2VyY2FzZSBtYXRjaGVzXHJcbiAgICB0aGlzLmZpbHRlckNoYW5nZWQuZW1pdCh0aGlzLmZpbHRlcik7XHJcbiAgfVxyXG5cclxuICAvKiogU2VsZWN0cyBhbGwgcm93cyBpZiB0aGV5IGFyZSBub3QgYWxsIHNlbGVjdGVkOyBvdGhlcndpc2UgY2xlYXIgc2VsZWN0aW9uLiAqL1xyXG4gIG1hc3RlclRvZ2dsZSgpIHtcclxuICAgIGlmICh0aGlzLmlzQWxsU2VsZWN0ZWQoKSkge1xyXG4gICAgICB0aGlzLnNlbGVjdGlvbi5jbGVhcigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0KC4uLnRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZFJvd3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIFdoZXRoZXIgdGhlIG51bWJlciBvZiBzZWxlY3RlZCBlbGVtZW50cyBtYXRjaGVzIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cyBkaXNwbGF5ZWQuICovXHJcbiAgaXNBbGxTZWxlY3RlZCgpIHtcclxuICAgIGNvbnN0IG51bVNlbGVjdGVkID0gdGhpcy5zZWxlY3Rpb24uc2VsZWN0ZWQubGVuZ3RoO1xyXG4gICAgY29uc3QgbnVtUm93cyA9IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZFJvd3MubGVuZ3RoO1xyXG4gICAgcmV0dXJuIG51bVNlbGVjdGVkID09PSBudW1Sb3dzO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb2x1bW4ge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIHdpZHRoPzogc3RyaW5nO1xyXG4gIGVkaXRhYmxlPzogYm9vbGVhbjtcclxuICBtYXhMZW5ndGg/OiBudW1iZXI7XHJcbiAgdmFsdWVzPzogKHN0cmluZyB8IG51bWJlcilbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCdXR0b248VD4ge1xyXG4gIGljb246IHN0cmluZztcclxuICBhY3Rpb246IChzZWxlY3RlZDogVFtdKSA9PiB2b2lkO1xyXG4gIHNlbGVjdGlvblJlcXVpcmVkOiBib29sZWFuO1xyXG4gIG11bHRpU2VsZWN0aW9uOiBib29sZWFuO1xyXG59XHJcbiJdfQ==