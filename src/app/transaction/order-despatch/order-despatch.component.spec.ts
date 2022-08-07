import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDespatchComponent } from './order-despatch.component';

describe('OrderDespatchComponent', () => {
  let component: OrderDespatchComponent;
  let fixture: ComponentFixture<OrderDespatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDespatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDespatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
