import React from 'react'

import DropdownItem from './dropdownitem.jsx'

module.exports = React.createClass({
    render: function(){
        var idx = 0;
        var dropdown_list = this.props.DropdownList.map(function(item){
            idx = idx + 1;
            return (
                <DropdownItem key={idx} data={item} Click={this.props.Change} />
            );
        });
        return (
            <div className="row">
                <div className="col-md-1"></div>
                <label className="col-md-3" form={this.props.FormName}>{this.props.Caption}</label>
                <div className="col-md-8">
                    <div className="btn-group">
                        <button type="button" className="btn btn-default" id={this.props.Id}>{this.props.Value}</button>
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="caret"></span>
                            <span className="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu">
                            <DropdownItem key={idx} data={'Без шаблона'} />
                            <li className="divider"></li>
                            {dropdown_list}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});
