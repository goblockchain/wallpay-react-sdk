/// <reference types="react" />
export declare type PaymentData = {
    itemName: any;
    fixedPrice: number;
    PriceBRL: number;
    itemImage: string;
};
interface PaymentModalProps {
    onClose: () => void;
    paymentData: PaymentData;
    sdkPrivateKey: string;
}
export declare const PaymentModal: ({ onClose, paymentData, sdkPrivateKey }: PaymentModalProps) => JSX.Element;
export {};
