var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var EventTable = require('./eventtable');

/**
 * @param {string} url - path for get request
 * @param {func} succ - success handler. function(response)
 * @returns {undefined}
 */
function _get(url, succ) {
    return $.ajax({
        type: 'get',
        url: url,
        headers: {
            Authorization: 'Token ' + window.localStorage.getItem('token')
        },
        dataType: 'json',
		success: succ
    });
}

/** Editable element have many fields that can be edited.
* @param {Array} values - list of elements, that can be edited
*/
var EditableElement = React.createClass({
    getInitialState: function() {
        return {
            value: 0
        };
    },
    render: function() {
        return (
            <div>
                {content}
                <div>
                    <button className="btn btn-yellow"></button>
                    <button className="btn"></button>
                </div>
            </div>

        );
    }
});

/** Show list of components, with additional actions - edit, delete, add.
 * Useful for display EditableElement
 * Element should have propsValidations: it's used for creating new element
 * checking.
*/
var EditableParticipantsList = React.createClass({
    propTypes: {
        // updater: React.PropTypes.func.isRequired
        /** URL of element, on which we call update.
        */
        url: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            items: []
        };
    },
    componentDidMount: function() {
        _get( this.props.url,
             function(response){
                 this.setState({ items: response })
             }.bind(this)
        );
    },
    addItem: function(item) {
        // this.setState({ items: this.state.items + item });
    },
    removeItem: function(item) {
        // this.state.items.removeOne(item);
        // remove item from list
    },
    render: function() {
        var content = this.state.items.map(function(i){
            return (
                <li className="list-group-item" key={i.user.id}>
                    <span>ID: {i.user.id}</span>
                    <span>Rate: {i.rate}</span>
                    <span>Username: {i.user.username}</span>
                </li>
            );
        });
        return (
            <ul className="list-group">
                {content}
            </ul>
        );
    }
});

/** Display single element. On click, this dropdown it's hidden content.
* @param {Object} event - Event, that was displayed
*/
var EventSection = React.createClass({
    propTypes: {
        /** Expect, that given only 2 childrens: header and content for
         * dropdown. */
        children: function(props, propName, componentName){
            if (React.Children.count(props[propName]) < 2) {
                return new Error("EventSection takes 2 childrens: "
                                 +"header, and dropdown content");
            }
        },
    },
    getInitialState: function(){
        return {
            open: false,
            class: "section",
        }
    },
	render: function() {
        var content;
        if (this.state.open) {
            content = this.props.children[1]
        }
        return (
			<div className={this.state.class}>
				<div className="sectionhead" onClick={this.handleClick}>
                    {this.props.children[0]}
				</div>
				<div className="articlewrap">
					<div className="article">
                        {content}
					</div>
				</div>
			</div>
		);
	},
	handleClick: function(){
        if(this.state.open) {
            this.setState({ open: false, class: "section" });
        }
        else{
            this.setState({ open: true,  class: "section open" });
        }
	},
});

