import { TestBed } from '@angular/core/testing';

import { OrderProcessingShowService } from './order-processing-show.service';

describe('OrderProcessingShowService', () => {
  let service: OrderProcessingShowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderProcessingShowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
