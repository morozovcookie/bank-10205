import React from 'react'

var HintUserRow = React.createClass({
    render: function(){
        var fullname = this.props.data.last_name + ' ' + this.props.data.first_name;
        return (
            <div className="row" onClick={this.props.Click}>
                <div className="col-md-2">
                    <span className="glyphicon glyphicon-user"></span>
                </div>
                <div className="col-md-4">
                    <b>
                        {this.props.data.username}
                    </b>
                </div>
                <div className="col-md-6">
                    {fullname}
                </div>
            </div>
        );
    }
});

module.exports = React.createClass({
    render: function(){
        if (this.props.Users.length == 0)
        {
            return (
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-10">
                            Совпадений не обнаружено
                        </div>
                    </div>
                </div>
            );
        }
        var idx = 0;
        var users = this.props.Users.map(function(user){
            idx = idx + 1;
            return (
                <HintUserRow key={idx} data={user} Click={this.props.Click} />
            );
        }, this);
        return (
            <div className="col-md-12" style={{padding:'0'}}>
                {users}
            </div>
        );
    }
});

