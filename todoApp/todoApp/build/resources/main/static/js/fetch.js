//update 30/07/2024 for improvement performance
/*****     tokenが有効かチェック     *****/
async function checkToken() {
    const token = localStorage.getItem("X-AUTH-TOKEN");
    if (!token) {
        console.error("No token found");
        return false;
    }

    const header = { 
        'Authorization': "Bearer " + token  // Use 'Authorization' instead 'X-AUTH-TOKEN'
    };

    try {
        const response = await fetch(`http://localhost:8080/check`, {
            method: "GET",
            headers: header
        });

        if (!response.ok) {
            console.error(`Token check failed with status ${response.status}: ${await response.text()}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error checking token:", error);
        return false;
    }
}



/*****     データ取得用メソッド     *****/
async function getData(url) {
    const tokenValid = await checkToken();
    if (!tokenValid) {
        console.error("Invalid token");
        return false;
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("X-AUTH-TOKEN")
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch data: ${response.status}, ${await response.text()}`);
            return false;
        }
        return response;
    } catch (e) {
        console.error("Error fetching data:", e);
        return false;
    }
}


/*****     データ送信用メソッド     *****/
async function postData(data, url) {
    const tokenValid = await checkToken();
    if (!tokenValid) {
        console.error("Invalid token");
        return { ok: false, responseData: "Invalid token" };
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("X-AUTH-TOKEN")
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Failed to POST data:', response.status, responseData);
            return { ok: false, responseData };
        }

        return { ok: true, responseData };
    } catch (error) {
        console.error('Error posting data:', error);
        return { ok: false, responseData: error };
    }
}



/*****     データ更新用メソッド     *****/
async function putData(data, url) {
    const tokenValid = await checkToken();
    if (!tokenValid) {
        console.error("Invalid token");
        return { ok: false, responseData: "Invalid token" };
    }

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("X-AUTH-TOKEN")
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const responseText = await response.text();
            console.error('Failed to PUT data:', response.status, responseText);
            return { ok: false, responseData: responseText };
        }

        const responseData = await response.text();
        return { ok: true, responseData: responseData ? JSON.parse(responseData) : {} };
    } catch (error) {
        console.error('Error in putData:', error);
        return { ok: false, responseData: error };
    }
}

/*****     データ削除用メソッド     *****/
async function deleteData(url) {
    const tokenValid = await checkToken();
    if (!tokenValid) {
        console.error("Invalid token");
        return false;
    }

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("X-AUTH-TOKEN")
            }
        });

        if (!response.ok) {
            console.error(`Failed to DELETE data: ${response.status}, ${await response.text()}`);
            return false;
        }
        return response;
    } catch (e) {
        console.error("Error deleting data:", e);
        return false;
    }
}
