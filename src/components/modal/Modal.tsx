import "../../index.css";
// This component is a modal that can be used to display content in a popup.

import { ReactNode, MouseEvent } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

const Modal = ({children, isOpen, closeModal}: ModalProps) => {
  const handleModalContainerClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <article className={`modal ${isOpen && "is-open"}`} onClick={closeModal}>
      <div className="modal-container" onClick={handleModalContainerClick}>
        {/* <button className="modal-close" onClick={closeModal}>
          x
        </button> */}
        {children}
      </div>
    </article>
  );
};

export default Modal;