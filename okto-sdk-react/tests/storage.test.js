import {
  storeLocalStorage,
  getLocalStorage,
  storeJSONLocalStorage,
  getJSONLocalStorage,
} from "../src/utils/storage";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("LocalStorage Utility Functions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test for storeLocalStorage
  it("should store a string value in localStorage", async () => {
    const key = "testKey";
    const value = "testValue";
    await storeLocalStorage(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value);
  });

  it("should handle errors when storing in localStorage", async () => {
    const key = "testKey";
    const value = "testValue";
    localStorage.setItem.mockImplementationOnce(() => {
      throw new Error("Failed to set item");
    });
    console.error = jest.fn();
    await storeLocalStorage(key, value);
    expect(console.error).toHaveBeenCalledWith(
      "Error storing in local storage"
    );
  });

  // Test for getLocalStorage
  it("should get a string value from localStorage", async () => {
    const key = "testKey";
    const value = "testValue";
    localStorage.setItem(key, value);
    const retrievedValue = await getLocalStorage(key);
    expect(retrievedValue).toBe(value);
  });

  it("should return null if key is not in localStorage", async () => {
    const key = "nonExistingKey";
    const retrievedValue = await getLocalStorage(key);
    expect(retrievedValue).toBeNull();
  });

  it("should handle errors when getting from localStorage", async () => {
    const key = "testKey";
    localStorage.getItem.mockImplementationOnce(() => {
      throw new Error("Failed to get item");
    });
    console.error = jest.fn();
    const retrievedValue = await getLocalStorage(key);
    expect(console.error).toHaveBeenCalledWith(
      "Error getting data from local storage"
    );
    expect(retrievedValue).toBeNull();
  });

  it("should return null if window is undefined in getLocalStorage", async () => {
    const originalWindow = global.window;
    delete global.window;
    const key = "testKey";
    const retrievedValue = await getLocalStorage(key);
    expect(retrievedValue).toBeNull();
    global.window = originalWindow;
  });

  // Test for storeJSONLocalStorage
  it("should store a JSON object in localStorage", async () => {
    const key = "testKey";
    const value = { a: 1, b: "test" };
    await storeJSONLocalStorage(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(value)
    );
  });

  it("should handle errors when storing JSON in localStorage", async () => {
    const key = "testKey";
    const value = { a: 1, b: "test" };
    localStorage.setItem.mockImplementationOnce(() => {
      throw new Error("Failed to set item");
    });
    console.error = jest.fn();
    await storeJSONLocalStorage(key, value);
    expect(console.error).toHaveBeenCalledWith(
      "Error storing JSON data in local storage",
      expect.any(Error)
    );
  });

  // Test for getJSONLocalStorage
  it("should get a JSON object from localStorage", async () => {
    const key = "testKey";
    const value = { a: 1, b: "test" };
    localStorage.setItem(key, JSON.stringify(value));
    const retrievedValue = await getJSONLocalStorage(key);
    expect(retrievedValue).toEqual(value);
  });

  it("should return null if JSON key is not in localStorage", async () => {
    const key = "nonExistingKey";
    const retrievedValue = await getJSONLocalStorage(key);
    expect(retrievedValue).toBeNull();
  });

  it("should handle errors when getting JSON from localStorage", async () => {
    const key = "testKey";
    localStorage.getItem.mockImplementationOnce(() => {
      throw new Error("Failed to get item");
    });
    console.error = jest.fn();
    const retrievedValue = await getJSONLocalStorage(key);
    expect(console.error).toHaveBeenCalledWith(
      "Error getting JSON data from local storage",
      expect.any(Error)
    );
    expect(retrievedValue).toBeNull();
  });

  it("should return null if window is undefined in getJSONLocalStorage", async () => {
    const originalWindow = global.window;
    delete global.window;
    const key = "testKey";
    const retrievedValue = await getJSONLocalStorage(key);
    expect(retrievedValue).toBeNull();
    global.window = originalWindow;
  });

  it("should handle invalid JSON in localStorage", async () => {
    const key = "testKey";
    localStorage.setItem(key, "invalid JSON");
    console.error = jest.fn();
    const retrievedValue = await getJSONLocalStorage(key);
    expect(console.error).toHaveBeenCalledWith(
      "Error getting JSON data from local storage",
      expect.any(SyntaxError)
    );
    expect(retrievedValue).toBeNull();
  });
});
