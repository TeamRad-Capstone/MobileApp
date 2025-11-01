import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = "http://10.0.2.2:8000";
const API_URL = "http://10.0.0.133:8000";



async function setToken(token: string) {
  await AsyncStorage.setItem("access_token", token);
}

async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem("access_token");
}

async function clearToken() {
  await AsyncStorage.removeItem("access_token");
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserData {
  id: number;
  email: string;
  username: string;
}

export async function loginApi(email: string, password: string) {
  const body = new URLSearchParams({ username: email, password }).toString();
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) throw new Error("Invalid credentials. Try again");
  const data: TokenResponse = await res.json();
  await setToken(data.access_token);
  return data;
}

export async function fetchUserApi(): Promise<UserData> {
  const token = await getToken();
  if (!token) throw new Error("No token");
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
}

export { setToken, getToken, clearToken };
