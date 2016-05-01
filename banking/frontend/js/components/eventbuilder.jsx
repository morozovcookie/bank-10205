import React from 'react'

import Edit              from './edit'
import Dropdown          from './dropdown.jsx'
import AccessCheckbox    from './accesscheckbox.jsx'
import Button            from './button.jsx'
import ParticipantsTable from './participantstable.jsx'
import {postCSRF}        from '../utils/csrf.js'
import EventTable        from './eventtable.jsx'

module.exports = React.createClass({
    getInitialState: function(){
        var account = JSON.parse(window.localStorage.getItem('user'));

        return {
            title: this.props.BaseInformation.title,
            date: this.props.BaseInformation.date,
            sum: this.props.BaseInformation.sum,
            type: this.props.BaseInformation.type,
            template: this.props.BaseInformation.template,
            private: false,
            author: account,
            participants: [],
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
        var participants = [];
        this.state.participants.forEach(function(p) {
            participants.push({parts: p.rate, account: p.user.id});
        });
        console.log("before post:" + JSON.stringify(participants));

        postCSRF({
            type: 'post',
            url: '/api/events/',
            headers: {
                Authorization: 'Token ' + window.localStorage.getItem('token')
            },
            data: JSON.stringify({
                name: this.state.title,
                type: this.state.type,
                date: this.state.date,
                price: this.state.sum,
                author: this.state.author.user.id,
                private: this.state.private,
                participants: participants,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(response){
                console.log(response);
                document.location.href = '/events/';
            }
        });
    },
    componentDidMount: function(){
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
        var author = this.state.author.user;
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
                                <Edit
                                    Label="Название"
                                    Type="text"
                                    Value={this.state.title}
                                    LabelId="event-title-label"
                                    EditId="event-title-input"
                                    FormName="new-event-form"
                                    Change={this.handleTitleChange} />
                                <Dropdown
                                    Caption="Тип"
                                    Id="event-type-btn"
                                    Value={this.state.type}
                                    Change={this.handleTypeChange}
                                    FormName="new-event-form"
                                    DropdownList={events}/>
                                <Edit
                                    Label="Дата"
                                    Type="date"
                                    Value={this.state.date}
                                    LabelId="event-date-label"
                                    EditId="event-date-input"
                                    FormName="new-event-form"
                                    Change={this.handleDateChange} />
                                <Edit
                                    Label="Сумма"
                                    Type="text"
                                    Value={this.state.sum}
                                    LabelId="event-sum-label"
                                    EditId="event-sum-input"
                                    FormName="new-event-form"
                                    Change={this.handleSumChange} />

                                <div className="row">
                                    <div className="col-md-1"></div>
                                    <label className="col-md-3" form="new-event-form">Создатель</label>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-7" style={{padding:'10px'}}>
                                        <a href={"/users/" + author.id}>
                                            {author.username}
                                        </a>
                                    </div>
                                </div>

                                <div className="row">
                                    <ul id="access-event">
                                        <AccessCheckbox IconClass="glyphicon glyphicon-book event-icon" AccessId="public" Header="Public" Caption="Данное событие будет видно всем" Change={this.handleChangeAccess} />
                                        <AccessCheckbox IconClass="glyphicon glyphicon-lock event-icon" AccessId="private" Header="Private" Caption="Данное событие будет видно только создателю и участникам" Change={this.handleChangeAccess} />
                                    </ul>
                                </div>

                                <ParticipantsTable/>,

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

