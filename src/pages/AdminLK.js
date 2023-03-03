import React, { useState, useEffect } from 'react';
import { requestToApi } from "../components/Request"

export default function AdminLK(){
    const GridDataOption = {
        rowCount:10,
        page:1,
        orderBy:'accessRoleId',
        from:'accessRole'
    }

    useEffect(() => {
        requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
        .then(response => {
            if(!response.ok){
                alert(response.message)
            }else{
                return response.json()
            }
        })
        .then(data => {
            console.log(JSON.stringify(data))
        });
    })

    return(
        <div>
            <h1>Личный кабинет админа</h1>
        </div>
    )
}