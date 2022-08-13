/// <reference types="react" />
declare const buildElements: (sdkPrivateKey: string) => {
    PaymentModal: (props: any) => JSX.Element;
    PaymentProvider: (children: any) => JSX.Element;
};
export default buildElements;
