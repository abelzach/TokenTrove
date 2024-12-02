import React from "react";
import { ModalData } from "../types";
declare const WidgetIframe: ({ modalData, onClose, }: {
    modalData: ModalData | null;
    onClose: () => void;
}) => React.JSX.Element;
export default WidgetIframe;
