import { TestBed } from '@angular/core/testing';

import { OrderDespatchService } from './order-despatch.service';

describe('OrderDespatchService', () => {
  let service: OrderDespatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDespatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
