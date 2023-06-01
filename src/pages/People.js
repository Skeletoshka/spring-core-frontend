import {Button, Modal, Table, Form, Input, DatePicker, Select} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";

const columns = [
    {
        title: "Фамилия",
        dataIndex: "peopleLastName",
        key: "peopleLastName"
    },
    {
        title: "Имя",
        dataIndex: "peopleName",
        key: "peopleName"
    },
    {
        title: "Отчество",
        dataIndex: "peopleMiddleName",
        key: "peopleMiddleName"
    },
    {
        title: "Дата рождения",
        dataIndex: "peopleDateBirth",
        key: "peopleDateBirth",
        render: (peopleDateBirth) => {
            return new Date(peopleDateBirth).toLocaleDateString()
        }
    },
    {
        title: "Класс",
        dataIndex: "capClassName",
        key: "capClassName"
    },
    {
        title: "Электронный адресс",
        dataIndex: "peopleEmail",
        key: "peopleEmail"
    },
    {
        title: "Номер телефона",
        dataIndex: "peoplePhone",
        key: "peoplePhone"
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'peopleLastName',
    from:'peopleId'
}

const GridDataOptionCapClass = {
    namedFilters:[
        {name:"capClassTypeId", value:1}
    ],
    rowCount:10,
    page:1,
    orderBy:'capClassId',
    from:'capClass'
}

export default function People() {
    const [peopleList, setPeopleList] = useState([])
    const [capClassList, setCapClassList] = useState([])
    const [id, setId] = useState()
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [form] = useForm()
    const [pagination] = useState({
        current: 2,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total)=>{
            return "Всего " + total
        },
        onChange: (page, pageSize) => {
            GridDataOption.page = page;
            GridDataOption.rowCount = pageSize;
            reload();
        }
    })

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    useEffect(() => {
        if(loading) {
            requestToApi.post("/v1/apps/dnk/objects/people/getlist", GridDataOption)
                .then(data => {
                    setPeopleList(data.result)
                    pagination.total = data.allRowCount;
                    pagination.current = data.page;
                    pagination.pageSize = data.rowCount;
                })
                .finally(() => setLoading(false));
        }
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function cancel(){
        setShow(false)
    }

    function edit(id){
        requestToApi.post("/v1/apps/dnk/objects/people/get", id)
            .then(data => {
                setId(data.peopleId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: key==="peopleDateBirth"||key==="peopleDateDelete"?Dayjs(data[key]):data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.peopleId = id;
            values.peopleDateBirth = new Date(values.peopleDateBirth).getTime()
            requestToApi.post("/v1/apps/dnk/objects/people/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/people/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }
    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => edit(null)}>Добавить</Button>
    ]

    return (
        <div>
            <PageHeader
                title={"Люди"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение людей"
                   onCancel={cancel}
                   centered={true}
                   footer={[
                       <Button onClick={submit}>
                           Добавить
                       </Button>,
                       <Button onClick={cancel}>
                           Назад
                       </Button>
                   ]}>
                <Form
                    form={form}
                    autoComplete={false}
                    layout={"vertical"}
                    name="formRegistry"
                    style={{padding: 20}}>
                    <Form.Item
                        name="peopleLastName"
                        label="Фамилия"
                        rules={[
                            {
                                required: true,
                                message: "Фамилия не может быть пустой"
                            }
                        ]}>
                        <Input name="peopleLastName"
                               placeholder="Фамилия"/>
                    </Form.Item>
                    <Form.Item
                        name="peopleName"
                        label="Имя"
                        rules={[
                            {
                                required: true,
                                message: "Имя не может быть пустым"
                            }
                        ]}>
                        <Input name="peopleName"
                               placeholder="Имя"/>
                    </Form.Item>
                    <Form.Item
                        name="peopleMiddleName"
                        label="Отчество"
                        rules={[
                            {
                                required: true,
                                message: "Отчество не может быть пустым"
                            }
                        ]}>
                        <Input name="peopleMiddleName"
                               placeholder="Отчество"/>
                    </Form.Item>
                    <Form.Item
                        name="peopleDateBirth"
                        label="Дата рождения"
                        rules={[
                            {
                                required: true,
                                message: "Дата рождения не может быть пустой"
                            }
                        ]}>
                        <DatePicker name="peopleDateBirth"/>
                    </Form.Item>
                    <Form.Item
                        name="capClassId"
                        label="Класс"
                        rules={[
                            {
                                required: true,
                                message: "Отчество не может быть пустым"
                            }
                        ]}>
                        <Select
                            name="capClassId"
                            placeholder="Класс"
                            onClick={() => {
                                if(capClassList.length === 0) {
                                    requestToApi.post("/v1/apps/refbooks/capclass/getlist", GridDataOptionCapClass)
                                        .then(data => {
                                            setCapClassList(data)
                                        });
                                }
                            }}
                            options={capClassList?.map((capClass) => {
                                return {
                                    label: capClass.capClassName,
                                    value: capClass.capClassId
                                }
                            })}/>
                    </Form.Item>
                    <Form.Item
                        name="peopleEmail"
                        label="Электронный адрес"
                        rules={[
                            {
                                required: true,
                                message: "Отчество не может быть пустым"
                            }
                        ]}>
                        <Input name="peopleEmail"
                               placeholder="Электронный адрес"/>
                    </Form.Item>
                    <Form.Item
                        name="peoplePhone"
                        label="Номер телефона">
                        <Input name="peoplePhone" autoComplete="off"
                               placeholder="Номер телефона"/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={peopleList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.peopleId}
                pagination={pagination}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.peopleId)
                    },
                })}/>
        </div>
    )

}