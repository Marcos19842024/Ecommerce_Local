import { MouseEvent } from "react";
import { Modal } from "../../interfaces/shared.interface";


const ModalWindow = ({children, className1, className2, closeModal}: Modal) => {
  const handleModalContainerClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <article
      className={className1}
      onClick={closeModal}>
        <div
          className={className2}
          onClick={handleModalContainerClick}>
          {children}
        </div>
    </article>
  );
};

export default ModalWindow;