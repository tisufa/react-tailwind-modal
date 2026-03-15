import type { JSX } from "react";

export type ModalSize =
  | "3xs"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "screen";

export interface ModalOptionsProps {
  backdrop?: boolean | "static";
  keyboard?: boolean;
  size?: ModalSize;
  centered?: boolean;
  scrollable?: boolean;
  wrapperClassName?: string;
  backdropClassName?: string;
  contentClassName?: string;
}

export interface ActiveModalContextValue {
  dismiss: () => void;
  close: (result?: any) => void;
}

export type ModalComponentType = JSX.Element | ((...args: any) => JSX.Element);
export interface ModalContextValue {
  open: (
    component: ModalComponentType,
    model?: any,
    options?: ModalOptionsProps,
  ) => Promise<any>;
  dismissAll: () => void;
  close: (result?: any) => void;
}
export interface ModalProps<TModel = unknown, TResult = unknown> {
  model: TModel;
  onClose: (result?: TResult) => void;
  onDismiss: () => void;
}
