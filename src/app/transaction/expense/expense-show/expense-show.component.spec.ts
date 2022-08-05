import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseShowComponent } from './expense-show.component';

describe('ExpenseShowComponent', () => {
  let component: ExpenseShowComponent;
  let fixture: ComponentFixture<ExpenseShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
