import React, { useEffect } from "react";
import {requestToApi} from "../../components/Request";
import NewsPublic from "./News";

export default function HomePage() {
    useEffect(() => {
        if(requestToApi.isAuthUser()){
            requestToApi.clearUserDetails()
            window.location.reload()
        }
    })

    return (
        <div>
            <NewsPublic/>
        </div>
    )
}