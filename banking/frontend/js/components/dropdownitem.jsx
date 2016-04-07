import React from 'react'

export default class DropdownItem extends React.Component{
    render(){
        return (
            <li onClick={this.props.Click}>
                <a href="javascript:void(0)">{this.props.data}</a>
            </li>
        );
    }
}

