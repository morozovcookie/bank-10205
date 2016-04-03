import React from 'react';

class ParticipantRow extends React.Component {
    render() {
        if (this.props.Id == 1)
        {
            return (
                <tr>
                    <td> <span className="glyphicon glyphicon-user"></span> </td>
                    <td> <b> {this.props.data.username} </b> </td>
                    <td> {this.props.data.fullname} </td>
                    <td> <input type="text" className="form-control" id="part" defaultValue="0.0" /> </td>
                    <td> <input type="text" className="form-control" id="sum" defaultValue="0.0" readOnly /> </td>
                </tr>
            );
        }
        return (
            <tr>
                <td> <span className="glyphicon glyphicon-user"></span> </td>
                <td> <b> {this.props.data.username} </b> </td>
                <td> {this.props.data.fullname} </td>
                <td> <input type="text" className="form-control" id="part" defaultValue="0.0" /> </td>
                <td> <input type="text" className="form-control" id="sum" defaultValue="0.0" readOnly /> </td>
                <td> <a href="#" className="btn btn-danger" onClick={this.props.Click} >
                        <span className="glyphicon glyphicon-trash"></span>
                    </a>
                </td>
            </tr>
        );
    }
}

export default class ParticipantsTable extends React.Component {
    render(){
        var participants = this.props.Participants.map(function(p){
            return (
                <ParticipantRow key={p.id} data={p} Id={p.id} Click={this.props.Click} />
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


