const userDetails = {
    tokenAccess: "",
    userName: "",
    roles: []
}

export const requestToApi = {

    post: (url, body) => {
        var header = {};
        if(userDetails.tokenAccess==="" || userDetails.tokenAccess === undefined) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'}
            }
        else {
            header = {
                'Accept': 'application/json' ,
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userDetails.tokenAccess}
            }
        return fetch('http://localhost:8080' + url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        });
    },

    updateUserDetails: (data) => {
        userDetails.tokenAccess = data.token
        userDetails.userName = data.username
        userDetails.roles = data.roles
        console.log(JSON.stringify(userDetails))
    },

    getUserDetails: () => {
        return userDetails
    }
}
