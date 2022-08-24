/// <reference types="react" />
declare type PaymentData = {
    fiatPrice?: number;
    price?: number;
    itemId?: number;
    tokenId?: number;
    itemName?: string;
    itemImage?: string;
};
declare type OnOpenPaymentModal = (paymentData: PaymentData) => void;
interface IPaymentContext {
    onOpenPaymentModal: OnOpenPaymentModal;
    onClosePaymentModal: () => void;
    isPaymentModalOpen: boolean;
}
export declare const PaymentProvider: ({ children, sdkPrivateKey }: {
    children: any;
    sdkPrivateKey: any;
}) => JSX.Element;
export declare const usePayment: () => IPaymentContext;
export {};
