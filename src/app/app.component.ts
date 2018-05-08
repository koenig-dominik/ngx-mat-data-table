import { Component } from '@angular/core';
import { MockBackendService } from './mock-backend.service';
import { AsyncDataSource } from '../../lib/src/async-data-source';

@Component({
  selector: 'app-root',
  template: `
    <ngx-mat-data-table title="Accounts" sortColumn="createdAt" uniqueColumn="id" 
                        [dataSource]="dataSource" [columns]="columns" [buttons]="buttons">
      
    </ngx-mat-data-table>
  `,
  styleUrls: ['./app.component.scss'],
  providers: [MockBackendService]
})
export class AppComponent {

  columns = [
    {name: 'id', label: 'ID', width: 60},
    {name: 'language', label: 'Language', width: 70, editable: true, values: ['de', 'en']},
    {name: 'email', label: 'Email', editable: true, maxLength: 80},
    {name: 'createdAt', label: 'Created at', width: 100, editable: true},
    {name: 'updatedAt', label: 'Updated at'}
  ];

  buttons = [
    {icon: 'add', action: function(selection) {console.log('add', selection); }},
    {icon: 'delete', action: function(selection) {console.log('delete', selection); }}
  ];

  dataSource: AsyncDataSource<{}>;

  constructor(private mockBackendService: MockBackendService) {
    this.dataSource = new AsyncDataSource<{}>('id', this.loadData(), this.saveData());
  }

  loadData() {
    return async (filter: string, sortColumn: string, sortDirection: string, offset: number, fetchSize: number) => {
      return await this.mockBackendService.get(filter, sortColumn, sortDirection, offset, fetchSize);
    };
  }

  saveData() {
    return async (column: string, values: {}) => {
      return await this.mockBackendService.update(column, values);
    };
  }

}
