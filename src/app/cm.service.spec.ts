import { TestBed } from '@angular/core/testing';

import { CmService } from './cm.service';

describe('CmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmService = TestBed.get(CmService);
    expect(service).toBeTruthy();
  });
});
