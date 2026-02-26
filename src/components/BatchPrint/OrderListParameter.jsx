import { getCurrentLocalTimeTimestamp, getRangeWithCurrentLocalTimeTimestamp } from "./BatchPrinterFunctions";



export const orderListParameter = {
    "endConfirmAt": getCurrentLocalTimeTimestamp(),
    "orderStatus": 1,
    "page": 1,
    "pageSize": 100,
    "refundStatus": 5,
    "startConfirmAt": getRangeWithCurrentLocalTimeTimestamp(),
    "tradeType": 0
};
