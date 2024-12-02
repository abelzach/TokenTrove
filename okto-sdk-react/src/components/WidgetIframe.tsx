import React, { useRef, useEffect, useState } from "react";
import styles from "./WidgetIframe.module.css";
import Loading from "./Loading";
import { widgetUrl } from "../constants";
import { InjectData, ModalData } from "../types";

function getInjectedData(modalData: ModalData): InjectData {
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
    authToken: modalData.authToken,
  };
}
const WidgetIframe = ({
  modalData,
  onClose,
}: {
  modalData: ModalData | null;
  onClose: () => void;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }
    iframe.onload = function () {
      onLoad();
    };
    function onLoad() {
      console.log(modalData);
      if (iframe && iframe.contentWindow && modalData) {
        const message = {
          type: "FROM_PARENT",
          data: getInjectedData(modalData),
        };
        iframe.contentWindow.postMessage(message, widgetUrl);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === widgetUrl) {
        const message = event.data;
        if (message.type === "FROM_IFRAME") {
          if (message.data === "CLOSE") {
            onClose();
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      <iframe
        ref={iframeRef}
        src={widgetUrl}
        className={styles.iframe}
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default WidgetIframe;
