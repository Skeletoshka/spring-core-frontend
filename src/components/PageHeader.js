import {ArrowLeftOutlined} from '@ant-design/icons'
import {Button} from "antd";
import { useNavigate } from 'react-router-dom';

const PageHeader = (source) => {
    const navigate = useNavigate();
    return(
        <div className={"pageHeaderDiv"} style={source.style}>
            <div className={"pageHeaderDivChild"}>
                <Button icon={<ArrowLeftOutlined/>} onClick={() => navigate(-1)}/>
                <div className={"titleH1"}><b>{source.title}</b></div>
            </div>
            <div className={"filters"}>
                {source.filters}
            </div>
            <div className={"titleButtons"}>{source.buttons}</div>
        </div>
    )
}

export default PageHeader; 