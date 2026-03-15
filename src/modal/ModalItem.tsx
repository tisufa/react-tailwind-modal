import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type JSX,
} from "react";
import { sizeMap } from "../constant/modal-constant.js";
import { ActiveModalProvider } from "../context/ModalContext.js";
import type {
  ModalComponentType,
  ModalOptionsProps,
  ModalProps,
} from "../types/modal.js";
interface Props extends ModalProps {
  component: ModalComponentType;
  options?: ModalOptionsProps;
}

interface RefProps {
  close: () => void;
}
export const ModalItem = forwardRef<RefProps, Props>(
  (
    { onDismiss, onClose, component: Component, model, options = {} }: Props,
    ref,
  ): JSX.Element => {
    const [isShow, setIsShow] = useState(false);
    const [shake, setShake] = useState(false);

    useImperativeHandle(ref, () => ({
      close: closeDialog,
    }));

    useEffect(() => {
      const timer = setTimeout(() => setIsShow(true), 10);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (options.keyboard !== false && e.key === "Escape") dismissDialog();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [options.keyboard]);

    const handleClose = (result: any) => {
      closeDialog(result);
    };

    const closeDialog = (result?: any) => {
      setIsShow(false);
      onClose(result);
    };

    const handleDismissFromBackdrop = () => {
      if (options?.backdrop === "static") {
        setShake(true);
        setTimeout(() => setShake(false), 300);
        return;
      }
      dismissDialog();
    };

    const handleDismiss = () => {
      dismissDialog();
    };

    const dismissDialog = () => {
      setIsShow(false);
      onDismiss();
    };

    return (
      <div
        className={`sentuh-tailwind-modal-wrapper ${options?.wrapperClassName}`}
      >
        {options.backdrop !== false && (
          <div
            className={`sentuh-tailwind-modal-backdrop ${
              isShow ? "sentuh-tailwind-modal-backdrop-show" : ""
            } ${options?.backdropClassName}`}
            onClick={handleDismissFromBackdrop}
            aria-hidden="true"
          />
        )}

        <div
          className={`sentuh-tailwind-modal-content-wrapper  ${
            options?.centered ? "sentuh-tailwind-modal-centered" : ""
          }`}
          onClick={handleDismissFromBackdrop}
        >
          <div
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={`
          sentuh-tailwind-modal-content
          ${shake ? "sentuh-tailwind-modal-shake" : ""}
          ${isShow ? "sentuh-tailwind-modal-content-show" : "sentuh-tailwind-modal-content-hide"}
          ${sizeMap[options?.size || "md"]}
          ${options.contentClassName}
        `}
            onClick={(e) => e.stopPropagation()}
          >
            <ActiveModalProvider
              onClose={handleClose}
              onDismiss={handleDismiss}
            >
              <div
                className={
                  options.scrollable ? "sentuh-tailwind-modal-scrollable" : ""
                }
              >
                {typeof Component === "function" ? (
                  <Component
                    model={model}
                    onDismiss={handleDismiss}
                    onClose={handleClose}
                  />
                ) : (
                  <>{Component}</>
                )}
              </div>
            </ActiveModalProvider>
          </div>
        </div>
      </div>
    );
  },
);
