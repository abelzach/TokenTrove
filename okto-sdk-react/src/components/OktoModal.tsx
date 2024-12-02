import React, { useState, forwardRef, useImperativeHandle } from "react";
import WidgetIframe from "./WidgetIframe";
import { ModalType, ModalData } from "../types";
import styles from "./OktoModal.module.css";

// eslint-disable-next-line no-empty-pattern
const _OktoModal = ({}: object, ref: any) => {
  const [currentScreen, setCurrentScreen] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = (
    screen: ModalType | null,
    widgetModalData: ModalData | null = null,
  ) => {
    setCurrentScreen(screen);
    if (widgetModalData) {
      setModalData(widgetModalData);
    }
  };

  const closeModal = () => {
    setCurrentScreen(null);
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  function handleClose() {
    closeModal();
  }

  return (
    <div
      className={`${styles.modalOverlay} ${currentScreen ? "" : styles.hidden}`}
      onClick={handleClose}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          {currentScreen === ModalType.WIDGET && (
            <WidgetIframe modalData={modalData} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
};
export const OktoModal = forwardRef(_OktoModal);
