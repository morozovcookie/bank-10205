import React from 'react';

export default class ParticipantsTable extends React.Component {
    render(){
        var participants = this.props.Participants.map(function(p){
            return (
                <ParticipantRow key={p.user.id} Id={p.user.id}
                    account={p} onRemove={this.props.onRemove} />
            );
        }, this);
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Логин</th>
                        <th>Полное имя</th>
                        <th>Доля</th>
                        <th>Итог</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {participants}
                </tbody>
            </table>
        );
    }
}

class ParticipantRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parts: 1.0,
            sum: 0.0,
        };
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }
    handleChangeParts(e) { setState({ parts: e.target.value }); }
    handleRemoveClick(e) {
        const acc = this.props.account;
        this.props.onRemove(acc);
    }

    render() {
        var user = this.props.account.user;
        user.fullname = user.first_name + " " + user.last_name;
        return (
            <tr>
                <td> <span className="glyphicon glyphicon-user"></span> </td>
                <td> <b> {user.username} </b> </td>
                <td> {user.fullname} </td>
                <td> <FloatInput id="parts" value={this.state.parts} onChange={this.handleChangeParts}/> </td>
                <td> <FloatView id="sum" defaultValue="0.00" value={this.state.sum}/> </td>
                <td>
                    <button className="btn btn-danger" onClick={this.handleRemoveClick}>
                        <span className="glyphicon glyphicon-trash"></span>
                    </button>
                </td>
            </tr>
        );
    }
}

class FloatInput extends React.Component {
    render() { return (
        <input type="number" step="0.1" defaultValue="1.0"
            className="form-control col-md-1 col-sm-1"
            {...this.props}/>
    );}
}

class FloatView extends React.Component {
    render() { return (
        <input type="text" readOnly
            className="form-control col-md-1 col-sm-1"
            {...this.props}
        />
    );}
}
