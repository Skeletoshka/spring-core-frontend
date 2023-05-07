import { Button, Modal, Table, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";
import {useParams} from "react-router-dom";

export default function PeopleWorkGroup(){
    const {id} = useParams()

    return(
        <div>
            <h1>Тут наполнение группы {id}</h1>
        </div>
    )
}