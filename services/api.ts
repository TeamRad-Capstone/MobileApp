import { getToken, setToken, TokenResponse } from "@/services/auth";

const hostedUrl = "http://10.0.2.2:8000";

const testConnection = async () => {
  const endpoint = hostedUrl + "/";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch reponse");
    }

    const result = await response.json();
    console.log(result);
  } catch (error: any) {
    console.log("Something is happening");
    console.error(error.message);
  }
};

const createUser = async (
  email: string,
  username: string,
  password: string,
) => {
  const endpoint = hostedUrl + "/register/";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error: any) {
    console.log("Something is happening");
    console.error(error.message);
  }
};

export type Shelf = {
  end_user_id: number;
  shelf_id: number;
  shelf_name: string;
}

const createShelf = async (name: string) => {
  const endpoint = hostedUrl + "/shelf/";
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shelf_name: name,
    })
  });
  if (!response.ok) {
    console.log(`Response status: ${response.status}`);
  }
  console.log("Successfully created custom shelf");
};

const getCustomShelves = async () => {
  const endpoint = hostedUrl + "/shelves/me";
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.log("Endpoint not working for custom shelf get method");
    console.log(`Response status: ${response.status}`);
  }
  return await response.json();
};

const getDefaultShelves = async () => {
  const endpoint = hostedUrl + "/defaultShelves/me";
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.log("Endpoint not working for default shelf get method");
    console.log(`Response status: ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
  return data;

}

export { testConnection, createUser, createShelf, getCustomShelves, getDefaultShelves };
