import { Select } from 'antd';
import React from 'react';

const SelectImpl = (source)=>{
    return(
        <Select 
            name={source.name}
            placeholder={source.placeholder}
            rules={source.rules}
            onChange={source.onChange}
            onClick={source.onClick}
            options={source.options}
            defaultValue={{
                value: source.value,
                lavel: source.label
            }}
            
        />
    )
}
export default SelectImpl;