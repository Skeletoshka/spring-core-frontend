import { notification } from "antd";

export const requestToApi = {

    post: (url, body) => {
        let header = {};
        if(localStorage.getItem("tokenAccess")==="" || localStorage.getItem("tokenAccess") === undefined) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'}
            }
        else {
            header = {
                'Accept': 'application/json' ,
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("tokenAccess")}
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
            localStorage.setItem("tokenAccess", data.token)
            localStorage.setItem("userName", data.username)
            localStorage.setItem("roles", data.roles)
            localStorage.setItem("progUserId", data.id)
            localStorage.setItem("peopleId", data.peopleId)
        }else{
            localStorage.setItem("tokenAccess", "")
        }
    },

    clearUserDetails: () => {
        localStorage.setItem("tokenAccess", "")
        localStorage.setItem("userName", "")
        localStorage.setItem("roles", "")
        localStorage.setItem("progUserId", "")
        localStorage.setItem("peopleId", "")
    }
}
