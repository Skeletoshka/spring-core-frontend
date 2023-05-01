import React from 'react';

const DocumentStatus = (source)=>{
    const gradientId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    return(
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 64 64"} height={"25px"}>
                <radialGradient gradientUnits="userSpaceOnUse" cx="24" cy="24" r="16" id={"RadialGradient" + gradientId} spreadMethod="pad">
                    <stop offset="0" stopColor="white" />
                    <stop offset="1" stopColor={'#' + source.color} />
                </radialGradient>
                <circle cx="32" cy="32" r="32" fill={"url(#RadialGradient" + gradientId + ")"} />
            </svg>
    )
}
export default DocumentStatus;