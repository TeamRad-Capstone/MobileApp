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
        console.log("Something is happening")
        console.error(error.message);
    }
}

const createUser = async (email: string, username: string, password: string) => {
    const endpoint = hostedUrl + "/user/";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
            })
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
    } catch (error: any) {
        console.log("Something is happening")
        console.error(error.message);
    }
}

export { testConnection, createUser };