import React from 'react';

export function MoneyCell(props) {
    const offset = { paddingLeft: (props.value > 0 ? "5px" : "0px") };
    return (<span className={props.className} style={offset}> {Number(props.value).toFixed(2)} </span>);
}
