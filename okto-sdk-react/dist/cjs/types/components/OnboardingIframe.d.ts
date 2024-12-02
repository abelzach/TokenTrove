import React from "react";
import { AuthDetails, OnboardingModalData } from "../types";
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
declare const OnboardingIframe: ({ modalData, onClose, updateAuthCb, gAuthCb, }: {
    modalData: OnboardingModalData;
    onClose: () => void;
    updateAuthCb: (authDetails: AuthDetails) => void;
    gAuthCb: () => Promise<string>;
}) => React.JSX.Element;
export default OnboardingIframe;
