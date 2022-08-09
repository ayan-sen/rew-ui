export class OrderPlacementDetails {
    orderId : string;
    orderDetailsId : number;
    rmId : string;
    unitId : string;
    quantity : number;
    rmName : string;
    unitName : string;
    rate : number;
    amount : number;
    remainingQuantity? : number;
    alreadyOrderedQuantity? : number;
}