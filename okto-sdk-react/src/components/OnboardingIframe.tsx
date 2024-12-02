import React, { useRef, useEffect } from "react";
import styles from "./OnboardingIframe.module.css";
import { onBoardingUrls } from "../constants";
import { AuthDetails, BuildType, OnboardingModalData } from "../types";

export interface InjectData {
  textPrimaryColor: string;
  textSecondaryColor: string;
  textTertiaryColor: string;
  accent1Color: string;
  accent2Color: string;
  strokeBorderColor: string;
  strokeDividerColor: string;
  surfaceColor: string;
  backgroundColor: string;
  ENVIRONMENT: string;
  API_KEY: string;
  primaryAuthType: string;
  brandTitle: string;
  brandSubtitle: string;
  brandIconUrl: string;
}

function getInjectedData(modalData: OnboardingModalData): InjectData {
  return {
    textPrimaryColor: modalData.theme.textPrimaryColor,
    textSecondaryColor: modalData.theme.textSecondaryColor,
    textTertiaryColor: modalData.theme.textTertiaryColor,
    accent1Color: modalData.theme.accent1Color,
    accent2Color: modalData.theme.accent2Color,
    strokeBorderColor: modalData.theme.strokeBorderColor,
    strokeDividerColor: modalData.theme.strokeDividerColor,
    surfaceColor: modalData.theme.surfaceColor,
    backgroundColor: modalData.theme.backgroundColor,
    ENVIRONMENT: modalData.environment,
    API_KEY: modalData.apiKey,
    primaryAuthType: modalData.primaryAuthType.toString(),
    brandTitle: modalData.brandTitle,
    brandSubtitle: modalData.brandSubtitle,
    brandIconUrl: modalData.brandIconUrl,
  };
}
const OnboardingIframe = ({
  modalData,
  onClose,
  updateAuthCb,
  gAuthCb,
}: {
  modalData: OnboardingModalData;
  onClose: () => void;
  updateAuthCb: (authDetails: AuthDetails) => void;
  gAuthCb: () => Promise<string>;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const widgetUrl = onBoardingUrls[modalData.environment as BuildType];

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }
    iframe.onload = function () {
      onLoad();
    };
    function onLoad() {
      if (iframe && iframe.contentWindow && modalData) {
        const message = {
          type: "FROM_PARENT",
          data: getInjectedData(modalData),
        };
        iframe.contentWindow.postMessage(message, widgetUrl);
      }
    }
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "go_back") {
          onClose();
        } else if (message.type === "g_auth") {
          //handle google auth
          const idToken = await gAuthCb();
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ type: "g_auth", data: idToken }),
            widgetUrl,
          );
        } else if (message.type === "copy_text") {
          //handle copy text
          const clipboardText = await navigator.clipboard.readText();
          const trimmedText = clipboardText.trim();
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ type: "copy_text", data: trimmedText }),
            widgetUrl,
          );
        } else if (message.type === "auth_success") {
          //handle auth success
          const authData = message.data;
          const authDetails: AuthDetails = {
            authToken: authData.auth_token,
            refreshToken: authData.refresh_auth_token,
            deviceToken: authData.device_token,
          };
          updateAuthCb(authDetails);
        }
      } catch (error) {
        console.error("Error parsing okto widget data", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div
      className={`${styles.modalOverlay} ${modalData ? "" : styles.hidden}`}
      onClick={onClose}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <div className={styles.container}>
            <iframe
              ref={iframeRef}
              src={widgetUrl}
              className={styles.iframe}
              loading="eager"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingIframe;
