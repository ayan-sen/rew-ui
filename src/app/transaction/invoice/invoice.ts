import { InvoiceDetails } from "./invoice-details";

export class Invoice {
    invoiceId : string;
    invoiceDate : Date;
    invoiceDateString : string;
    projectId : string;
    vehicleNo: string;
    amount : number;
    freightCharges : number;
    cgstAmount : number;
    sgstAmount : number;
    totalAmount : number;
    notes: string;
    clientId : string;
    details : InvoiceDetails[] = [];
}