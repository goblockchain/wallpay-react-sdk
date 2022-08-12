/// <reference types="react" />
interface CopyToClipboardProps {
    copyFn?: () => void;
    color?: string;
}
export declare const CopyToClipboard: ({ copyFn, color }: CopyToClipboardProps) => JSX.Element;
export {};
