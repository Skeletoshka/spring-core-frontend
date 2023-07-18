import {Button, Form, Input, Modal, Table} from 'antd';
import Select from '../components/SelectImpl';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import DocumentStatus from "../components/DocumentStatus";
import {useForm} from "antd/es/form/Form";

const columns = [
    {
        title: "Статус",
        dataIndex: "documentTransitName",
        key: "documentTransitName",
        render: (_, entity) => {
            return <DocumentStatus title = {entity.documentTransitName} color = {entity.documentTransitColor}/>
        },
        width: "5%"
    },
    {
        title: "Текст заявки",
        dataIndex: "requestText",
        key: "requestText"
    },
    {
        title: "Услуга",
        dataIndex: "serviceName",
        key: "serviceName"
    },
    {
        title: "Имя пользователя",
        dataIndex: "progUserName",
        key: "progUserName"
    },
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'requestId',
    from:'requestId'
}

export default function Request(){
    const [requestList, setRequestList] = useState([])
    const [serviceList, setServiceList] = useState([])
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState(undefined)
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
            setLoading(true);
        }
    })

    useEffect(() => {
        if (loading) {
            requestToApi.post("/v1/apps/dnk/document/request/getlist", GridDataOption)
                .then(data => {
                    setRequestList(data.result)
                    pagination.total = data.allRowCount;
                    pagination.current = data.page;
                    pagination.pageSize = data.rowCount;
                })
                .finally(() => setLoading(false));
        }
    }, [loading])

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    function reload(){
        setLoading(true);
    }

    function cancel(){
        setShow(false);
    }

    function edit(id){
        requestToApi.post("/v1/apps/dnk/document/request/get", id)
            .then(data => {
                setId(data.requestId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })));
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.requestId = id;
            requestToApi.post("/v1/apps/dnk/document/request/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/document/request/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    function setSent(){
        requestToApi.post("/v1/apps/dnk/document/request/setstatus/send", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    function setSubmit(){
        requestToApi.post("/v1/apps/dnk/document/request/setstatus/submit", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    function setReject(){
        requestToApi.post("/v1/apps/dnk/document/request/setstatus/reject", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => edit(null)}>Добавить</Button>,
        <Button onClick={setSent}>Отправить</Button>,
        <Button onClick={setSubmit}>Принять</Button>,
        <Button onClick={setReject}>Отклонить</Button>
    ]

    return(
        <div>
            <PageHeader
                title={"Заявки"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение заявки"
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
                        name="requestText"
                        label="Текст заявки"
                        rules={[
                            {
                                required: true,
                                message: "Текст заявки не может быть пустым"
                            }
                        ]}>
                        <Input name="requestText"
                               placeholder="Текст заявки"/>
                    </Form.Item>
                    <Form.Item
                        name="serviceId"
                        label="Услуга"
                        rules={[
                            {
                                required: true,
                                message: "Услуга не может быть пустой"
                            }
                        ]}>
                        <Select
                            style={{ width: '100%' }}
                            onClick={() => {
                                if(serviceList.length === 0) {
                                    requestToApi.post("/v1/apps/dnk/refbooks/service/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'serviceId'
                                    })
                                        .then(data => setServiceList(data.result));
                                }
                            }}
                            options={serviceList.map((service) => {
                                return {
                                    label: service.serviceName,
                                    value: service.serviceId
                                }
                            })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={requestList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.requestId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.requestId)
                    },
                })}
                pagination={pagination}/>
        </div>
    )
}