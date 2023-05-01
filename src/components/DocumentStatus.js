import React from 'react';

const DocumentStatus = (source)=>{
    const gradientId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    return(
        <div style={{height: '40px'}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 64 64"}>
                <radialGradient gradientUnits="userSpaceOnUse" cx="24" cy="16" r="10" id={"RadialGradient" + gradientId} spreadMethod="pad">
                    <stop offset="0" stopColor="white" />
                    <stop offset="1" stopColor={'#' + source.color} />
                </radialGradient>
                <circle cx="28" cy="20" r="16" fill={"url(#RadialGradient" + gradientId + ")"} />
            </svg>
        </div>
    )
}
export default DocumentStatus;