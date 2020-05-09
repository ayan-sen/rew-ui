import { ProjectDetails } from './project-details';

export class Project {
    projectId : string;
    amendmentNo : number;
    amendmentDate: Date;
    description : string;
    customerId : string;
    customerName: string;
    consigneeId : string;
    consigneeName : string;
    purchaseOrderNo : string;
    purchaseOrderDate : Date;
    workOrderReference : string;
    expectedDeliveryDate : Date;
    actualDeliveryDate : Date;
    status : string;
    notes : string;
    amount : number;
    otherCharges: number;
    cgstAmount: number;
    sgstAmount: number;
    totalAmount : number;
    isActive : boolean;
    expectedDeliveryDateString : string;
    actualDeliveryDateString : string;
    purchaseOrderDateString : string;
    amendmentDateString : string;
    projectStartDate : Date;
    projectStartDateString : string;
    details : ProjectDetails[] = [];
}