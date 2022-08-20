import { OrderDeliveryDetails } from './order-delivery-details';

export class OrderDelivery {
    deliveryId : string;
    billNo : string;
    billDate : Date;
    billDateString : string;
    orderId : string;
    supplierId : string;
    supplierName : string;
    supplierIdentifier : string;
    supplierDetailsId : number;
    consigneeId: string;
    consigneeName : string;
    consigneeDetailsId : number;
    consigneeIdentifier : string;
    vehicleNo: string;
    amount : number;
    freightCharges : number;
    cgstAmount : number;
    sgstAmount : number;
    totalAmount : number;
    notes : string;
    siteId : string;
    isActive : boolean;
    projectId : string;
    details : OrderDeliveryDetails[] = [];
}