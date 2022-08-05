import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from 'src/app/components/common-service/error-handler.service';
import { Expense } from './expense';
import { ExpenseCategory } from './expense-category';
import { ExpenseSummary } from './expense-summary';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient, private errorHandler : ErrorHandlerService) { }

  save(expense : Expense) {
    return this.http.post("transaction/expense", expense);
   }
 
  findAll() : Observable<Expense[]> {
     return this.http.get<Expense[]>("transaction/expenses");
   } 

  delete(id : number) {
    return this.http.delete("transaction/expense/" +id );
  }

  findAllByDate(date: string) : Observable<Expense[]> {
    let params = new HttpParams();
    params = params.set('expenseDate', date);
    return this.http.get<Expense[]>("transaction/expense/date", {"params": params});
  } 

  getAllExpenseCategories() : Observable<ExpenseCategory[]> {
    return this.http.get<ExpenseCategory[]>("transaction/categories");
  }
  

  findExpensesBetweenDates(fromDate: string, toDate : string) : Observable<ExpenseSummary> {
    let params = new HttpParams();
    params = params.append('expenseDate', fromDate);
    params = params.append('toDate', toDate);
    return this.http.get<ExpenseSummary>("transaction/expense/report", {"params": params});
  } 
}
