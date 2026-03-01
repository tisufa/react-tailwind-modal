import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type JSX,
} from "react";
import { sizeMap } from "../constant/modal-constant.js";
import { ActiveModalProvider } from "../context/ModalContext.js";
import type { ModalComponentType, ModalOptionsProps } from "../types/modal.js";
interface Props {
  onClose: () => void;
  onChange: (value: any) => void;
  component: ModalComponentType;
  model: any;
  options?: ModalOptionsProps;
}
interface RefProps {
  close: () => void;
}
export const ModalItem = forwardRef<RefProps, Props>(
  (
    { onClose, onChange, component: Component, model, options = {} }: Props,
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
        if (options.keyboard !== false && e.key === "Escape") closeDialog();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [options.keyboard]);

    const handleChange = (result: any) => {
      setIsShow(false);
      onChange(result);
    };

    const handleCloseFromBackdrop = () => {
      if (options?.backdrop === "static") {
        setShake(true);
        setTimeout(() => setShake(false), 300);
        return;
      }
      closeDialog();
    };

    const closeDialog = () => {
      setIsShow(false);
      onClose();
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
            onClick={handleCloseFromBackdrop}
            aria-hidden="true"
          />
        )}

        <div
          className={`sentuh-tailwind-modal-content-wrapper  ${
            options?.centered ? "sentuh-tailwind-modal-centered" : ""
          }`}
          onClick={handleCloseFromBackdrop}
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
            <ActiveModalProvider onClose={closeDialog}>
              <div
                className={
                  options.scrollable ? "sentuh-tailwind-modal-scrollable" : ""
                }
              >
                {typeof Component === "function" ? (
                  <Component
                    model={model}
                    onClose={closeDialog}
                    onChange={handleChange}
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
