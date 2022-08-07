import { OrderDespatchDetails } from "./order-despatch-details";

export class OrderDespatch {

    despatchId : string;
    projectId : string;
    despatchDate : Date;
    despatchDateString : string;
    siteId : string;
    notes : string;
    vehicleNo : string;
    amount : number;
    freightCharges : number;
    cgstAmount : number;
    sgstAmount : number;
    totalAmount : number;
    details : OrderDespatchDetails[] = [];

}