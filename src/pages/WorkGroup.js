import {Button, Modal, Table, Form, Input, Select} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";

const columns = [
    {
        title: "Наименование",
        dataIndex: "workGroupName",
        key: "workGroupName"
    },
    {
        title: "Описание",
        dataIndex: "workGroupDesc",
        key: "workGroupDesc"
    },
    {
        title: "Наименование направления",
        dataIndex: "directionName",
        key: "directionName"
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'workGroupId'
}

export default function WorkGroup() {
    const [workGroupList, setWorkGroupList] = useState([])
    const [directionList, setDirectionList] = useState([])
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState(undefined)
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

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    useEffect(() => {
        requestToApi.post("/v1/apps/dnk/objects/workgroup/getlist", GridDataOption)
            .then(data => {
                setWorkGroupList(data.result);
                pagination.total = data.allRowCount;
                pagination.current = data.page;
                pagination.pageSize = data.rowCount;
            })
            .finally(() => setLoading(false));
    }, [loading])

    function reload(){
        setLoading(true);
    }

    function cancel(){
        setShow(false);
    }

    function edit(id){
        requestToApi.post("/v1/apps/dnk/objects/workgroup/get", id)
            .then(data => {
                setId(data.workGroupId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })));
                form.setFieldValue("workGroupName", "workGroupName")
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.workGroupId = id;
            requestToApi.post("/v1/apps/dnk/objects/workgroup/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/workgroup/delete", selectedRowKeys)
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
                title={"Учебные группы"}
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
                        name="workGroupName"
                        label="Название группы"
                        rules={[
                            {
                                required: true,
                                message: "Название группы не может быть пустым"
                            }
                        ]}>
                        <Input name="workGroupName"
                               placeholder="Название группы обучения"/>
                    </Form.Item>
                    <Form.Item
                        name="workGroupDesc"
                        label="Описание группы">
                        <Input name="workGroupDesc"
                               placeholder="Описание группы"/>
                    </Form.Item>
                    <Form.Item
                        name="directionId"
                        label="Направление"
                        rules={[
                            {
                                required: true,
                                message: "Направление не может быть пустой"
                            }
                        ]}>
                        <Select
                            name="directionId"
                            placeholder="Направление"
                            onClick={() => {
                                if(directionList.length === 0) {
                                    requestToApi.post("/v1/apps/dnk/refbooks/direction/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'directionId'
                                    })
                                        .then(data => {
                                            setDirectionList(data.result)
                                        });
                                }
                            }}
                            options={directionList?.map((direction) => {
                                return {
                                    label: direction.directionName,
                                    value: direction.directionId
                                }
                            })}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={workGroupList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.workGroupId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.workGroupId)
                    },
                })}
                pagination={pagination}/>
        </div>
    )

}