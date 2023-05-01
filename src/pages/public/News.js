import React, {useEffect, useState} from "react";
import {requestToApi} from "../../components/Request";
import {Pagination} from "antd";
import PageHeader from "../../components/PageHeader";
import NewsBlock from "../../components/NewsBlock";

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'documentRealDateCreate'
}

export default function NewsPublic() {
    const [newsList, setNewsList] = useState([])
    const [loading, setLoading] = useState(true)
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
            setLoading(true);
        }
    })

    useEffect(() => {
        requestToApi.post("/security/v1/apps/dnk/document/news/getlist", GridDataOption)
            .then(data => {
                setNewsList(data.result?.map(news => {
                    return <NewsBlock title={news.newsTitle} text={news.newsText}/>
                }));
                pagination.total = data.allRowCount;
                pagination.current = data.page;
                pagination.pageSize = data.rowCount;
            })
            .finally(() => setLoading(false));
    }, [loading])

    let buttons = []

    return (
        <div>
            <PageHeader
                title={"Новости"}
                buttons={buttons}
            />
            {newsList}
            <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                showSizeChanger={pagination.showSizeChanger}
                showTotal={pagination.showTotal}
                onChange={pagination.onChange}
            />
        </div>
    )
}