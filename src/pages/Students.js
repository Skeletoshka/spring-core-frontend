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
        title: "Электронный адресс",
        dataIndex: "peopleEmail",
        key: "peopleEmail"
    },
    {
        title: "Номер телефона",
        dataIndex: "peoplePhone",
        key: "peoplePhone"
    },
    {
        title: "Муниципальное образование",
        dataIndex: "studentMun",
        key: "studentMun"
    },
    {
        title: "Класс",
        dataIndex: "studentClass",
        key: "studentClass"
    },
    {
        title: "Документ о зачислении",
        dataIndex: "documentRealName",
        key: "documentRealName"
    },
    {
        title: "Родитель",
        dataIndex: "parent",
        key: "parent",
        render: (_, entity) => entity.parentLastName!==undefined&&entity.parentLastName!==null?
            entity.parentLastName + " " + entity.parentName.substring(0, 1) + ". "
            + entity.parentMiddleName.substring(0, 1) + "." :""
    },
    {
        title: "Школа",
        dataIndex: "companyName",
        key: "companyName"
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'peopleLastName',
    from:'peopleId'
}

export default function Student() {
    const [studentList, setStudentList] = useState([])
    const [contractList, setContractList] = useState([])
    const [companyList, setCompanyList] = useState([])
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
            requestToApi.post("/v1/apps/dnk/objects/student/getlist", GridDataOption)
                .then(data => {
                    setStudentList(data.result)
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
        requestToApi.post("/v1/apps/dnk/objects/student/get", id)
            .then(data => {
                setId(data.peopleId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: key==="peopleDateBirth"?Dayjs(data[key]):data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.studentId = id;
            values.peopleDateBirth = new Date(values.peopleDateBirth).getTime()
            requestToApi.post("/v1/apps/dnk/objects/student/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/student/delete", selectedRowKeys)
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
                title={"Ученики"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение учеников"
                   onCancel={cancel}
                   centered={true}
                   footer={[
                       <Button onClick={submit}>
                           Сохранить
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
                        name="peopleEmail"
                        label="Электронный адрес">
                        <Input name="peopleEmail"
                               placeholder="Электронный адрес"/>
                    </Form.Item>
                    <Form.Item
                        name="peoplePhone"
                        label="Номер телефона">
                        <Input name="peoplePhone" autoComplete="off"
                               placeholder="Номер телефона"/>
                    </Form.Item>
                    <Form.Item
                        name="studentClass"
                        label="Класс"
                        rules={[
                            {
                                required: true,
                                message: "Класс не может быть пустой"
                            }
                        ]}>
                        <Input name="studentClass" autoComplete="off"
                               placeholder="Класс"/>
                    </Form.Item>
                    <Form.Item
                        name="studentMun"
                        label="Муниципальное образование"
                        rules={[
                            {
                                required: true,
                                message: "Муниципальное образование не может быть пустым"
                            }
                        ]}>
                        <Input name="studentMun" autoComplete="off"
                               placeholder="Муниципальное образование"/>
                    </Form.Item>
                    <Form.Item
                        name="contractId"
                        label="Договор"
                        rules={[
                            {
                                required: true,
                                message: "Договор не может быть пустым"
                            }
                        ]}>
                        <Select
                            style={{ width: '100%' }}
                            onClick={() => {
                                if(contractList.length === 0) {
                                    requestToApi.post("/v1/apps/document/contract/getlist", {
                                        rowCount:10,
                                        page:1,
                                        orderBy:'contractId'
                                    })
                                        .then(data => setContractList(data.result));
                                }
                            }}
                            options={contractList.map((contract) => {
                                return {
                                    label: contract.documentRealName,
                                    value: contract.contractId
                                }
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        name="companyId"
                        label="Партнёр">
                        <Select
                            style={{ width: '100%' }}
                            onClick={() => {
                                if(companyList.length === 0) {
                                    requestToApi.post("/v1/apps/contragent/company/getlist", {
                                        rowCount:10,
                                        page:1,
                                        orderBy:'companyId'
                                    })
                                        .then(data => setCompanyList(data.result));
                                }
                            }}
                            options={companyList.map((company) => {
                                return {
                                    label: company.companyName,
                                    value: company.companyId
                                }
                            })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={studentList}
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