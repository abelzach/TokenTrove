import React, { useState, forwardRef, useImperativeHandle } from "react";
import { AuthDetails, OnboardingModalData } from "../types";
import OnboardingIframe from "./OnboardingIframe";

// eslint-disable-next-line no-empty-pattern
const _OnboardingModal = (
  {
    updateAuthCb,
    gAuthCb,
  }: {
    updateAuthCb: (authDetails: AuthDetails) => void;
    gAuthCb: () => Promise<string>;
  },
  ref: any,
) => {
  const [modalData, setModalData] = useState<OnboardingModalData | null>(null);

  const openModal = (onboardingModalData: OnboardingModalData | null) => {
    setModalData(onboardingModalData);
  };

  const closeModal = () => {
    setModalData(null);
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  function handleClose() {
    closeModal();
  }

  if (!modalData) {
    return null;
  }

  return (
    <OnboardingIframe
      modalData={modalData}
      onClose={handleClose}
      updateAuthCb={updateAuthCb}
      gAuthCb={gAuthCb}
    />
  );
};
export const OnboardingModal = forwardRef(_OnboardingModal);
