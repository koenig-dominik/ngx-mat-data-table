import { Injectable } from '@angular/core';
import {LoadDataOptions} from '../../lib/src/components/data-table/data-table.component';

@Injectable()
export class MockBackendService {

  private static maxWaitSeconds = 1.5;

  private data = [];

  constructor() {
    const entries = 500;
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
        createdAt: new Date(Date.now() -  (rand3 * (60 * 60 * 24 * 800))),
        updatedAt: new Date(Date.now() -  (rand2 * (60 * 60 * 24 * 30)))
      });
    }
  }

  private static async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async get(options: LoadDataOptions) {
    await MockBackendService.sleep(Math.floor(Math.random() * (MockBackendService.maxWaitSeconds * 1000)));

    const filteredData = {};
    for (let i = 0; i < this.data.length; i++) {

      let oneMatches = false;
      for (const key in this.data[i]) {
        if (!this.data[i].hasOwnProperty(key)) {
          continue;
        }

        if (String(this.data[i][key]).indexOf(options.filter) !== -1) {
          oneMatches = true;
          break;
        }
      }

      if (!oneMatches) {
        continue;
      }

      filteredData[this.data[i].id] = this.data[i];
    }

    const pagedData = [];
    let dataSliceLength = 0;
    let skipped = 0;
    for (const i in filteredData) {
      if (!filteredData.hasOwnProperty(i)) {
        continue;
      }
      if (skipped < options.offset) {
        skipped++;
        continue;
      }

      pagedData.push(filteredData[i]);
      dataSliceLength++;

      if (dataSliceLength === options.pageSize) {
        break;
      }
    }

    return pagedData;
  }

}
