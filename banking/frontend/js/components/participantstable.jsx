import React from 'react';

class ParticipantRow extends React.Component {
    render() {
        var user = this.props.data.user;
        user.fullname = user.first_name + " " + user.last_name;
        return (
            <tr>
                <td> <span className="glyphicon glyphicon-user"></span> </td>
                <td> <b> {user.username} </b> </td>
                <td> {user.fullname} </td>
                <td> <input type="text" className="form-control col-md-1 col-sm-1" id="part" defaultValue="0.0" /> </td>
                <td> <input type="text" className="form-control col-md-1 col-sm-1" id="sum" defaultValue="0.0" readOnly /> </td>
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
        // console.log("Participants table: " + JSON.stringify(this.props.Participants));
        var participants = this.props.Participants.map(function(p){
            return (
                <ParticipantRow key={p.user.id} data={p} Id={p.user.id} Click={this.props.Click} />
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


