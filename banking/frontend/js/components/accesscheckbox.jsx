import React from 'react'

export default class AccessCheckbox extends React.Component{
    render(){
        return (
            <li className="col-md-12">
                <div className="col-md-1">
                    <input type="checkbox" id={this.props.AccessId} onChange={this.props.Change}/>
                </div>
                <div className="col-md-1">
                    <span className={this.props.IconClass}></span>
                </div>
                <div className="col-md-10">
                    <h4>{this.props.Header}</h4>
                    <p>{this.props.Caption}</p>
                </div>
            </li>
        );
    }
}

