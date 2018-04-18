import { __awaiter } from 'tslib';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { merge } from 'rxjs/observable/merge';
import { tap } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Component, EventEmitter, Input, ViewChild, NgModule } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatIconModule, MatMenuModule, MatPaginatorModule, MatSortModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import 'rxjs/add/operator/skip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 */
class AsyncDataSource {
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
        editedEvent.pipe(debounceTime(this.debounce)).subscribe((event) => __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 */
class DataTableComponent {
    /**
     * @param {?} snackBar
     */
    constructor(snackBar) {
        this.snackBar = snackBar;
        this.displayedColumns = ['select'];
        this.selection = new SelectionModel(true, []);
        this.filterChanged = new EventEmitter();
        this.cellChanged = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        for (const /** @type {?} */ column of this.columns) {
            this.displayedColumns.push(column.name);
        }
        this.dataSource.setup(this.paginator, this.sort, this.filterChanged, this.cellChanged);
        // If the user changes the sort or the filter, reset back to the first page.
        merge(this.sort.sortChange, this.filterChanged).subscribe(() => this.paginator.pageIndex = 0);
        this.dataSource.saveError.skip(1).subscribe((error) => {
            this.snackBar.open(error, null, {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom'
            });
        });
    }
    /**
     * @param {?} column
     * @param {?} row
     * @param {?} newValue
     * @param {?} rowIndex
     * @return {?}
     */
    cellChange(column, row, newValue, rowIndex) {
        row[column] = newValue;
        this.cellChanged.emit({ column: column, values: row, rowIndex: rowIndex });
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    filterChange(newValue) {
        this.filter = newValue.trim().toLowerCase(); // Remove whitespace; MatTableDataSource defaults to lowercase matches
        this.filterChanged.emit(this.filter);
    }
    /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     * @return {?}
     */
    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
        }
        else {
            this.selection.select(...this.dataSource.renderedRows);
        }
    }
    /**
     * Whether the number of selected elements matches the total number of rows displayed.
     * @return {?}
     */
    isAllSelected() {
        const /** @type {?} */ numSelected = this.selection.selected.length;
        const /** @type {?} */ numRows = this.dataSource.renderedRows.length;
        return numSelected === numRows;
    }
}
DataTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-mat-data-table',
                template: `<mat-card>
  <mat-card-header>
    <mat-card-title>{{title}}</mat-card-title>
    <mat-card-subtitle>
      <mat-form-field>
        <input [ngModel]="filter" (ngModelChange)="filterChange($event)" matInput placeholder="Filter">
      </mat-form-field>
    </mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <mat-progress-bar [class.show]="(dataSource.loading | async) || (dataSource.buffering | async)" [mode]="(dataSource.buffering | async) ? 'buffer' : 'indeterminate'"></mat-progress-bar>
    <mat-table #table [dataSource]="dataSource"
               matSort [matSortActive]="sortColumn" matSortDisableClear matSortDirection="asc">
      <!-- Checkbox Column -->
      <ng-container matColumnDef="select">
        <mat-header-cell *matHeaderCellDef>
          <mat-checkbox (change)="$event ? masterToggle() : null"
                        [checked]="selection.hasValue() && isAllSelected()"
                        [indeterminate]="selection.hasValue() && !isAllSelected()">
          </mat-checkbox>
        </mat-header-cell>
        <mat-cell *matCellDef="let row">
          <mat-checkbox (click)="$event.stopPropagation()"
                        (change)="$event ? selection.toggle(row) : null"
                        [checked]="selection.isSelected(row)">
          </mat-checkbox>
        </mat-cell>
      </ng-container>
      <ng-container *ngFor="let column of columns" [matColumnDef]="column.name">
        <mat-header-cell mat-sort-header *matHeaderCellDef [style.max-width]="(column.width + 24) + 'px'">{{column.label}}</mat-header-cell>
        <mat-cell *matCellDef="let row; let rowIndex = index" [style.max-width]="(column.width + 24) + 'px'">
          <ng-container *ngIf="!column.editable; else editable">
            <ng-container *ngIf="row[column.name].constructor.name !== 'Date'; else date">
              {{row[column.name]}}
            </ng-container>
            <ng-template #date>
              {{row[column.name] | date:'short'}}
            </ng-template>
          </ng-container>
          <ng-template #editable>
            <mat-progress-bar [class.show]="dataSource.renderedSavingRows[rowIndex].get(column.name) | async" mode="indeterminate"></mat-progress-bar>
            <ng-container *ngIf="column.values; else elseIf">
              <mat-form-field [style.max-width]="column.width + 'px'">
                <mat-select [ngModel]="row[column.name]" (ngModelChange)="cellChange(column.name, row, $event, rowIndex)">
                  <mat-option *ngFor="let value of column.values" [value]="value">
                    {{ value }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </ng-container>
            <ng-template #elseIf>
              <ng-container *ngIf="row[column.name].constructor.name !== 'Date'; else datepicker">
                <div class="edit-button" [matMenuTriggerFor]="menu">
                  {{row[column.name]}}
                  <mat-icon>edit_mode</mat-icon>
                </div>
                <mat-menu #menu="matMenu">
                  <div mat-menu-item disabled class="full-height-menu-item">
                    <mat-form-field class="mat-cell" [style.max-width]="column.width + 'px'"> <!-- mat-cell is a hack to override the disabled state of mat-menu-item -->
                      <input matInput #message [attr.maxlength]="column.maxLength" [ngModel]="row[column.name]" (ngModelChange)="cellChange(column.name, row, $event, rowIndex)">
                      <mat-hint align="end">{{message.value.length}} / {{column.maxLength}}</mat-hint>
                    </mat-form-field>
                  </div>
                </mat-menu>
              </ng-container>
              <ng-template #datepicker>
                <mat-form-field [style.max-width]="column.width + 'px'">
                  <input matInput [matDatepicker]="picker" [ngModel]="row[column.name]" (ngModelChange)="cellChange(column.name, row, $event, rowIndex)">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              </ng-template>
            </ng-template>
          </ng-template>
        </mat-cell>
      </ng-container>
      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
    </mat-table>
    <mat-paginator [pageSize]="5"
                   [pageSizeOptions]="[5, 10, 20]"
                   [showFirstLastButtons]="true">
    </mat-paginator>
  </mat-card-content>
</mat-card>
`,
                styles: [`:host{display:block}:host ::ng-deep .mat-card{padding:0}:host ::ng-deep .mat-card .mat-card-header{padding-left:24px;padding-right:24px;padding-top:24px}:host ::ng-deep .mat-cell .mat-input-underline{visibility:hidden}:host .mat-progress-bar{opacity:0}:host .mat-progress-bar.show{opacity:1}:host .mat-column-select{max-width:44px;overflow:visible}:host .mat-cell .edit-button{cursor:pointer;line-height:24px;margin-right:24px;padding-top:1.16em;padding-bottom:1.18em}:host .mat-cell .edit-button .mat-icon{float:right}.full-height-menu-item{height:auto;line-height:initial}`]
            },] },
];
/** @nocollapse */
DataTableComponent.ctorParameters = () => [
    { type: MatSnackBar, },
];
DataTableComponent.propDecorators = {
    "title": [{ type: Input },],
    "columns": [{ type: Input },],
    "sortColumn": [{ type: Input },],
    "uniqueColumn": [{ type: Input },],
    "dataSource": [{ type: Input },],
    "paginator": [{ type: ViewChild, args: [MatPaginator,] },],
    "sort": [{ type: ViewChild, args: [MatSort,] },],
};
/**
 * @record
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DataTableModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: DataTableModule,
            providers: []
        };
    }
}
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
/** @nocollapse */
DataTableModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { DataTableModule, AsyncDataSource, DataTableComponent as ɵa };
//# sourceMappingURL=ngx-mat-data-table.js.map
