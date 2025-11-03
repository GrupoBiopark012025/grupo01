import { TestBed } from '@angular/core/testing';

import { SectorDataService } from './sector-data.service';

describe('SectorDataService', () => {
  let service: SectorDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectorDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
