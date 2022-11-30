import React, {useEffect} from 'react';
import {Button, Container, FormGroup, Label, Table} from 'reactstrap';
import {useNavigate} from "react-router-dom";
import {requestToApi} from '../components/Request';
import '../App.css'


export default function Auth(){

    const AuthEntity = {
        username:'',
        password:''
    }

    const navigate = useNavigate();

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        if (target.name === "username"){AuthEntity.username = value}
        if (target.name === "password"){AuthEntity.password = value}
    }

    async function handleSubmit(event){
        event.preventDefault();
        requestToApi.post('/api/auth/signin', AuthEntity)
            .then(response => {
                if(!response.ok){
                    if ([401, 403].includes(response.status)) {
                        throw 'Не удалось авторизоваться'
                    }
                }else{
                    return response.json()
                }
            })
            .then(data => {
                requestToApi.updateToken(data.accessToken)
            });
    }

    return(
        <div className='authFormOuter'>
            <div className='authFormMiddle'>
                <div className='authFormInner'>
                    <Container fluid>
                        <Table>
                            <tbody>
                                <tr>
                                    <td><Label for="username">Логин</Label></td>
                                    <td><input type="text" name="username" id="username" onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <td><Label for="password">Пароль</Label></td>
                                    <td><input type="text" name="password" id="password" onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <td><Button color="primary" type="submit" onClick={handleSubmit}>Войти</Button></td>
                                    <td><Button color="secondary" onClick={() => window.location.reload()}>Сброс</Button></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Container>
                </div>
            </div>
        </div>
    )
}