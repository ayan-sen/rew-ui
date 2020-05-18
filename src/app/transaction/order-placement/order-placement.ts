import { OrderPlacementDetails } from './order-placement-details';

export class OrderPlacement {
    orderId : string;
    supplierId : string;
    supplierName : string;
    supplierDetailsId : number;
    identifier : string;
    expectedDeliveryDate : Date;
    expectedDeliveryDateString : string;
    status : string;
    notes : string;
    projectId : string;
    description : string;
    siteId : string;
    details : OrderPlacementDetails[] = [];
    isActive : boolean;
    orderDate : Date;
    orderDateString : string;
    freightChargeType : string;
    paymentTerms : string;
}