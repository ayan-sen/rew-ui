import { ClientDetails } from './client-detail';

export class Client {
    clientId : string;
    clientName : string;
    clientType : string;
    gstinNo : string;
    primanyContactNo : string;
    primaryEmailId : string;
    comments : string;
    isActive : string;
    details : ClientDetails[];
}