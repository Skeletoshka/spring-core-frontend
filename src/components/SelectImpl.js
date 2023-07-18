import { Select } from 'antd';
import React from 'react';

const SelectImpl = (source)=>{
    return(
        <Select 
            defaultActiveFirstOption = {true}
            value = {source.value}
            allowClear = {true}
            name={source.name}
            placeholder={source.placeholder}
            rules={source.rules}
            onChange={source.onChange}
            onClick={source.onClick}
            options={source.options}
            defaultValue={source.value!==undefined?{
                value: source.value,
                label: source.label
            }:undefined}
            style={source.style}
            className={source.className}
        />
    )
}
export default SelectImpl;