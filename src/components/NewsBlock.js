import React, {Component} from 'react';

const NewsBlock = (source)=>{

    return(
        <div className='news'>
            <h2>{source.title}</h2>
            <p>{source.text}</p>
        </div>
    )
}
export default NewsBlock;