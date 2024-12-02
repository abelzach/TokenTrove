import React from "react";
import { renderHook, act } from "@testing-library/react";
import { OktoProvider, useOkto } from "../src/OktoProvider";
import { BuildType } from "../src/types";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  getJSONLocalStorage,
  storeJSONLocalStorage,
} from "../src/utils/storage";
import { baseUrls } from "../src/constants";
import {
  mockAuthDetails,
  mockAuthenticateData,
  mockPortfolioData,
  mockTokensData,
  mockNetworkData,
  mockUserData,
  mockWalletData,
  mockOrderData,
  mockTransferTokensData,
  mockNftTransferData,
  mockRawTransactionData,
  mockRawTransactionStatusData,
  mockNftOrderData,
} from "./mockResponses";
jest.mock("../src/utils/storage");

const buildType = BuildType.SANDBOX;
const baseUrl = baseUrls[buildType];

function wrapper({ children }) {
  return (
    <OktoProvider apiKey="test-api-key" buildType={buildType}>
      {children}
    </OktoProvider>
  );
}

async function getOktoContext() {
  let oktoContext;
  await act(async () => {
    const { result } = renderHook(() => useOkto(), { wrapper });
    oktoContext = result;
  });
  return oktoContext;
}

describe("OktoProvider", () => {
  let axiosMock;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
    getJSONLocalStorage.mockResolvedValue(null);
  });

  afterEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
  });

  afterAll(() => {
    axiosMock.restore();
  });

  // Initialization Tests
  it("should initialize the context with logged out state if local storage is empty", async () => {
    getJSONLocalStorage.mockResolvedValue(null);
    const okto = await getOktoContext();
    expect(okto.current.isLoggedIn).toBe(false);
  });

  it("should initialize the context with logged in state if local storage has auth details", async () => {
    getJSONLocalStorage.mockResolvedValue(mockAuthDetails);
    const okto = await getOktoContext();
    expect(okto.current.isLoggedIn).toBe(true);
  });

  // Authentication Tests
  it("should authenticate and update auth details", async () => {
    const idToken = "id-token";
    axiosMock
      .onPost(`${baseUrl}/api/v1/authenticate`)
      .reply(200, mockAuthenticateData);

    getJSONLocalStorage.mockResolvedValue(null);

    const okto = await getOktoContext();
    await act(async () => {
      await new Promise((resolve) => {
        okto.current.authenticate(idToken, resolve);
      });
    });

    expect(okto.current.isLoggedIn).toBe(true);
    expect(storeJSONLocalStorage).toHaveBeenCalledWith(
      expect.anything(),
      mockAuthDetails
    );
  });

  it("should handle failed authentication", async () => {
    const idToken = "id-token";
    axiosMock.onPost(`${baseUrl}/api/v1/authenticate`).reply(401);

    getJSONLocalStorage.mockResolvedValue(null);

    const okto = await getOktoContext();

    await act(async () => {
      await new Promise((resolve) => {
        okto.current.authenticate(idToken, resolve);
      });
    });

    expect(okto.current.isLoggedIn).toBe(false);
    expect(storeJSONLocalStorage).not.toHaveBeenCalled();
  });

  it("should authenticate with JWT and update auth details", async () => {
    const userId = "userId";
    const jwtToken = "jwt-token"
    axiosMock
      .onPost(`${baseUrl}/api/v1/jwt-authenticate`)
      .reply(200, mockAuthenticateData);

    getJSONLocalStorage.mockResolvedValue(null);

    const okto = await getOktoContext();
    await act(async () => {
      await new Promise((resolve) => {
        okto.current.authenticateWithUserId(userId, jwtToken, resolve);
      });
    });

    expect(okto.current.isLoggedIn).toBe(true);
    expect(storeJSONLocalStorage).toHaveBeenCalledWith(
      expect.anything(),
      mockAuthDetails
    );
  });

  it("should handle failed authentication with JWT", async () => {
    const userId = "userId";
    const jwtToken = "jwt-token";
    axiosMock.onPost(`${baseUrl}/api/v1/jwt-authenticate`).reply(401);

    getJSONLocalStorage.mockResolvedValue(null);

    const okto = await getOktoContext();

    await act(async () => {
      await new Promise((resolve) => {
        okto.current.authenticateWithUserId(userId, jwtToken, resolve);
      });
    });

    expect(okto.current.isLoggedIn).toBe(false);
    expect(storeJSONLocalStorage).not.toHaveBeenCalled();
  });

  // Refresh Token Tests
  it("should refresh token if invalid token expired", async () => {
    axiosMock
      .onPost(`${baseUrl}/api/v1/refresh_token`)
      .reply(200, mockAuthenticateData);
    axiosMock.onGet(`${baseUrl}/api/v1/portfolio`).reply(401);

    getJSONLocalStorage.mockResolvedValue(mockAuthDetails);

    const okto = await getOktoContext();

    // Calling any API should result in refresh token being updated
    await act(async () => {
      try {
        await okto.current.getPortfolio();
      } catch (error) {}
    });

    await act(async () => {
      expect(storeJSONLocalStorage).toHaveBeenCalledWith(
        expect.anything(),
        mockAuthDetails
      );
    });
  });

  it("should handle refresh token failure", async () => {
    axiosMock.onPost(`${baseUrl}/api/v1/refresh_token`).reply(401);
    axiosMock.onGet(`${baseUrl}/api/v1/portfolio`).reply(401);

    getJSONLocalStorage.mockResolvedValue(mockAuthDetails);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.getPortfolio();
      } catch (error) {}
    });

    expect(okto.current.isLoggedIn).toBe(false);
    expect(storeJSONLocalStorage).toHaveBeenCalledWith(expect.anything(), null);
  });

  // API Request Tests
  it("should fetch portfolio data", async () => {
    axiosMock
      .onGet(`${baseUrl}/api/v1/portfolio`)
      .reply(200, mockPortfolioData);

    const okto = await getOktoContext();

    await act(async () => {
      const portfolioData = await okto.current.getPortfolio();
      expect(portfolioData).toEqual(mockPortfolioData.data);
    });
  });

  it("should handle server failed for fetch portfolio", async () => {
    axiosMock
      .onGet(`${baseUrl}/api/v1/portfolio`)
      .reply(200, {status: "failed", data: mockPortfolioData.data});

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.getPortfolio();
      } catch (error) {
        expect(error.message).toBe("Server responded with an error");
      }
    });
  });

  it("should handle failed portfolio data fetch", async () => {
    axiosMock.onGet(`${baseUrl}/api/v1/portfolio`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.getPortfolio();
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should fetch supported tokens", async () => {
    axiosMock
      .onGet(`${baseUrl}/api/v1/supported/tokens`)
      .reply(200, mockTokensData);

    const okto = await getOktoContext();

    await act(async () => {
      const tokensData = await okto.current.getSupportedTokens();
      expect(tokensData).toEqual(mockTokensData.data);
    });
  });

  it("should handle failed supported tokens fetch", async () => {
    axiosMock.onGet(`${baseUrl}/api/v1/supported/tokens`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.getSupportedTokens();
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should fetch supported networks", async () => {
    axiosMock
      .onGet(`${baseUrl}/api/v1/supported/networks`)
      .reply(200, mockNetworkData);

    const okto = await getOktoContext();

    await act(async () => {
      const networkData = await okto.current.getSupportedNetworks();
      expect(networkData).toEqual(mockNetworkData.data);
    });
  });

  it("should handle failed supported networks fetch", async () => {
    axiosMock.onGet(`${baseUrl}/api/v1/supported/networks`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.getSupportedNetworks();
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should fetch user details", async () => {
    axiosMock
      .onGet(`${baseUrl}/api/v1/user_from_token`)
      .reply(200, mockUserData);

    const okto = await getOktoContext();

    await act(async () => {
      const userData = await okto.current.getUserDetails();
      expect(userData).toEqual(mockUserData.data);
    });
  });

  it("should handle failed user details fetch", async () => {
    axiosMock.onGet(`${baseUrl}/api/v1/user_from_token`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.getUserDetails();
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should fetch wallets", async () => {
    axiosMock
      .onGet(`${baseUrl}/api/v1/widget/wallet`)
      .reply(200, mockWalletData);

    const okto = await getOktoContext();

    await act(async () => {
      const walletData = await okto.current.getWallets();
      expect(walletData).toEqual(mockWalletData.data);
    });
  });

  it("should handle failed wallets fetch", async () => {
    axiosMock.onGet(`${baseUrl}/api/v1/widget/wallet`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.getWallets();
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should fetch order history", async () => {
    axiosMock.onGet(`${baseUrl}/api/v1/orders`).reply(200, mockOrderData);

    const okto = await getOktoContext();

    await act(async () => {
      const orderData = await okto.current.orderHistory({});
      expect(orderData).toEqual(mockOrderData.data);
    });
  });

  it("should handle failed order history fetch", async () => {
    axiosMock.onGet(`${baseUrl}/api/v1/orders`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.orderHistory({});
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should fetch NFT order history", async () => {
    axiosMock
      .onGet(`${baseUrl}/api/v1/nft/order_details`)
      .reply(200, mockNftOrderData);

    const okto = await getOktoContext();

    await act(async () => {
      const orderData = await okto.current.getNftOrderDetails({});
      expect(orderData).toEqual(mockNftOrderData.data);
    });
  });

  it("should transfer tokens and return order data", async () => {
    axiosMock
      .onPost(`${baseUrl}/api/v1/transfer/tokens/execute`)
      .reply(200, mockTransferTokensData);

    const okto = await getOktoContext();

    await act(async () => {
      const transferData = await okto.current.transferTokens({});
      expect(transferData).toEqual(mockTransferTokensData.data);
    });
  });
  
  it("should handle failed token transfer", async () => {
    axiosMock.onPost(`${baseUrl}/api/v1/transfer/tokens/execute`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.transferTokens({});
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should handle server failed for token transfer", async () => {
    axiosMock
      .onPost(`${baseUrl}/api/v1/transfer/tokens/execute`)
      .reply(200, { status: "failed", data: mockTransferTokensData.data });

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.transferTokens({});
      } catch (error) {
        expect(error.message).toBe("Server responded with an error");
      }
    });
  });

  it("should transfer NFT and return order details", async () => {
    axiosMock
      .onPost(`${baseUrl}/api/v1/nft/transfer`)
      .reply(200, mockNftTransferData);

    const okto = await getOktoContext();

    await act(async () => {
      const transferData = await okto.current.transferNft({});
      expect(transferData).toEqual(mockNftTransferData.data);
    });
  });

  it("should handle failed NFT transfer", async () => {
    axiosMock.onPost(`${baseUrl}/api/v1/nft/transfer`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.transferNft({});
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should execute raw transaction and return data", async () => {
    axiosMock
      .onPost(`${baseUrl}/api/v1/rawtransaction/execute`)
      .reply(200, mockRawTransactionData);

    const okto = await getOktoContext();

    await act(async () => {
      const transactionData = await okto.current.executeRawTransaction({});
      expect(transactionData).toEqual(mockRawTransactionData.data);
    });
  });

  it("should handle failed raw transaction execution", async () => {
    axiosMock.onPost(`${baseUrl}/api/v1/rawtransaction/execute`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.executeRawTransaction({});
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should fetch raw transaction status", async () => {
    axiosMock
      .onGet(`${baseUrl}/api/v1/rawtransaction/status`)
      .reply(200, mockRawTransactionStatusData);

    const okto = await getOktoContext();

    await act(async () => {
      const statusData = await okto.current.getRawTransactionStatus({});
      expect(statusData).toEqual(mockRawTransactionStatusData.data);
    });
  });

  it("should handle failed raw transaction status fetch", async () => {
    axiosMock.onGet(`${baseUrl}/api/v1/rawtransaction/status`).reply(500);

    const okto = await getOktoContext();

    await act(async () => {
      try {
        await okto.current.getRawTransactionStatus({});
      } catch (error) {
        expect(error.message).toBe("Request failed with status code 500");
      }
    });
  });

  it("should transfer tokens with job status", async () => {
    axiosMock
      .onPost(`${baseUrl}/api/v1/transfer/tokens/execute`)
      .reply(200, mockTransferTokensData);
    axiosMock
      .onGet(
        `${baseUrl}/api/v1/orders?order_id=${mockTransferTokensData.data.orderId}`
      )
      .reply(200, mockOrderData);

    const okto = await getOktoContext();

    await act(async () => {
      const transferData = await okto.current.transferTokensWithJobStatus({});
      const order_ids = mockOrderData.data.jobs.map((x) => x.order_id);
      expect(order_ids).toContain(transferData.order_id);
    });
  });

  it("should transfer NFT and return order details with job status", async () => {
    axiosMock
      .onPost(`${baseUrl}/api/v1/nft/transfer`)
      .reply(200, mockNftTransferData);
    axiosMock
      .onGet(
        `${baseUrl}/api/v1/nft/order_details?order_id=${mockNftTransferData.data.order_id}`
      )
      .reply(200, mockNftOrderData);

    const okto = await getOktoContext();

    await act(async () => {
      const transferData = await okto.current.transferNftWithJobStatus({});
      const nft_ids = mockNftOrderData.data.nfts.map((x) => x.id);
      expect(nft_ids).toContain(transferData.id);
    });
  });

  it("should execute raw transaction with job status", async () => {
    axiosMock
      .onPost(`${baseUrl}/api/v1/rawtransaction/execute`)
      .reply(200, mockRawTransactionData);

    axiosMock
      .onGet(
        `${baseUrl}/api/v1/rawtransaction/status?order_id=${mockRawTransactionData.data.jobId}`
      )
      .reply(200, mockRawTransactionStatusData);

    const okto = await getOktoContext();

    await act(async () => {
      const transactionData =
        await okto.current.executeRawTransactionWithJobStatus({});

      const order_ids = mockRawTransactionStatusData.data.jobs.map(
        (x) => x.order_id
      );
      expect(order_ids).toContain(transactionData.order_id);
    });
  });


  // Theme Update Tests
  it("should set and get theme", async () => {
    const newTheme = { textPrimaryColor: "0xFFFFFFFF" };

    const okto = await getOktoContext();

    await act(async () => {
      okto.current.setTheme(newTheme);
      expect(okto.current.getTheme().textPrimaryColor).toBe("0xFFFFFFFF");
    });
  });
});
