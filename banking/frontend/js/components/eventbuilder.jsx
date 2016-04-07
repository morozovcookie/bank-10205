import React from 'react'
import ReactDOM from 'react-dom'

import Edit              from './edit'
import Dropdown          from './dropdown.jsx'
import AccessCheckbox    from './accesscheckbox.jsx'
import Button            from './button.jsx'
import ParticipantsTable from './participantstable.jsx'
import HintUserList      from './hintuserlist.jsx'

module.exports = React.createClass({
    getInitialState: function(){
        var user = JSON.parse(window.localStorage.getItem('user'));
        user.fullname =
            JSON.parse(window.localStorage.getItem('user')).last_name
            + ' '
            + JSON.parse(window.localStorage.getItem('user')).first_name;

        return {
            title: this.props.BaseInformation.title,
            date: this.props.BaseInformation.date,
            sum: this.props.BaseInformation.sum,
            type: this.props.BaseInformation.type,
            template: this.props.BaseInformation.template,
            private: false,
            participants: [user],
            fd: new FormData()
        }
    },
    handleTitleChange: function(event){
        this.setState({
            title: event.target.value
        });
    },
    handleTypeChange: function(event){
        this.setState({
            type: $($(event.currentTarget).children()[0]).html()
        });
    },
    handleDateChange: function(event){
        this.setState({
            date: event.target.value
        });
    },
    handleSumChange: function(event){
        this.setState({
            sum: parseFloat(event.target.value)
        });
    },
    handleSelectParticipant: function(event){
        var participants = this.state.participants;
        participants.push({
            username: $($($(event.currentTarget).children()[1]).children()[0]).html(),
            fullname: $($(event.currentTarget).children()[2]).html()
        });
        ReactDOM.render(
            <ParticipantsTable Participants={this.state.participants} Click={this.handleRemoveParticipant} />,
            document.getElementById('participant-table')
        );
        $('#event-participants-input').val('');
        $('#userauto').hide();
    },
    handleParticipantsChange: function(event){
        var pattern = event.target.value;
        if (pattern != '')
        {
            var eventBuilder = this;
            $.ajax({
                type: 'get',
                url: '/api/users/',
                data: {'username': pattern},
                headers: {
                    Authorization: 'Token ' + window.localStorage.getItem('token')
                },
                dataType: 'json',
                success: function(response){
                    var users = [];
                    if (!Array.isArray(response))
                        response = [];
                    response.forEach(function(user){
                        var result = false;
                        var user_str = JSON.stringify({
                            username: user.username,
                            fullname: user.last_name + ' ' + user.first_name
                        });
                        eventBuilder.state.participants.forEach(function(participant){
                            if (JSON.stringify(participant)===user_str)
                            {
                                result = true;
                                return;
                            }
                        });
                        if (!result)
                            users.push(user);
                    });
                    ReactDOM.render(
                        <HintUserList Users={users} Click={eventBuilder.handleSelectParticipant} />,
                        document.getElementById('userautolist')
                    );
                    $('#userauto').show();
                }
            });
        }
        else
			$('#userauto').hide();
    },
    handleHideUsersHint: function(){
        if (!$('#userautolist:hover').length)
			$('#userauto').hide();
    },
    handleChangeFile: function(event){
        console.log(event.target.files);
        var Files = event.target.files;
        for (var i = 0; i != Files.length; ++i)
            this.state.fd.append('file' + (i+1), Files[i]);
    },
    handleAttachFileClick: function(){
        $('form[name="new-event-form"] input[type="file"]').trigger('click');
    },
    hadnleCancelClick: function(){
        document.location.href = '/events/';
    },
    hadnleCreateClick: function(){
        console.log(this.state);
        /*
            POST
            /api/event
        */
        postCSRF({
            type: 'post',
            url: '/api/events/',
            headers: {
                Authorization: 'Token ' + window.localStorage.getItem('token')
            },
            data: {
                name: this.state.title,
                type: this.state.type,
                date: this.state.date,
                price: this.state.sum,
                author: JSON.parse(window.localStorage.getItem('user')).id,
                private: this.state.private,
            },
            success: function(response){
                console.log(response);
                //document.location.href = '/events/';
            }
        });
    },
    handleRemoveParticipant: function(event){
        var row = $(event.currentTarget).parents()[1];
        var participant = JSON.stringify({
            username: $($($(row).children()[1]).children()[0]).text(),
            fullname: $($(row).children()[2]).text()
        });
        var idx = 0;
        var participants = this.state.participants;
        participants.forEach(function(elem){
            if (JSON.stringify(elem) === participant)
                return;
            ++idx;
        }, this);
        delete participants[idx];
        ReactDOM.render(
            <ParticipantsTable Participants={this.state.participants} Click={this.handleRemoveParticipant} />,
            document.getElementById('participant-table')
        );
    },
    componentDidMount: function(){
        ReactDOM.render(
            <ParticipantsTable Participants={this.state.participants} Click={this.handleRemoveParticipant} />,
            document.getElementById('participant-table')
        );
        $('#public').prop('checked', true);
        $('input[type=file]').prop('multiple', true);
    },
    handleChangeAccess: function(event){
        var target = $(event.target).prop('id');
        if (target === 'public')
        {
            this.setState({
                private: false
            });
            $('#public').prop('checked', true);
            $('#private').prop('checked', false);
        }
        else
        {
            this.setState({
                private: true
            });
            $('#private').prop('checked', true);
            $('#public').prop('checked', false);
        }
    },
    render: function(){
        var events = ['Перевод', 'Пополнение', 'Списание'];
        var owner = JSON.parse(window.localStorage.getItem('user')).last_name +
            ' ' +
            JSON.parse(window.localStorage.getItem('user')).first_name;
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-10">
                        <h3>Новое событие</h3>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <div className="row" style={{marginTop:'20px'}}>
                    <div className="col-md-1"></div>
                    <div className="col-md-6">
                        <form className="form-horizontal" name="new-event-form" type="post" encType="multipart">
                            <fieldset style={{position:'relative'}}>
                                <Edit Label="Название" Type="text" Value={this.state.title} LabelId="event-title-label" EditId="event-title-input" FormName="new-event-form" Change={this.handleTitleChange} />
                                <Dropdown Id="event-type-btn" Value={this.state.type} Change={this.handleTypeChange} Caption="Тип" FormName="new-event-form" DropdownList={events}/>
                                <Edit Label="Дата" Type="date" Value={this.state.date} LabelId="event-date-label" EditId="event-date-input" FormName="new-event-form" Change={this.handleDateChange} />
                                <Edit Label="Сумма" Type="text" Value={this.state.sum} LabelId="event-sum-label" EditId="event-sum-input" FormName="new-event-form" Change={this.handleSumChange} />

                                <div className="row">
                                    <div className="col-md-1"></div>
                                    <label className="col-md-3" form="new-event-form">Создатель</label>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-7" style={{padding:'10px'}}>{owner}</div>
                                </div>

                                <div className="row">
                                    <ul id="access-event">
                                        <AccessCheckbox IconClass="glyphicon glyphicon-book event-icon" AccessId="public" Header="Public" Caption="Данное событие будет видно всем" Change={this.handleChangeAccess} />
                                        <AccessCheckbox IconClass="glyphicon glyphicon-lock event-icon" AccessId="private" Header="Private" Caption="Данное событие будет видно только создателю и участникам" Change={this.handleChangeAccess} />
                                    </ul>
                                </div>

                                <Edit Label="Участники" Type="text" LabelId="event-participants-label" EditId="event-participants-input" FormName="new-event-form" Change={this.handleParticipantsChange} Blur={this.handleHideUsersHint} Focus={this.handleParticipantsChange} />

                                <div className="row" id="userauto">
                                    <div className="col-md-3"></div>
                                    <div className="col-md-8" id="userautolist"></div>
                                    <div className="col-md-1"></div>
                                </div>

                                <div id="participant-table"></div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div id="files-list"></div>
                                    </div>
                                </div>

                                <div className="button-group row" style={{paddingRight:'20px'}}>
                                    <Edit Type="file" LabelId="file-attach-label" Id="file-attach-input" FormName="new-event-form" Change={this.handleChangeFile}/>
                                    <Button Link="#" Class="btn btn-default" Id="attach-file-button" Icon="glyphicon glyphicon-paperclip" Caption="Прикрепить файл" Click={this.handleAttachFileClick}/>
                                </div>

                                <div className="button-group row" style={{paddingRight:'20px'}}>
                                    <Button Link="#" Class="btn btn-danger" Id="cancel-event-button" Icon="glyphicon glyphicon-thumbs-down" Caption="Отменить" Click={this.hadnleCancelClick}/>
                                    <Button Link="#" Class="btn btn-success" Id="save-event-button" Icon="glyphicon glyphicon-thumbs-up" Caption="Создать" Click={this.hadnleCreateClick}/>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className="col-md-5"></div>
                </div>
            </div>
        );
    }
});

