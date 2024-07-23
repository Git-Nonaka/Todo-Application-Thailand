/*****     tokenが有効かチェック     *****/
async function checkToken() {
    const token = localStorage.getItem("X-AUTH-TOKEN")
    const header = { 
        'X-AUTH-TOKEN' :"Bearer " + token 
    }
    const response = await fetch(`http://localhost:8080/check`, {
        method: "GET",
        headers: header
    })
    if(!response.ok) {
        console.error(await response.json())
        return false
    }
    return response
}

/*****     データ取得用メソッド     *****/
async function getData(url) {
    checkToken()
    try {
        const response = await fetch(url);
    
        if(!response.ok) {
            console.error(await response.json())
            return response
        }
        return response;
    } catch(e) {
        return false
    }
}

/*****     データ送信用メソッド     *****/
async function postData(data, url) {
    checkToken();
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseData = await response.json(); // Assuming response is JSON

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
async function putData(data, url = '') {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // send data as JSON
        });

        if (!response.ok) {
            // Extract response body if exists
            const responseText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${responseText || response.statusText}`);
        }

        // Try to parse response as JSON if it exists
        try {
            return await response.json();
        } catch (e) {
            // No JSON in response, return empty object or null
            return null;
        }
    } catch (error) {
        console.error("Error in putData:", error);
        throw error; // Rethrow to handle it in the calling function
    }
}

/*****     データ削除用メソッド     *****/
async function deleteData(url) {
    checkToken()
    try {
        const response = await fetch(url, {
            method: "DELETE",
        });
        if (!response.ok) {
            console.error(await response.json())
            return false
        };
        return response
    } catch(e) {
        return false
    }
}