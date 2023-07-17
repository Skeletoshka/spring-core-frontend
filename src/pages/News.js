import React, {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {requestToApi} from "../components/Request";
import {Button, Form, Input, Modal, Table} from "antd";
import PageHeader from "../components/PageHeader";
import DocumentStatus from "../components/DocumentStatus";
import TextArea from "antd/es/input/TextArea";

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
        title: "Титул новости",
        dataIndex: "newsTitle",
        key: "newsTitle"
    },
    {
        title: "Текст новости",
        dataIndex: "newsText",
        key: "newsText"
    },
    {
        title: "Номер документа для новости",
        dataIndex: "documentRealNumber",
        key: "documentRealNumber"
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'newsId'
}

export default function News() {
    const [newsList, setNewsList] = useState([])
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
            requestToApi.post("/v1/apps/dnk/document/news/getlist", GridDataOption)
                .then(data => {
                    setNewsList(data.result);
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
        requestToApi.post("/v1/apps/dnk/document/news/get", id)
            .then(data => {
                setId(data.newsId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })));
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.newsId = id;
            requestToApi.post("/v1/apps/dnk/document/news/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/document/news/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    function setPublic(){
        requestToApi.post("/v1/apps/dnk/document/news/setstatus/public", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    function setArchive(){
        requestToApi.post("/v1/apps/dnk/document/news/setstatus/archive", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    let buttons = [
        <Button onClick={setPublic}>Опубликовать</Button>,
        <Button onClick={setArchive}>Архивировать</Button>,
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => edit(null)}>Добавить</Button>
    ]

    return (
        <div>
            <PageHeader
                title={"Новости"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение новости"
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
                    id={"newsId"}
                    layout={"vertical"}
                    name="formRegistry"
                    style={{padding: 20}}>
                    <Form.Item
                        name="newsTitle"
                        label="Титул новости"
                        rules={[
                            {
                                required: true,
                                message: "Титул новости не может быть пустым"
                            }
                        ]}>
                        <Input name="newsTitle"
                               placeholder="Титул новости"/>
                    </Form.Item>
                    <Form.Item
                        name="newsText"
                        label="Текст новости"
                        rules={[
                            {
                                required: true,
                                message: "Текст новости не может быть пустым"
                            }
                        ]}>
                        <TextArea name="newsText"
                                  maxLength={5000}
                                  style={{
                                      height: 120,
                                      resize: 'yes',
                                  }}
                               placeholder="Текст новости"/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={newsList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.newsId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.newsId)
                    },
                })}
                pagination={pagination}/>
        </div>
    )
}