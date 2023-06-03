import {Button, Modal, Table, Form, Input, DatePicker, Select} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";

const columns = [
    {
        title: "Наименование",
        dataIndex: "companyName",
        key: "companyName"
    },
    {
        title: "Пользователь",
        dataIndex: "progUserName",
        key: "progUserName"
    },
    {
        title: "Телефон",
        dataIndex: "companyTelephone",
        key: "companyTelephone"
    },
    {
        title: "Электронный адресс",
        dataIndex: "companyEmail",
        key: "companyEmail"
    },
    {
        title: "Наименование договора",
        dataIndex: "documentRealName",
        key: "documentRealName"
    },
    {
        title: "Дата договора",
        dataIndex: "contractDate",
        key: "contractDate",
        render: (data) => new Date(data).toLocaleDateString()
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'companyId'
}

export default function Company() {
    const [companyList, setCompanyList] = useState([])
    const [progUserList, setProgUserList] = useState([])
    const [contractList, setContractList] = useState([])
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
            requestToApi.post("/v1/apps/contragent/company/getlist", GridDataOption)
                .then(data => {
                    setCompanyList(data.result)
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
        requestToApi.post("/v1/apps/contragent/company/get", id)
            .then(data => {
                setId(data.companyId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.companyId = id;
            values.peopleDateBirth = new Date(values.peopleDateBirth).getTime()
            requestToApi.post("/v1/apps/contragent/company/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/contragent/company/delete", selectedRowKeys)
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
                title={"Партнёры"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение партнёра"
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
                        name="companyName"
                        label="Наименование партнёра"
                        rules={[
                            {
                                required: true,
                                message: "Наименование партнёра не может быть пустым"
                            }
                        ]}>
                        <Input name="companyName"
                               placeholder="Наименование партнёра"/>
                    </Form.Item>
                    <Form.Item
                        name="progUserId"
                        label="Пользователь"
                        rules={[
                            {
                                required: true,
                                message: "Пользователь не может быть пустым"
                            }
                        ]}>
                        <Select
                            name="progUserId"
                            placeholder="Пользователь"
                            onClick={() => {
                                if(progUserList.length === 0) {
                                    requestToApi.post("/v1/apps/objects/proguser/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'progUserId'
                                    })
                                        .then(data => {
                                            setProgUserList(data.result)
                                        });
                                }
                            }}
                            options={progUserList?.map((progUser) => {
                                return {
                                    label: progUser.progUserName,
                                    value: progUser.progUserId
                                }
                            })}/>
                    </Form.Item>
                    <Form.Item
                        name="companyTelephone"
                        label="Телефон">
                        <Input name="companyTelephone"
                               placeholder="Телефон"/>
                    </Form.Item>
                    <Form.Item
                        name="companyEmail"
                        label="Электронный адрес">
                        <Input name="companyEmail"
                               placeholder="Электронный адрес"/>
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
                </Form>
            </Modal>
            <Table
                dataSource={companyList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.companyId}
                pagination={pagination}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.companyId)
                    },
                })}/>
        </div>
    )

}