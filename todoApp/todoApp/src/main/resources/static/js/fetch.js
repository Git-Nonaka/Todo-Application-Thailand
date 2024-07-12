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
    checkToken()
    try {
        const response = await fetch(url , {
            method : "POST",
            body : JSON.stringify(data),
            headers: {
                'Content-Type':'application/json'
            }
        });
        if(!response.ok) {
            console.error(await response.json())
            return response;
        };
        return response;
        
    } catch(e) {
        return false
    }
}

/*****     データ更新用メソッド     *****/
async function putData(data, url) {
    checkToken()
    try {
        const response = await fetch(url , {
            method : "PUT",
            body : JSON.stringify(data),
            headers: {
                'Content-Type':'application/json'
            }
        });
        if(!response.ok) {
            console.error(await response.json())
            return false;
        };
        return response;
        
    } catch(e) {
        return false
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