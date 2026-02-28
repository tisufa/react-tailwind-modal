import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
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

    const modalConfig = useMemo(() => {
      const size = options?.size || "md";
      const maxWidthClass = sizeMap[size] || sizeMap.md;
      return {
        wrapper: `flex justify-center min-h-full transition-all duration-300 ${options.centered ? "items-center" : "items-start"} ${
          options?.wrapperClassName || ""
        }`,
        content: [
          `relative w-full transition-all duration-300 ease-out`,
          options.scrollable ? "max-h-[90vh] flex flex-col" : "h-auto",
          maxWidthClass,
          size === "screen" ? "min-h-screen" : "rounded-md p-6",
          "overflow-hidden",
          options?.contentClassName || "",
        ]
          .filter(Boolean)
          .join(" "),
      };
    }, [options]);

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
      <div className="fixed inset-0 z-[999] overflow-hidden">
        {options.backdrop !== false && (
          <div
            className={`fixed inset-0 bg-slate-900/20 transition-opacity duration-200 ${
              isShow ? "opacity-100" : "opacity-0"
            } ${options?.backdropClassName}`}
            onClick={handleCloseFromBackdrop}
            aria-hidden="true"
          />
        )}

        <div className="fixed inset-0 overflow-y-auto outline-none">
          <div
            className={modalConfig.wrapper}
            onClick={handleCloseFromBackdrop}
          >
            <div
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              className={`
            ${modalConfig.content}
            ${shake ? "scale-[1.02]" : "rotate-0"}
            ${
              isShow
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-10 scale-95"
            }
          `}
              onClick={(e) => e.stopPropagation()}
            >
              <ActiveModalProvider onClose={closeDialog}>
                <div className={options.scrollable ? "overflow-y-auto" : ""}>
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
      </div>
    );
  },
);
