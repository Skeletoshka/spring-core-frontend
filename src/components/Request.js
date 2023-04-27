import { notification } from "antd";

const userDetails = {
    progUserId: 0,
    tokenAccess: "",
    userName: "",
    peopleId: 0,
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
        return fetch(process.env.REACT_APP_DEV_BACKEND_URL.replace("/undefined", "") + url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body)
        })
        .then(response => {
            if(response.ok) {
                return response.json()
            }else{
                notification.open({
                    message: 'Ошибка получения данных с сервера',
                    description: "Обратитесь к системному администратору",
                });
            }
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
        if(data !== undefined){
            userDetails.tokenAccess = data.token
            userDetails.userName = data.username
            userDetails.roles = data.roles
            userDetails.progUserId = data.id
            userDetails.peopleId = data.peopleId
        }else{
            userDetails.tokenAccess = ""
        }
    },

    getUserDetails: () => {
        return userDetails
    }
}
