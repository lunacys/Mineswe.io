import { TestBed } from '@angular/core/testing';

import { LogFactoryService } from './log-factory.service';

describe('LogFactoryService', () => {
  let service: LogFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
