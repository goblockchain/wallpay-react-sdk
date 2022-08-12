/// <reference types="react" />
import { IconButtonProps } from '@chakra-ui/react';
interface CloseButtonProps {
    closeFn: () => void;
    color?: string;
}
export declare const CloseButton: ({ closeFn, color, ...rest }: CloseButtonProps & Partial<IconButtonProps>) => JSX.Element;
export {};
