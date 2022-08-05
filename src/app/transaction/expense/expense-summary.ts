import { Expense } from "./expense";

export class ExpenseSummary {
    catagorisedExpenses : Map<string, number>;
    totalExpense : number;
    details : Expense[];
}