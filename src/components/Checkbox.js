import { Checkbox } from 'antd';
import React, { useState } from 'react';

const CheckBox = (source)=>{
    return(
        <Checkbox 
            name={source.name}
            placeholder={source.placeholder}
            defaultChecked={source.value===1}
            rules={source.rules}
            onChange={source.onChange}
        >{source.text}</Checkbox>
    )
}
export default CheckBox;