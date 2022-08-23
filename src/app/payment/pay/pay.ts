import { PayDetail } from "./pay-detail";

export class Pay {
    paymentId : string;
    paymentDate : Date;
    paymentDateString : string;
    paymentRefNo : string;
    clientId : string;
    projectPayment : number;
    otherPayment : number;
    totalPayment : number;
    notes : string;
    paymentType : string;
    details : PayDetail[] = [];
}
