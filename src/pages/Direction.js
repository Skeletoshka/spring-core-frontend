import { Button, Modal, Table, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";

const columns = [
    {
        title: "Наименование направления",
        dataIndex: "directionName",
        key: "directionName"
    },
    {
        title: "Описание направления",
        dataIndex: "directionDesc",
        key: "directionDesc"
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'directionId'
}

export default function Direction() {
    const [directionList, setDirectionList] = useState([])
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
            requestToApi.post("/v1/apps/dnk/refbooks/direction/getlist", GridDataOption)
                .then(data => {
                    setDirectionList(data.result);
                    pagination.total = data.allRowCount;
                    pagination.current = data.page;
                    pagination.pageSize = data.rowCount;
                })
                .finally(() => setLoading(false));
        }
    }, [loading])

    function reload(){
        setLoading(true);
    }

    function cancel(){
        setShow(false);
    }

    function edit(id){
        requestToApi.post("/v1/apps/dnk/refbooks/direction/get", id)
            .then(data => {
                setId(data.directionId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })));
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.directionId = id;
            requestToApi.post("/v1/apps/dnk/refbooks/direction/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/refbooks/direction/delete", selectedRowKeys)
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
                title={"Направления"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение направления"
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
                    id={"directionId"}
                    layout={"vertical"}
                    name="formRegistry"
                    style={{padding: 20}}>
                    <Form.Item
                        name="directionName"
                        label="Название направления"
                        rules={[
                            {
                                required: true,
                                message: "Название направления не может быть пустым"
                            }
                        ]}>
                        <Input name="directionName"
                               placeholder="Название направления"/>
                    </Form.Item>
                    <Form.Item
                        name="directionDesc"
                        label="Описание направления">
                        <Input name="directionDesc"
                               placeholder="Описание направления"/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={directionList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.directionId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.directionId)
                    },
                })}
                pagination={pagination}/>
        </div>
    )

}