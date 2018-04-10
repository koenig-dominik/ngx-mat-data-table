import { Component } from '@angular/core';
import { LoadDataOptions } from '../../lib/src/components/data-table/data-table.component';
import { MockBackendService } from './mock-backend.service';

@Component({
  selector: 'app-root',
  template: `
    <ngx-mat-data-table title="Accounts" sortColumn="createdAt" uniqueColumn="id" [loadData]="loadData()" [columns]="columns">
      
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

  constructor(private mockBackendService: MockBackendService) {

  }

  loadData() {
    return async (options: LoadDataOptions) => {
      return await this.mockBackendService.get(options);
    };
  }

}
