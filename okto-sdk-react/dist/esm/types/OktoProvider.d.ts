import React, { type ReactNode } from "react";
import { BuildType, type OktoContextType } from "./types";
export declare const OktoProvider: ({ children, apiKey, buildType, gAuthCb, }: {
    children: ReactNode;
    apiKey: string;
    buildType: BuildType;
    gAuthCb?: () => Promise<string>;
}) => React.JSX.Element;
export declare const useOkto: () => OktoContextType | null;
