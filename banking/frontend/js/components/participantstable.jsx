import React from 'react';
import ReactDOM from 'react-dom'

import Edit              from './edit'
import HintUserList      from './hintuserlist.jsx'

/** Show given participants as table, and provide input for parts. Also
 * dinamicly calculates pay-sum stands on event price and parts for each
 * participant.
 * You can fetch participants with them parts: use string refs an fetch
 * state.participants.
 @param {Array} participants participants list.
 Each element shape: {account: Account, parts: Integer}.
 */
export default class ParticipantsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = { participants: [] };

        this.handleChangeParts = this.handleChangeParts.bind(this);
        this.handleHideUsersHint = this.handleHideUsersHint.bind(this);
        this.handleRemoveParticipant = this.handleRemoveParticipant.bind(this);
        this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
        this.handleSelectParticipant = this.handleSelectParticipant.bind(this);
    }

    handleChangeParts(participant) {
        var participants = this.state.participants;
        participants.find( (p) => {
            return p.account.user.id === participant.account.user.id;
        }).parts = participant.parts;

        this.setState({ participants: participants });
    }

    handleHideUsersHint() {
        if (!$('#userautolist:hover').length)
            $('#userauto').hide();
    }

    handleSelectParticipant(account) {
        this.setState({
            participants: this.state.participants.concat({account: account,
                                                          parts: 1.0})
        });
        $('#event-participants-input').val('');
        $('#userauto').hide();
    }

    handleParticipantsChange(event) {
        var pattern = event.target.value;
        if (pattern != '')
        {
            var self = this;
            $.ajax({
                type: 'get',
                url: '/api/users/',
                data: {'search': pattern},
                headers: {
                    Authorization: 'Token ' + window.localStorage.getItem('token')
                },
                dataType: 'json',
                success: function(response){
                    var matched_users = [];
                    if (!Array.isArray(response))
                        response = [];
                    response.forEach(function(user){
                        var already_participated = false;
                        self.state.participants.forEach(function(participant){
                            if (participant.account.user.id === user.user.id)
                            {
                                already_participated = true;
                                return;
                            }
                        });
                        if (!already_participated) {
                            matched_users.push(user);
                        }
                    });
                    ReactDOM.render(
                        <HintUserList Users={matched_users}
                            Click={self.handleSelectParticipant} />,
                        document.getElementById('userautolist')
                    );
                    $('#userauto').show();
                }
            });
        }
        else
			$('#userauto').hide();
    }

    handleRemoveParticipant(account) {
		// leave participants, that not equal to given
		const participants = this.state.participants.filter((e) => {
			return e.account.user.id != account.user.id;
		});
		this.setState({participants: participants});
    }

    render(){
        var participants = this.state.participants.map(function(p){
            return (
                <ParticipantRow key={p.account.user.id} Id={p.account.user.id}
                    account={p.account}
                    onRemove={this.handleRemoveParticipant}
                    onPartsChange={this.handleChangeParts} />
            );
        }, this);

        return (
            <div className="row">
                <Edit
                    Label="Участники"
                    Type="text"
                    LabelId="event-participants-label"
                    EditId="event-participants-input"
                    FormName="new-event-form"
                    Change={this.handleParticipantsChange}
                    Blur={this.handleHideUsersHint}
                    Focus={this.handleParticipantsChange}
                />

                <div className="row" id="userauto">
                    <div className="col-md-3"></div>
                    <div className="col-md-8" id="userautolist"></div>
                    <div className="col-md-1"></div>
                </div>
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
            </div>
        );
    }
}

class ParticipantRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleChangeParts = this.handleChangeParts.bind(this);
    }
    handleChangeParts(e) {
        this.props.onPartsChange({
            account: this.props.account,
            parts: e.target.value
        });
    }
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
                <td> <FloatInput id="parts" value={this.props.parts} onChange={this.handleChangeParts}/> </td>
                <td> <FloatView id="sum" defaultValue="0.00"/> </td>
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
