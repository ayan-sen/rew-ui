import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDespatchShowComponent } from './order-despatch-show.component';

describe('OrderDespatchShowComponent', () => {
  let component: OrderDespatchShowComponent;
  let fixture: ComponentFixture<OrderDespatchShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDespatchShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDespatchShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
