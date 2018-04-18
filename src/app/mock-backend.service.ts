import { Injectable } from '@angular/core';

@Injectable()
export class MockBackendService {

  private static maxWaitSeconds = 1.5;

  private data = [];

  constructor() {
    const entries = 502;
    const languages = ['en', 'de'];
    const emails = ['web.de', 'gmail.com', 'googlemail.com', 'gmx.com', 'msn.com'];

    for (let i = 0; i < entries; i++) {
      const rand1 = Math.random();
      const rand2 = Math.random();
      const rand3 = Math.random();

      this.data.push({
        id: i,
        email: rand1.toString(36).substring(7) + '@' + emails[Math.round(rand1 * (emails.length - 1))],
        language: languages[Math.round(rand1)],
        referrerId: Math.floor(rand1 * entries),
        avatar: '',
        createdAt: new Date(Date.now() -  (rand3 * (60 * 60 * 24 * 800)) * 1000),
        updatedAt: new Date(Date.now() -  (rand2 * (60 * 60 * 24 * 30)) * 1000)
      });
    }
  }

  private static async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async update(column: string, values: {}) {
    await MockBackendService.sleep(Math.floor(Math.random() * (MockBackendService.maxWaitSeconds * 1000)));

    console.log('Update', column, values);

    if (values[column] === 'test-error') {
      throw new Error('Test error message');
    }
  }

  public async get(filter: string, sortColumn: string, sortDirection: string, offset: number, fetchSize: number) {
    await MockBackendService.sleep(Math.floor(Math.random() * (MockBackendService.maxWaitSeconds * 1000)));

    const filteredData = [];
    for (const row of this.data) {

      let oneMatches = false;
      for (const key in row) {
        if (!row.hasOwnProperty(key)) {
          continue;
        }

        if (String(row[key]).indexOf(filter) !== -1) {
          oneMatches = true;
          break;
        }
      }

      if (!oneMatches) {
        continue;
      }

      filteredData.push(row);
    }

    filteredData.sort(function(a, b) {
      let x = a[sortColumn];
      let y = b[sortColumn];

      if (typeof x === 'string') {
        x = x.toLowerCase();
      }
      if (typeof y === 'string') {
        y = y.toLowerCase();
      }

      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    if (sortDirection === 'desc') {
      filteredData.reverse();
    }

    const pagedData = [];
    let dataSliceLength = 0;
    let skipped = 0;
    for (const i in filteredData) {
      if (!filteredData.hasOwnProperty(i)) {
        continue;
      }
      if (skipped < offset) {
        skipped++;
        continue;
      }

      pagedData.push(filteredData[i]);
      dataSliceLength++;

      if (dataSliceLength === fetchSize) {
        break;
      }
    }

    return {count: filteredData.length, items: pagedData};
  }

}
