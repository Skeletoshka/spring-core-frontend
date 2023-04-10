import {Button, Modal, Table, Form, Input, DatePicker, Select} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";

const columns = [
    {
        title: "Имя человека",
        dataIndex: "peopleName",
        key: "peopleName"
    },
    {
        title: "Фамилия человека",
        dataIndex: "peopleLastName",
        key: "peopleLastName"
    },
    {
        title: "Отчество человека",
        dataIndex: "peopleMiddleName",
        key: "peopleMiddleName"
    },
    {
        title: "Дата рождения человека",
        dataIndex: "peopleDatebirth",
        key: "peopleDatebirth",
        render: (peopleDatebirth) => {
            return new Date(peopleDatebirth).toLocaleDateString()
        }
    },
    {
        title: "Класс человека",
        dataIndex: "capclassId",
        key: "capclassId"
    },
    {
        title: "Электронный адресс человека",
        dataIndex: "peopleEmail",
        key: "peopleEmail"
    },
    {
        title: "Номер телефона человека",
        dataIndex: "peoplePhone",
        key: "peoplePhone"
    },
    {
        title: "Флаг удаления человека",
        dataIndex: "peopleDeleteFlag",
        key: "peopleDeleteFlag"
    },
    {
        title: "Дата удаления человека",
        dataIndex: "peopleDateDelete",
        key: "peopleDateDelete",
        render: (peopleDateDelete) => {
            return new Date(peopleDateDelete).toLocaleDateString()
        }
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'peopleId',
    from:'peopleId'
}

const GridDataOptionDirection = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'peopleId',
    from:'peopleId'
}

export default function People() {
    const [peopleList, setPeopleList] = useState([])
    const [capClassList, setCapClassList] = useState([])
    const [people, setPeople] = useState()
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [form] = useForm()

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    useEffect(() => {
        requestToApi.post("/v1/apps/dnk/objects/people/getlist", GridDataOption)
            .then(data => {
                setPeopleList(data)
                setLoading(false);
            });
        requestToApi.post("/v1/apps/dnk/refbooks/capclass/getlist", GridDataOptionDirection)
            .then(data => {
                setCapClassList(data)
                setLoading(false);
            });
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function cancel(){
        setShow(false)
        setPeople(undefined)
    }

    function add(){
        requestToApi.post("/v1/apps/dnk/object/people/get", null)
            .then(data => {
                setPeople(data)
                setShow(true)
                form.resetFields()
            });
    }

    function edit(id){
        requestToApi.post("/v1/apps/dnk/object/people/get", id)
            .then(data => {
                setPeople(data)
                setShow(true)
                form.resetFields()
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            requestToApi.post("/v1/apps/dnk/object/people/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                    setPeople(undefined)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/object/people/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }
    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={add}>Добавить</Button>
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
                    layout={"vertical"}
                    initialValues={people}
                    name="formRegistry"
                    style={{padding: 20}}>
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
                               placeholder="Имя человека"
                               value={people === undefined ? '' : people.peopleName}/>
                    </Form.Item>
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
                               placeholder="Фамилия"
                               value={people === undefined ? '' : people.peopleLastName}/>
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
                               placeholder="Отчество"
                               value={people === undefined ? '' : people.peopleMiddleName}/>
                    </Form.Item>
                    <Form.Item
                        name="peopleDatebirth"
                        label="Дата рождения"
                        rules={[
                            {
                                required: true,
                                message: "Дата рождения не может быть пустой"
                            }
                        ]}>
                        <DatePicker name="peopleDatebirth"
                               placeholder="Дата рождения"
                               value={people === undefined ? '' : people.peopleDatebirth}/>
                    </Form.Item>
                    <Form.Item
                        name="capclassId"
                        label="Класс"
                        rules={[
                            {
                                required: true,
                                message: "Отчество не может быть пустым"
                            }
                        ]}>
                        <Select
                            name="capclassId"
                            placeholder="Класс"
                            value={people === undefined ? '' : people.peopleMiddleName}
                            options={capClassList?.map((capclass) => {
                                return {
                                    label: capclass.capclassName,
                                    value: capclass.capclassId
                                }
                            })}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={peopleList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.peopleId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.peopleId)
                    },
                })}/>
        </div>
    )

}