import { Component } from '@angular/core';
import { MockBackendService } from './mock-backend.service';
import { AsyncDataSource } from '../../lib/src';

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
    {icon: 'add', action: this.add()},
    {icon: 'delete', action: this.delete(), selectionRequired: true, multiSelection: true}
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

  delete() {
    return async(selected) => {
      return await this.mockBackendService.delete(selected);
    };
  }

  add() {
    return async() => {
      return await this.mockBackendService.add();
    };
  }

}
