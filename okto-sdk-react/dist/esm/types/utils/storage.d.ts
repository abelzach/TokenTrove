export declare const storeLocalStorage: (key: string, value: string) => Promise<void>;
export declare const getLocalStorage: (key: string) => Promise<string | null>;
export declare const storeJSONLocalStorage: (key: string, value: any) => Promise<void>;
export declare const getJSONLocalStorage: (key: string) => Promise<any>;
