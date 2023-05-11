import {Button, Modal, Table, Form, Input, Select, DatePicker} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";
import {useParams} from "react-router-dom";

const columns = [
    {
        title: "Имя",
        dataIndex: "peopleName",
        key: "peopleName"
    },
    {
        title: "Фамилия",
        dataIndex: "peopleLastName",
        key: "peopleLastName"
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
    orderBy:'peopleId',
    from:'peopleId'
}

export default function PeopleWorkGroup(){
    const [peopleList, setPeopleList] = useState([])
    const [peopleListSelect, setPeopleListSelect] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [form] = useForm()
    const [pagination, setPagination] = useState({
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
    const {id} = useParams()

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    useEffect(() => {
        if(GridDataOption.namedFilters.at(0) === undefined) {
            GridDataOption.namedFilters.push({name: "workGroupId", value: parseInt(id)})
        }
        requestToApi.post("/v1/apps/dnk/objects/people/getlist", GridDataOption)
            .then(data => {
                setPeopleList(data.result)
                pagination.total = data.allRowCount;
                pagination.current = data.page;
                pagination.pageSize = data.rowCount;
            })
            .finally(() => setLoading(false));
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function cancel(){
        setShow(false)
    }

    function submit(){
        form.validateFields().then((values) => {
            requestToApi.post("/v1/apps/dnk/objects/workgroup/bind", {
                workGroupId: parseInt(id),
                peopleId: values.peopleId
            })
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        selectedRowKeys?.map((key) => {
            requestToApi.post("/v1/apps/dnk/objects/workgroup/unbind", {
                workGroupId: parseInt(id),
                peopleId: key
            })
                .then(data => {
                    reload()
                })
        })
    }

    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => setShow(true)}>Добавить</Button>
    ]

    return (
        <div>
            <PageHeader
                title={"Наполнение группы"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение учебной группы"
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
                    layout={"vertical"}
                    name="formRegistry"
                    style={{padding: 20}}>
                    <Form.Item
                        name="peopleId"
                        label="Учащийся"
                        rules={[
                            {
                                required: true,
                                message: "Учащийся не может быть пустым"
                            }
                        ]}>
                        <Select
                            name="peopleId"
                            style={{ width: '100%' }}
                            onClick={() => {
                                if(peopleListSelect.length === 0) {
                                    requestToApi.post("/v1/apps/dnk/objects/people/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'peopleId'
                                    })
                                        .then(data => setPeopleListSelect(data.result));
                                }
                            }}
                            options={peopleListSelect.map((people) => {
                                return {
                                    label: people.peopleLastName + " " + people.peopleName.substring(0, 1)
                                        + ". " + people.peopleMiddleName.substring(0, 1) + ".",
                                    value: people.peopleId
                                }
                            })}
                        />
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
                />
        </div>
    )
}