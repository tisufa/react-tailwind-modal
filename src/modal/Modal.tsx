import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type {
  ModalComponentType,
  ModalContextValue,
  ModalOptionsProps,
} from "../types/modal.js";
import { ModalItem } from "./ModalItem.js";

interface ModalItemProps {
  component: ModalComponentType;
  model: any;
  options?: ModalOptionsProps;
  id: string;
  resolve: (value: any) => void;
  ref?: React.RefObject<any>;
}

const Modal = forwardRef<ModalContextValue, any>((_, ref) => {
  useImperativeHandle(ref, () => ({
    open: open,
    close: closeLastModal,
    dismissAll,
  }));
  const [modals, setModals] = useState<ModalItemProps[]>([]);
  const originalOverflowRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (modals.length > 0) {
      if (originalOverflowRef.current === null)
        originalOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflowRef.current ?? "";
      originalOverflowRef.current = null;
    }
  }, [modals.length]);

  const open = (
    component: ModalComponentType,
    model: any,
    options?: ModalOptionsProps,
  ) => {
    return new Promise((resolve) => {
      const id = crypto.randomUUID();
      const ref = React.createRef();
      const modal = { component, model, resolve, options, id, ref };
      setModals((prev) => [...prev, modal]);
    });
  };

  const handleClose = (result: any, modal: ModalItemProps) => {
    modal.resolve(result);
    setTimeout(() => {
      setModals((prev) => prev.filter((m) => m.id !== modal.id));
    }, 200);
  };

  const closeLastModal = (result?: any) => {
    if (!modals.length) return;
    const lastModal = modals[modals.length - 1];
    lastModal.ref?.current?.close?.(result);
  };

  const handleDismiss = (modal: ModalItemProps) => {
    setTimeout(() => {
      setModals((prev) => prev.filter((m) => m.id !== modal.id));
    }, 200);
  };

  const dismissAll = () => {
    modals.forEach((modal) => {
      modal.ref?.current?.close();
    });
  };

  return (
    <>
      {modals.map((modal) => (
        <ModalItem
          key={modal.id}
          model={modal.model}
          options={modal.options}
          component={modal.component}
          onDismiss={() => handleDismiss(modal)}
          onClose={(result) => handleClose(result, modal)}
          ref={modal.ref}
        />
      ))}
    </>
  );
});

export { Modal };
