export class TransactionRecord {
    transactionId : number;
    referenceId : string;
    referenceDate : Date;
    referenceDateString : string;
    referenceType : string;
    buySellFlag : string;
    amount : number;
    freightCharges : number;
    cgstAmount : number;
    sgstAmount : number;
    totalAmount : number;
    clientId : string;
    paidAmount : number;
    paymentReferenceId : string;
    isPaymentDone : boolean;
}