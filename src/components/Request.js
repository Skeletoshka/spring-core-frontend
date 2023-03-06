import { notification } from "antd";

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
        return fetch('http://193.168.49.7:8080' + url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        })
        .then(response => {
            return response.json()
        })
        .then(json => {
            if(json.errorCode===100){
                notification.open({
                    message: 'Ошибка',
                    description: json.message,
                     onClick: () => {
                        console.log(json.message);
                    },
                });
            }else{
                return json
            }
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
