import { getToken, setToken, TokenResponse } from "@/services/auth";

// const hostedUrl = "http://10.0.2.2:8000";
const hostedUrl = "http://10.0.0.133:8000";

export type Shelf = {
  end_user_id: number;
  shelf_id: number;
  shelf_name: string;
};

export type Book = {
  google_book_id: string;
  title: string;
  authors: string[];
  description: string;
  number_of_pages: number;
  categories: string[];
  published_date: string;
};

const testConnection = async () => {
  const endpoint = hostedUrl + "/";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch response");
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

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  if (!response.ok) {
    let message = `Response status: ${response.status}`;
    try {
      const err = await response.json();
      if (err?.detail)
        message =
          typeof err.detail === "string"
            ? err.detail
            : JSON.stringify(err.detail);
    } catch {}
    throw new Error(message);
  }

  const result = await response.json();
  console.log(result);
  return result;
};

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
      shelf_name: name.trim()
    }),
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
  // console.log(data);
  return data;
};

const addToShelf = async (
  {
    google_book_id,
    title,
    authors,
    description,
    number_of_pages,
    categories,
    published_date,
  }: Book,
  shelf_id: number,
  user_id: number,
  shelf_name: string,
) => {
  let endpoint = hostedUrl;
  switch (shelf_name) {
    case "Want to Read":
      endpoint += "/shelves/tbr";
      break;
    case "Dropped":
      endpoint += "/shelves/dropped";
      break;
    case "Currently Reading":
      endpoint += "/shelves/current";
      break;
    case "Read":
      endpoint += "/shelves/read";
      break;
    default: // Custom shelf
      endpoint += `/shelves/custom/${shelf_name}`;
      break;
  }

  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      google_book_id: google_book_id,
      title: title,
      authors: authors,
      description: description,
      number_of_pages: number_of_pages,
      categories: categories,
      published_date: published_date,
    }),
  });

  if (!response.ok) {
    console.log(`Cannot add book`);
    console.log(`Response status: ${response.status}`);
    throw new Error(`Book is already in shelf: ${shelf_name}`);
  }
};

const getBooksFromShelf = async (
  shelf_name: string,
) => {
  let endpoint = hostedUrl;
  switch (shelf_name) {
    case "Want to Read":
      endpoint += "/shelves/tbr";
      break;
    case "Dropped":
      endpoint += "/shelves/dropped";
      break;
    case "Currently Reading":
      endpoint += "/shelves/current";
      break;
    case "Read":
      endpoint += "/shelves/read";
      break;
    default: // Custom shelf
      endpoint += `/shelves/custom/${shelf_name}`;
      break;
  }

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
    console.log(`Cannot add book`);
    console.log(`Response status: ${response.status}`);
  }

  console.log("Returning books");
  const data = await response.json();
  // console.log(data);
  return data;
};

const createReadingGoal = async (
  title: string,
  target: number,
  description?: string,
) => {
  const endpoint = hostedUrl + "/goals/";
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      target,
      description,
    }),
  });

  if (!response.ok) console.log(`Status: ${response.status}`);
  return await response.json();
};

const getMyReadingGoals = async () => {
  const endpoint = hostedUrl + "/goals/me";
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) console.log(`Status: ${response.status}`);
  return await response.json();
};

const updateReadingGoal = async (
  goal_id: number,
  title?: string,
  target?: number,
) => {
  const endpoint = hostedUrl + `/goals/${goal_id}`;
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, target }),
  });

  if (!response.ok) console.log(`Status: ${response.status}`);
  return await response.json();
};

const deleteReadingGoal = async (goal_id: number) => {
  const endpoint = hostedUrl + `/goals/${goal_id}`;
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) console.log(`Status: ${response.status}`);
  return true;
};

const editShelfName = async (shelf_name: string, new_shelf_name: string) => {
  const endpoint =
    hostedUrl + `/shelves/custom/${shelf_name}/${new_shelf_name}`;
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

const deleteCustomShelf = async (shelf_name: string) => {
  const endpoint = hostedUrl + `/shelves/custom/${shelf_name}`;
  const token = await getToken();
  if (!token) throw new Error("No token");
  console.log('Attempting to delete shelf:', endpoint);

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return true;
}

const getBookUpcomingValue = async (google_book_id: string) => {
  console.log('Attempting to get upcoming value for book:', google_book_id);
  const endpoint = hostedUrl + `/shelves/upcoming/${google_book_id}`;
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
    throw new Error(response.statusText);
  }

  const data = await response.json();
  console.log('Data: ', data);
  return data;
}

const addBookUpcomingValue = async (google_book_id: string) => {
  console.log('Attempting to add upcoming value for book:', google_book_id);
  const endpoint = hostedUrl + `/shelves/upcoming/${google_book_id}`;
  const token = await getToken();
  if (!token) throw new Error("No token");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return true;
}

const getUsername = async () => {
  const endpoint = hostedUrl + "/username/me"
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
    throw new Error(response.statusText);
  }

  console.log('Returning username');
  return await response.json();
}

const getUpcomingBooks = async () => {
  const endpoint = hostedUrl + "/shelves/upcomingBooks"
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
    throw new Error(response.statusText);
  }

  console.log('Returning upcoming books');
  const data = await response.json();
  console.log('Data: ', data);
  return data;
}

const removeBookFromShelf = async (shelfName: string, googleBookId: string) =>{
  let shelfType = "";
  switch (shelfName) {
    case "Want to Read":
      shelfType = "tbr";
      break;
    case "Dropped":
      shelfType = "dropped";
      break;
    case "Currently Reading":
      shelfType = "current";
      break;
    case "Read":
      shelfType = "read";
      break;
    default:
      shelfType = "custom";
  }

  const endpoint =
    hostedUrl + `/shelves/${shelfType}/${shelfName}/${googleBookId}`;
  const token = await getToken();
  if (!token) throw new Error("No token");

  console.log('Attempting to remove book from shelf');
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
}

export {
  testConnection,
  createUser,
  createShelf,
  getCustomShelves,
  getDefaultShelves,
  addToShelf,
  getBooksFromShelf,
  createReadingGoal,
  getMyReadingGoals,
  updateReadingGoal,
  deleteReadingGoal,
  editShelfName,
  deleteCustomShelf,
  getBookUpcomingValue,
  addBookUpcomingValue,
  getUsername,
  getUpcomingBooks,
  removeBookFromShelf
};
