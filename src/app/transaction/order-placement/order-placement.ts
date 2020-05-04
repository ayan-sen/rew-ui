import { OrderPlacementDetails } from './order-placement-details';

export class OrderPlacement {
    orderId : string;
    supplierId : string;
    supplierName : string;
    supplierDetailsId : string;
    identifier : string;
    expectedDeliveryDate : Date;
    actualDeliveryDate : Date;
    status : string;
    notes : string;
    projectId : string;
    projectName : string;
    details : OrderPlacementDetails[] = [];
}