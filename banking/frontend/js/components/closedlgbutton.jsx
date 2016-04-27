import React from 'react'

export default class CloseDlgButton extends React.Component{
    render(){
        return (
            <a href={this.props.Link} className={this.props.Class} id={this.props.Id} onClick={this.props.Click} data-dismiss="modal" aria-hidden="true">
                <span className="glyphicon glyphicon-ok"></span> {this.props.Caption}
            </a>
        );
    }
}
