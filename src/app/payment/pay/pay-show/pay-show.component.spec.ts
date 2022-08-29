import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayShowComponent } from './pay-show.component';

describe('PayShowComponent', () => {
  let component: PayShowComponent;
  let fixture: ComponentFixture<PayShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
