import React from 'react'
import ReactDOM from 'react-dom'

import Dropdown         from './dropdown.jsx'
import TemplateDropdown from './templatedropdown.jsx'
import Edit             from './edit.jsx'
import CloseDlgButton   from './closedlgbutton.jsx'
import EventBuilder     from './eventbuilder.jsx'


module.exports = React.createClass({
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

