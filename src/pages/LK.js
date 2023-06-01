import React, {useEffect, useState} from 'react';
import '../App.css';
import LK_Info from "../components/LK_info";
import {requestToApi} from "../components/Request";

let progUser;
export default function LK(){
    const[people, setPeople] = useState(undefined)
    const[progUser, setProgUser] = useState(undefined)
    useEffect(() => {
        if(progUser === undefined) {
            requestToApi.post("/v1/apps/objects/proguser/get", localStorage.getItem("progUserId"))
                .then(data => {
                    setProgUser(data)
                    if (data.peopleId !== null && data.peopleId !== undefined) {
                        requestToApi.post("/v1/apps/dnk/objects/people/get", data.peopleId)
                            .then(dataPeople => {
                                setPeople(dataPeople)
                            })
                    }
                });
        }
    })

    return <LK_Info progUser = {progUser} people = {people}/>
}