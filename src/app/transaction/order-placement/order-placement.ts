import { OrderPlacementDetails } from './order-placement-details';

export class OrderPlacement {
    orderId : string;
    supplierId : string;
    supplierName : string;
    supplierDetailsId : string;
    identifier : string;
    expectedDeliveryDate : Date;
    expectedDeliveryDateString : string;
    actualDeliveryDate : Date;
    actualDeliveryDateString : string;
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