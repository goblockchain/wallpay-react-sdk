/// <reference types="react" />
declare type Message = {
    primaryText?: string;
    secondaryText?: string;
};
declare type EmitNotificationModalArgs = {
    type?: string;
    message?: Message;
    image?: string;
};
declare type EmitNotificationModal = ({ message, type, image, }: EmitNotificationModalArgs) => void;
interface INotificationContext {
    emitNotificationModal: EmitNotificationModal;
    onCloseModificationModal: () => void;
    isNotificationModalOpen: boolean;
}
export declare const NotificationProvider: ({ children }: {
    children: any;
}) => JSX.Element;
export declare const useNotification: () => INotificationContext;
export {};
