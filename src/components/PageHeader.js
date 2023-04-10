import {ArrowLeftOutlined} from '@ant-design/icons'
import {Button} from "antd";

const PageHeader = (source) => {
    return(
        <div className={"pageHeaderDiv"}>
            <div className={"pageHeaderDivChild"}>
                <Button icon={<ArrowLeftOutlined/>} onClick={window.history.back}/>
                <div className={"titleH1"}><b>{source.title}</b></div>
            </div>
            <div className={"titleButtons"}>{source.buttons}</div>
        </div>
    )
}

export default PageHeader;