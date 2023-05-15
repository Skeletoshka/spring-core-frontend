import React, {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {requestToApi} from "../components/Request";
import {Button, DatePicker, Form, Input, Modal, Select, Table} from "antd";
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";

const columns = [
    {
        title: "Наименование события",
        dataIndex: "activityName",
        key: "activityName"
    },
    {
        title: "Дата события",
        dataIndex: "activityDate",
        key: "activityDate",
        render: (activityDate) => {
            return new Date(activityDate).toLocaleDateString()
        }
    },
    {
        title: "Направление",
        dataIndex: "directionName",
        key: "directionName"
    },
    {
        title: "Адрес",
        dataIndex: "address",
        key: "address",
        render: (_, entity) => {
            return "г. " + entity.townName + ", ул. " + entity.streetName + ", д. " + entity.addressHouse
                + (entity.addressLitera!==null?entity.addressLitera:"")
                + (entity.addressCorpus!==null?"к." + entity.addressCorpus:"")
        }
    },
    {
        title: "Партнёр",
        dataIndex: "companyName",
        key: "companyName"
    },
    {
        title: "Тип события",
        dataIndex: "capClassName",
        key: "capClassName"
    },
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'activityName'
}

export default function Activity(){
    const [activityList, setActivityList] = useState([])
    const [addressList, setAddressList] = useState([])
    const [companyList, setCompanyList] = useState([])
    const [capClassList, setCapClassList] = useState([])
    const [directionList, setDirectionList] = useState([])
    const [id, setId] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true)
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
            requestToApi.post("/v1/apps/dnk/objects/activity/getlist", GridDataOption)
                .then(data => {
                    setActivityList(data.result)
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
        requestToApi.post("/v1/apps/dnk/objects/activity/get", id)
            .then(data => {
                setId(data.activityId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: key==="activityDate"?Dayjs(data[key]):data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.activityId = id;
            requestToApi.post("/v1/apps/dnk/objects/activity/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/activity/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => edit(null)}>Добавить</Button>
    ]

    return(
        <div>
            <PageHeader
                title={"События"}
                buttons={buttons}
            />
            <Modal open = {show}
                   title="Изменение события"
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
                        name="activityName"
                        label="Наименование события"
                        rules={[
                            {
                                required: true,
                                message: "Наименование события не может быть пустым"
                            }
                        ]}>
                        <Input name="activityName"
                               placeholder="Наименование события"/>
                    </Form.Item>
                    <Form.Item
                        name="activityDate"
                        label="Дата события"
                        rules={[
                            {
                                required: true,
                                message: "Дата события не может быть пустой"
                            }
                        ]}>
                        <DatePicker name="activityDate"/>
                    </Form.Item>
                    <Form.Item
                        name="addressId"
                        label="Адрес"
                        rules={[
                            {
                                required: true,
                                message: "Дата события не может быть пустой"
                            }
                        ]}>
                        <Select
                            style={{ width: '100%' }}
                            showSearch={true}
                            onSearch={(text) => {
                                if(text.length > 3) {
                                    requestToApi.post("/v1/apps/refbooks/address/find", text)
                                        .then(data => setAddressList(data));
                                }
                            }}
                            options={addressList?.map((address) => {
                                return {
                                    label: "г. " + address.townName + ", ул. " + address.streetName + ", д. " + address.addressHouse
                                        + (address.addressLitera!==null?address.addressLitera:"")
                                        + (address.addressCorpus!==null?"к." + address.addressCorpus:""),
                                    value: address.addressId
                                }
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        name="directionId"
                        label="Направление"
                        rules={[
                            {
                                required: true,
                                message : "Направление программы обучения не может быть пустыми"
                            }
                        ]}>
                        <Select
                            style={{ width: '100%' }}
                            onClick={() => {
                                console.log(directionList)
                                if(directionList === undefined || directionList.length === 0) {
                                    requestToApi.post("/v1/apps/dnk/refbooks/direction/getlist",
                                        {
                                                namedFilters:[],
                                                rowCount:10,
                                                page:1,
                                                orderBy:'directionName'
                                            })
                                        .then(data => setDirectionList(data.result));
                                }
                            }}
                            options={directionList?.map((direction) => {
                                return {
                                    label: direction.directionName,
                                    value: direction.directionId
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
                                    requestToApi.post("/v1/apps/contragent/company/getlist",
                                        {
                                            namedFilters:[],
                                            rowCount:10,
                                            page:1,
                                            orderBy:'companyName'
                                        })
                                        .then(data => setCompanyList(data.result));
                                }
                            }}
                            options={companyList?.map((company) => {
                                return {
                                    label: company.companyName,
                                    value: company.companyId
                                }
                            })}
                        />
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
                                    requestToApi.post("/v1/apps/refbooks/capclass/getlist",
                                        {
                                            namedFilters:[{name:"capClassTypeId", value:2}],
                                            rowCount:10,
                                            page:1,
                                            orderBy:'capclassName'
                                        })
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
                </Form>
            </Modal>
            <Table
                dataSource={activityList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.activityId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.activityId)
                    },
                })}/>
        </div>
    )
}