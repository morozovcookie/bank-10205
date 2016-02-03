var EventTable = React.createClass({
    render: function(){
        var idx = 0;
        var events = this.props.events.map(function(event){
            idx = idx + 1;
            return <EventRow key={idx} data={event}/>;
        });
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-10">
                        <h3>Список событий</h3>
                    </div>
                    <div className="col-md-2">
                        <a className="btn btn-success" href="#" style={{marginTop:'16px'}} data-toggle="modal" data-target="#new-event-dlg">
                            <span className="glyphicon glyphicon-plus"></span> Новое событие
                        </a>
                    </div>
                </div>
                <div className="row" style={{marginTop:'20px'}}>
                    <div className="col-md-12">
                        <table className="table" id="event-table">
                            <thead>
                                <tr>
                                    <th style={{width:'100px'}}></th>
                                    <th>Название</th>
                                    <th>Дата</th>
                                    <th>Сумма</th>
                                    <th>Владелец</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

var EventRow = React.createClass({
    render: function(){
        return null;
    }
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
    handleTitleChange: function(){
        this.setState({
            title: event.target.value
        });
    },
    handleDateChange: function(){
        this.setState({
            date: event.target.value
        });
    },
    handleSumChange: function(){
        this.setState({
            sum: event.target.value
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
            document.getElementById('event-content')
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
                        <OKButton Link="#" Class="btn btn-success" Id="next-step-button" Caption="Создать" Click={this.handleGoToEventBuilder}/> 
                    </div>
                </div>
            </div>
        );
    }
});

var EventBuilder = React.createClass({
    render: function(){
        return (
            
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

var Edit = React.createClass({
    render: function(){
        return (
            <div className="input-group">
                <span className="input-group-addon" id={this.props.LabelId}>{this.props.Label}</span>
                <input type={this.props.Type} className="form-control" id={this.props.EditId} value={this.props.Value}
                form={this.props.FormName} aria-describedby={this.props.LabelId} onChange={this.props.Change} />
            </div>
        );
    }
});

var OKButton = React.createClass({
   render: function(){
       return (
           <a href={this.props.Link} className={this.props.Class} id={this.props.Id} onClick={this.props.Click}>
                <span className="glyphicon glyphicon-ok"></span> {this.props.Caption}
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
    success: function(response){
        ReactDOM.render(
            <EventTable events={response.events} />,
            document.getElementById('event-content')
        );
    }
});