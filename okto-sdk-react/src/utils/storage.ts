export const storeLocalStorage = async (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error("Error storing in local storage");
  }
};

export const getLocalStorage = async (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (e) {
    console.error("Error getting data from local storage");
  }
  return null;
};

export const storeJSONLocalStorage = async (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error storing JSON data in local storage", e);
  }
};

export const getJSONLocalStorage = async (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue !== null && jsonValue !== "undefined") {
      const value = JSON.parse(jsonValue);
      return value;
    }
    return null;
  } catch (e) {
    console.error("Error getting JSON data from local storage", e);
  }
  return null;
};
