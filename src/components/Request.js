const tokenAccess = {
    value: ""
};

export const requestToApi = {

    post: (url, body) => {
        var header = {};
        if(tokenAccess.value==="" || tokenAccess.value === undefined) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'}
            }
        else {
            header = {
                'Accept': 'application/json' ,
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokenAccess.value}
            }
        return fetch('http://193.168.49.7:8080' + url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        });
    },

    updateToken: (token) => {
        tokenAccess.value = token
    },

    getToken: () => {
        console.log(tokenAccess.value)
    }
}
