import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type {
  ModalComponentType,
  ModalOptionsProps,
  ModalProps,
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

const Modal = forwardRef<ModalProps, any>((_, ref) => {
  useImperativeHandle(ref, () => ({
    open: open,
    close: closeLast,
    dismissAll,
  }));
  const [modals, setModals] = useState<ModalItemProps[]>([]);
  useEffect(() => {
    document.body.style.overflow = modals.length ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modals]);

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

  const handleChange = (result: any, modal: ModalItemProps) => {
    modal.resolve(result);
    setTimeout(() => {
      setModals((prev) => prev.filter((m) => m.id !== modal.id));
    }, 200);
  };

  const closeLast = () => {
    if (!modals.length) return;
    const lastModal = modals[modals.length - 1];
    lastModal.ref?.current?.close?.();
  };

  const handleClose = (modal: ModalItemProps) => {
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
          onClose={() => handleClose(modal)}
          onChange={(result) => handleChange(result, modal)}
          ref={modal.ref}
        />
      ))}
    </>
  );
});

export { Modal };
