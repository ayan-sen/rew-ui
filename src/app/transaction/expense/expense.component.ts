import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerResponse } from 'src/app/components/common-service/common-model/server-response';
import { NotificationService } from 'src/app/components/notification/notification.service';
import { Expense } from './expense';
import { ExpenseCategory } from './expense-category';
import { ExpenseService } from './expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  expense : Expense;
  exForm: FormGroup;
  expenses : Expense[];
  expenseCategories : ExpenseCategory[];

  constructor(private expenseService : ExpenseService, 
              private notificationService : NotificationService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.exForm = new FormGroup({
      'expenseDate': new FormControl(null, Validators.required),
      'expenseDateString': new FormControl(''),
      'description': new FormControl('', Validators.required),
      'amount': new FormControl(0, Validators.required),
      'categoryId': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if(this.exForm.valid) {
      this.expense = this.exForm.value;
      console.log(this.expense);
      if(this.exForm.value.expenseDate != null) {
        this.expense.expenseDateString = this.datePipe.transform(this.expense.expenseDate, 'dd/MM/yyyy');
      }
      this.expenseService.save(this.expense).subscribe(
        (response:ServerResponse) => {
          this.notificationService.openSnackBar(response.message, response.status);
          this.findAllByDate(this.expense.expenseDateString);
          //this.exForm.reset();
          this.exForm.value.description = '';
          this.exForm.value.amount = 0;
        }, (errorMsg: HttpErrorResponse) => { 
          this.notificationService.openSnackBar(errorMsg.error.message, errorMsg.error.status);
          console.log("error response ::");
          console.log(errorMsg.message);
        }
      );
    }
  }

  findAll() {
    this.expenseService.findAll().subscribe(
      expenses => {
        this.expenses = expenses;
      }
    );
  }

  findAllByDate(date : string) {
    this.expenseService.findAllByDate(date).subscribe(
      expenses => {
        this.expenses = expenses;
      }
    );
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.exForm.controls[controlName].hasError(errorName); 
  }

  getAllCategories() {
    this.expenseService.getAllExpenseCategories().subscribe(
      expenseCategories => {
        this.expenseCategories = expenseCategories;
      }
    );
  }


}
