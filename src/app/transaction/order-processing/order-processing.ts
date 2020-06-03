import { OrderProcessingDetails } from './order-processing-details';

export class OrderProcessing {
    processId : number;
    projectId : string;
    processDate : Date;
    processDateString : string;
    siteId : string;
    notes : string;
    isActive : boolean;
    details : OrderProcessingDetails[] = [];
}