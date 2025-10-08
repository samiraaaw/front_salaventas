import { TestBed } from '@angular/core/testing';

import { MockProductsServicesService } from './mock-products.services.service';

describe('MockProductsServicesService', () => {
  let service: MockProductsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockProductsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
