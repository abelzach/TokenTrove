import React from "react";
import { AuthDetails } from "../types";
export declare const OnboardingModal: React.ForwardRefExoticComponent<{
    updateAuthCb: (authDetails: AuthDetails) => void;
    gAuthCb: () => Promise<string>;
} & React.RefAttributes<unknown>>;
