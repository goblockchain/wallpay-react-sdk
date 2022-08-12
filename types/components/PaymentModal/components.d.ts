import React from "react";
import { ButtonProps } from "@chakra-ui/react";
interface PaymentStepsButtonProps extends ButtonProps {
    loading?: boolean;
}
interface PaymentModalBodyProps {
    children: React.ReactNode;
    onClosePaymentModal: () => void;
    title?: string;
}
declare type PurchaseInfo = {
    amount: number;
    symbol: string;
    fiatAmount: number;
    currency: string;
    total?: number;
};
interface PaymentDetailsProps {
    paymentType: "credit" | "crypto";
    purchaseInfo: PurchaseInfo;
}
interface PaymentTotalSectionProps {
    amount: number;
    symbol: string;
    checkFn: () => void;
}
interface CheckoutFormProps {
    purchaseInfo: PurchaseInfo;
    termsIsChecked: boolean;
    checkFn: () => void;
}
export declare const PaymentStepsButton: ({ children, loading, ...rest }: PaymentStepsButtonProps) => JSX.Element;
export declare const PaymentModalBody: ({ children, onClosePaymentModal, title, }: PaymentModalBodyProps) => JSX.Element;
export declare const PaymentDetails: ({ paymentType, purchaseInfo, }: PaymentDetailsProps) => JSX.Element;
export declare const PaymentTotalSection: ({ amount, symbol, checkFn, }: PaymentTotalSectionProps) => JSX.Element;
export declare const CheckoutForm: ({ purchaseInfo, checkFn, termsIsChecked, }: CheckoutFormProps) => JSX.Element;
export {};
