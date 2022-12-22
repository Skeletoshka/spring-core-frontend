import { Button } from "antd";
import {requestToApi} from '../components/Request';

export default function AccessRole(){

    function handleSubmit(){
        alert("Молодец")
        requestToApi.post('/api/accessrole/getlist', "1")
            .then(response => {
                if(!response.ok){
                    if ([401, 403].includes(response.status)) {
                        throw 'Не удалось авторизоваться'
                    }
                    throw 'Не удалось авторизоваться'
                }else{
                    return response.json()
                }
            })
            .then(data => {
                console.log(data)
            });
    }

    return(
        <div>
            <h1>Роли пользователя</h1>
            <Button onClick={handleSubmit}>Нажми меня</Button>
        </div>
    )
}