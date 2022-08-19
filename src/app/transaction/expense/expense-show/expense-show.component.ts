import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Expense } from '../expense';
import { ExpenseSummary } from '../expense-summary';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-expense-show',
  templateUrl: './expense-show.component.html',
  styleUrls: ['./expense-show.component.css']
})
export class ExpenseShowComponent implements OnInit {

  expForm: FormGroup;
  fromDate : Date;
  fromDateString : string = "";
  toDate : Date;
  toDateString : string = "";
  expenses : Expense[] = [];
  summary : ExpenseSummary;
  catagoriseExpenses : Map<string, number>;
  totalExpense : number;
  isSearched : boolean = false;

  constructor(private fb: FormBuilder,
              private expenseService : ExpenseService,
              private datePipe : DatePipe) { }

  ngOnInit(): void {
    this.expForm = this.fb.group({
      'fromDate': new FormControl(null, Validators.required),
      'fromDateString': new FormControl(''),
      'toDate': new FormControl(null),
      'toDateString': new FormControl('')
    });
  }

  onSubmit() {
    if (this.expForm.valid) {
      this.fromDate = this.expForm.value.fromDate;
      this.toDate = this.expForm.value.toDate;
      
      if(this.expForm.value.fromDate != null) {
        this.fromDateString = this.datePipe.transform(this.fromDate, 'dd/MM/yyyy');
      }
      if(this.expForm.value.toDate != null) {
        this.toDateString = this.datePipe.transform(this.toDate, 'dd/MM/yyyy');
      }
      this.expenseService.findExpensesBetweenDates(this.fromDateString, this.toDateString).subscribe(
        summary => {
          this.summary = summary;
          this.totalExpense = summary.totalExpense;
          this.expenses = this.summary.details;
          this.catagoriseExpenses = this.summary.catagorisedExpenses;
        }
      );
      console.log(this.expenses);  
      this.isSearched = true;
    }
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.expForm.controls[controlName].hasError(errorName); 
  }

}
