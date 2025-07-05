import { TestBed } from '@angular/core/testing';

import { BackendLoginService } from './backend-login.service';

describe('BackendLoginService', () => {
  let service: BackendLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
