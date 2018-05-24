/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatIconModule, MatMenuModule, MatPaginatorModule, MatSortModule, MatProgressBarModule, MatSnackBarModule, MatButtonModule } from '@angular/material';
import { DataTableComponent } from './components/data-table/data-table.component';
export class DataTableModule {
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
function DataTableModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    DataTableModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    DataTableModule.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10YWJsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtbWF0LWRhdGEtdGFibGUvIiwic291cmNlcyI6WyJkYXRhLXRhYmxlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU3QyxPQUFPLEVBQ1UsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFDekcsbUJBQW1CLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUMzSCxpQkFBaUIsRUFBRSxlQUFlLEVBQ25DLE1BQU0sbUJBQW1CLENBQUM7QUFFM0IsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUErQmxGLE1BQU07Ozs7SUFDRyxNQUFNLENBQUMsT0FBTztRQUVuQixNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsZUFBZTtZQUN6QixTQUFTLEVBQUUsRUFDVjtTQUNGLENBQUM7Ozs7WUFwQ0wsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLGNBQWM7b0JBQ2Qsa0JBQWtCO29CQUNsQixjQUFjO29CQUNkLGlCQUFpQjtvQkFDakIsbUJBQW1CO29CQUNuQixtQkFBbUI7b0JBQ25CLGVBQWU7b0JBQ2YsYUFBYTtvQkFDYixhQUFhO29CQUNiLGtCQUFrQjtvQkFDbEIsYUFBYTtvQkFDYixvQkFBb0I7b0JBQ3BCLGlCQUFpQjtvQkFDakIsZUFBZTtvQkFDZixXQUFXO2lCQUNaO2dCQUNELFlBQVksRUFBRTtvQkFDWixrQkFBa0I7aUJBQ25CO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxrQkFBa0I7aUJBQ25CO2dCQUNELFNBQVMsRUFBRSxFQUVWO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuXHJcbmltcG9ydCB7XHJcbiAgTWF0Q2FyZE1vZHVsZSwgTWF0Q2hlY2tib3hNb2R1bGUsIE1hdEZvcm1GaWVsZE1vZHVsZSwgTWF0SW5wdXRNb2R1bGUsIE1hdFRhYmxlTW9kdWxlLCBNYXREYXRlcGlja2VyTW9kdWxlLFxyXG4gIE1hdE5hdGl2ZURhdGVNb2R1bGUsIE1hdFNlbGVjdE1vZHVsZSwgTWF0SWNvbk1vZHVsZSwgTWF0TWVudU1vZHVsZSwgTWF0UGFnaW5hdG9yTW9kdWxlLCBNYXRTb3J0TW9kdWxlLCBNYXRQcm9ncmVzc0Jhck1vZHVsZSxcclxuICBNYXRTbmFja0Jhck1vZHVsZSwgTWF0QnV0dG9uTW9kdWxlXHJcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xyXG5cclxuaW1wb3J0IHsgRGF0YVRhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RhdGEtdGFibGUvZGF0YS10YWJsZS5jb21wb25lbnQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBNYXRUYWJsZU1vZHVsZSxcclxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcclxuICAgIE1hdElucHV0TW9kdWxlLFxyXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXHJcbiAgICBNYXROYXRpdmVEYXRlTW9kdWxlLFxyXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcclxuICAgIE1hdFNlbGVjdE1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRNZW51TW9kdWxlLFxyXG4gICAgTWF0UGFnaW5hdG9yTW9kdWxlLFxyXG4gICAgTWF0U29ydE1vZHVsZSxcclxuICAgIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxyXG4gICAgTWF0U25hY2tCYXJNb2R1bGUsXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBEYXRhVGFibGVDb21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIERhdGFUYWJsZUNvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcblxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZU1vZHVsZSB7XHJcbiAgcHVibGljIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBEYXRhVGFibGVNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=