import React from "react";
import {useNavigate} from "react-router-dom";
import {requestToApi} from "../../components/Request";
import NewsPublic from "./News";

export default function HomePage() {
    const navigate = useNavigate()
    requestToApi.clearUserDetails()
    return (
        <div>
            <NewsPublic/>
        </div>
    )
}