var CreateEventDlg = React.createClass({
    getInitialState: function(){
        var date = new Date().toISOString().match('([0-9]{4}\-[0-9]{2}\-[0-9]{2})')[0];
        return {
            title: 'Без названия',
            date: date,
            sum: 0.0,
            type: 'Перевод',
            template: 'Без шаблона'
        }
    },
    handleTitleChange: function(event){
        this.setState({
            title: event.target.value
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
    handleTypeChange: function(event){
        this.setState({
            type: $($(event.currentTarget).children()[0]).html()
        });
    },
    handleTemplateChange: function(event){
        this.setState({
            template: $($(event.currentTarget).children()[0]).html()
        });
    },
    handleGoToEventBuilder: function(){
        ReactDOM.render(
            <EventBuilder BaseInformation={this.state} />,
            document.getElementById('event-block')
        );
    },
    render: function(){
        var templates = [];
        var events = ['Перевод', 'Пополнение', 'Списание'];
        return (
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">x</button>
                    <h4 className="modal-title">Новое событие</h4>
                </div>
                <div className="modal-body">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <form className="form-horizontal" name="main-event-info" method="post">
                                <fieldset>
                                    <TemplateDropdown Id="template-title-btn" Value={this.state.template} Change={this.handleTemplateChange} Caption="Шаблон" FormName="main-event-info" DropdownList={templates}/>
                                    <Dropdown Id="event-type-title-btn" Value={this.state.type} Change={this.handleTypeChange} Caption="Тип" FormName="main-event-info" DropdownList={events}/>
                                    <Edit Label="Название" Type="text" Value={this.state.title} LabelId="event-title-label" EditId="event-title-input" FormName="main-event-info" Change={this.handleTitleChange} />
                                    <Edit Label="Дата" Type="date" Value={this.state.date} LabelId="event-date-label" EditId="event-date-input" FormName="main-event-info" Change={this.handleDateChange} />
                                    <Edit Label="Сумма" Type="text" Value={this.state.sum} LabelId="event-sum-label" EditId="event-sum-input" FormName="main-event-info" Change={this.handleSumChange} />
                                </fieldset>
                            </form>
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="col-md-9"></div>
                    <div className="col-md-3">
                        <CloseDlgButton Link="#" Class="btn btn-success" Id="next-step-button" Caption="Создать" Click={this.handleGoToEventBuilder}/>
                    </div>
                </div>
            </div>
        );
    }
});

var EventBuilder = React.createClass({
    getInitialState: function(){
        var user = JSON.parse(window.localStorage.getItem('user'));
        return {
            title: this.props.BaseInformation.title,
            date: this.props.BaseInformation.date,
            sum: this.props.BaseInformation.sum,
            type: this.props.BaseInformation.type,
            template: this.props.BaseInformation.template,
            private: false,
            participants: [{
                username: JSON.parse(window.localStorage.getItem('user')).username,
                fullname: JSON.parse(window.localStorage.getItem('user')).last_name +
                    ' ' +
                    JSON.parse(window.localStorage.getItem('user')).first_name
            }],
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
                url: '/api/user/' + pattern,
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
        $.ajax({
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

var HintUserList = React.createClass({
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

var ParticipantsTable = React.createClass({
    render: function(){
        var participants = this.props.Participants.map(function(p){
            console.log(p);
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
});

var ParticipantRow = React.createClass({
    render: function(){
        if (this.props.Id == 1)
        {
            return (
                <tr>
                    <td>
                        <span className="glyphicon glyphicon-user"></span>
                    </td>
                    <td>
                        <b>
                            {this.props.data.username}
                        </b>
                    </td>
                    <td>
                        {this.props.data.fullname}
                    </td>
                    <td>
                        <input type="text" className="form-control" id="part" defaultValue="0.0" />
                    </td>
                    <td>
                        <input type="text" className="form-control" id="sum" defaultValue="0.0" readOnly />
                    </td>
                </tr>
            );
        }
        return (
            <tr>
                <td>
                    <span className="glyphicon glyphicon-user"></span>
                </td>
                <td>
                    <b>
                        {this.props.data.username}
                    </b>
                </td>
                <td>
                    {this.props.data.fullname}
                </td>
                <td>
                    <input type="text" className="form-control" id="part" defaultValue="0.0" />
                </td>
                <td>
                    <input type="text" className="form-control" id="sum" defaultValue="0.0" readOnly />
                </td>
                <td>
                    <a href="#" className="btn btn-danger" onClick={this.props.Click} >
                        <span className="glyphicon glyphicon-trash"></span>
                    </a>
                </td>
            </tr>
        );
    }
});

var AccessCheckbox = React.createClass({
    render: function(){
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
});

var Dropdown = React.createClass({
    render: function(){
        var idx = 0;
        var dropdown_list = this.props.DropdownList.map(function(item){
            idx = idx + 1;
            return (
                <DropdownItem key={idx} data={item} Click={this.props.Change} />
            );
        }, this);
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
                            {dropdown_list}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});

var TemplateDropdown = React.createClass({
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

var DropdownItem = React.createClass({
    render: function(){
        return (
            <li onClick={this.props.Click}>
                <a href="javascript:void(0)">{this.props.data}</a>
            </li>
        );
    }
});


/** Component for Edit something.
 * @param {String} Type of input, that represent edit value
 * @param {Integer} EditId is html id.
 * @param {...} Value - initial of input
 * @param {String} FormName that for input will be attached
 * @param {Integer} LabelId i don't know what is it for
 * @param {Function} Change callback, on changing.
 * @param {Function} Focus callback, on focus.
 * @param {Function} Blur callback, on blur. (?)
 */
var Edit = React.createClass({
    render: function(){
        return (
            <div className="input-group">
                <span className="input-group-addon" id={this.props.LabelId}>{this.props.Label}</span>
                <input type={this.props.Type} className="form-control" id={this.props.EditId} value={this.props.Value}
                form={this.props.FormName} aria-describedby={this.props.LabelId} onChange={this.props.Change}
                onFocus={this.props.Focus} onBlur={this.props.Blur} />
            </div>
        );
    }
});

var CloseDlgButton = React.createClass({
   render: function(){
       return (
           <a href={this.props.Link} className={this.props.Class} id={this.props.Id} onClick={this.props.Click} data-dismiss="modal" aria-hidden="true">
                <span className="glyphicon glyphicon-ok"></span> {this.props.Caption}
            </a>
       );
   }
});

var Button = React.createClass({
   render: function(){
       return (
           <a href={this.props.Link} className={this.props.Class} id={this.props.Id} onClick={this.props.Click}>
                <span className={this.props.Icon}></span> {this.props.Caption}
            </a>
       );
   }
});

ReactDOM.render(
    <CreateEventDlg />,
    document.getElementById('create-event')
);

$.ajax({
    type: 'get',
    url: '/api/events/',
    headers: {
        Authorization: 'Token ' + window.localStorage.getItem('token')
    },
    dataType: 'json',
    success: function(response){
        ReactDOM.render(
            <EventTable events={response} />,
            document.getElementById('event-content')
        );
    }
});
