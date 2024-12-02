import React, { ReactNode } from 'react';

declare enum BuildType {
    STAGING = "STAGING",
    SANDBOX = "SANDBOX",
    PRODUCTION = "PRODUCTION"
}
declare enum ModalType {
    WIDGET = "WIDGET",
    ONBOARDING = "ONBOARDING"
}
declare enum OrderStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    PENDING = "PENDING"
}
declare enum AuthType {
    PHONE = "Phone",
    EMAIL = "Email",
    GAUTH = "GAuth"
}
interface OktoContextType {
    isLoggedIn: boolean;
    authenticate: (idToken: string, callback: (result: any, error: any) => void) => void;
    authenticateWithUserId: (userId: string, jwtToken: string, callback: (result: any, error: any) => void) => void;
    logOut: () => void;
    getPortfolio(): Promise<PortfolioData>;
    getSupportedNetworks: () => Promise<NetworkData>;
    getSupportedTokens: () => Promise<TokensData>;
    getUserDetails: () => Promise<User>;
    getWallets: () => Promise<WalletData>;
    orderHistory: (query: Partial<OrderQuery>) => Promise<OrderData>;
    getNftOrderDetails(query: Partial<NftOrderDetailsQuery>): Promise<NftOrderDetailsData>;
    getRawTransactionStatus(query: RawTransactionStatusQuery): Promise<RawTransactionStatusData>;
    createWallet: () => Promise<WalletData>;
    transferTokens: (data: TransferTokens) => Promise<TransferTokensData>;
    transferTokensWithJobStatus: (data: TransferTokens) => Promise<Order>;
    transferNft: (data: TransferNft) => Promise<TransferNftData>;
    transferNftWithJobStatus(data: TransferNft): Promise<NftOrderDetails>;
    executeRawTransaction: (data: ExecuteRawTransaction) => Promise<ExecuteRawTransactionData>;
    executeRawTransactionWithJobStatus(data: ExecuteRawTransaction): Promise<RawTransactionStatus>;
    showWidgetModal: () => void;
    showOnboardingModal: (primaryAuth?: AuthType, title?: string, subtitle?: string, iconUrl?: string) => void;
    closeModal: () => void;
    getTheme: () => Theme;
    setTheme: (theme: Partial<Theme>) => void;
    sendEmailOTP: (email: string) => Promise<SendOTPResponse>;
    verifyEmailOTP: (email: string, otp: string, token: string) => Promise<boolean>;
    sendPhoneOTP: (phoneNumber: string, countryShortName: string) => Promise<SendOTPResponse>;
    verifyPhoneOTP: (phoneNumber: string, countryShortName: string, otp: string, token: string) => Promise<boolean>;
}
interface ApiResponse<T> {
    data: T;
    status: string;
}
type Callback<T> = (result: T | null, error: Error | null) => void;
interface AuthDetails {
    authToken: string;
    refreshToken: string;
    deviceToken: string;
}
interface Network {
    network_name: string;
    chain_id: string;
}
interface NetworkData {
    network: Network[];
}
interface NftOrderDetailsQuery {
    page: number;
    size: number;
    order_id: string;
}
interface NftOrderDetails {
    explorer_smart_contract_url: string;
    description: string;
    type: string;
    collection_id: string;
    collection_name: string;
    nft_token_id: string;
    token_uri: string;
    id: string;
    image: string;
    collection_address: string;
    collection_image: string;
    network_name: string;
    network_id: string;
    nft_name: string;
}
interface NftOrderDetailsData {
    count: number;
    nfts: NftOrderDetails[];
}
interface OrderQuery {
    offset: number;
    limit: number;
    order_id: string;
    order_state: string;
}
interface Order {
    order_id: string;
    network_name: string;
    order_type: string;
    status: string;
    transaction_hash: string;
}
interface OrderData {
    total: number;
    jobs: Order[];
}
interface Portfolio {
    token_name: string;
    token_image: string;
    token_address: string;
    network_name: string;
    quantity: string;
    amount_in_inr: string;
}
interface PortfolioData {
    tokens: Portfolio[];
    total: number;
}
interface Token {
    token_name: string;
    token_address: string;
    network_name: string;
}
interface TokensData {
    tokens: Token[];
}
interface User {
    email: string;
    user_id: string;
    created_at: string;
    freezed: string;
    freeze_reason: string;
}
interface Wallet {
    network_name: string;
    address: string;
    success: boolean;
}
interface WalletData {
    wallets: Wallet[];
}
interface RawTransactionStatusQuery {
    order_id: string;
}
interface RawTransactionStatus {
    order_id: string;
    network_name: string;
    status: string;
    transaction_hash: string;
}
interface RawTransactionStatusData {
    total: number;
    jobs: RawTransactionStatus[];
}
interface TransferTokens {
    network_name: string;
    token_address: string;
    quantity: string;
    recipient_address: string;
}
interface TransferTokensData {
    orderId: string;
}
interface TransferNft {
    operation_type: string;
    network_name: string;
    collection_address: string;
    collection_name: string;
    quantity: string;
    recipient_address: string;
    nft_address: string;
}
interface TransferNftData {
    order_id: string;
}
interface ExecuteRawTransaction {
    network_name: string;
    transaction: object;
}
interface ExecuteRawTransactionData {
    jobId: string;
}
interface Theme {
    textPrimaryColor: string;
    textSecondaryColor: string;
    textTertiaryColor: string;
    accent1Color: string;
    accent2Color: string;
    strokeBorderColor: string;
    strokeDividerColor: string;
    surfaceColor: string;
    backgroundColor: string;
}
interface ModalData {
    theme: Theme;
    authToken: string;
    environment: string;
}
interface OnboardingModalData {
    theme: Theme;
    apiKey: string;
    environment: string;
    primaryAuthType: AuthType;
    brandTitle: string;
    brandSubtitle: string;
    brandIconUrl: string;
}
interface InjectData {
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
    authToken: string;
}
interface SendOTPResponse {
    status: string;
    message: string;
    code: number;
    token: string;
    trace_id: string;
}
interface VerifyEmailOTPRequest {
    email: string;
    otp: string;
    token: string;
}
interface OTPAuthResponse {
    auth_token: string;
    message: string;
    refresh_auth_token: string;
    device_token: string;
    trace_id: string;
}

declare const OktoProvider: ({ children, apiKey, buildType, gAuthCb, }: {
    children: ReactNode;
    apiKey: string;
    buildType: BuildType;
    gAuthCb?: () => Promise<string>;
}) => React.JSX.Element;
declare const useOkto: () => OktoContextType | null;

export { type ApiResponse, type AuthDetails, AuthType, BuildType, type Callback, type ExecuteRawTransaction, type ExecuteRawTransactionData, type InjectData, type ModalData, ModalType, type Network, type NetworkData, type NftOrderDetails, type NftOrderDetailsData, type NftOrderDetailsQuery, type OTPAuthResponse, type OktoContextType, OktoProvider, type OnboardingModalData, type Order, type OrderData, type OrderQuery, OrderStatus, type Portfolio, type PortfolioData, type RawTransactionStatus, type RawTransactionStatusData, type RawTransactionStatusQuery, type SendOTPResponse, type Theme, type Token, type TokensData, type TransferNft, type TransferNftData, type TransferTokens, type TransferTokensData, type User, type VerifyEmailOTPRequest, type Wallet, type WalletData, useOkto };
