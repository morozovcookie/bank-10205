import React from 'react';

export default function(props) {
    const offset = { paddingLeft: (props.value > 0 ? "5px" : "0px") };
    return (<span className={props.className} style={offset}> {props.value} </span>);
}
