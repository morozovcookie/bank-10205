var React = require('react');
var $ = require('jquery');
var EventAccordion = require('./components/accordion');

export default class EventTable extends React.Component{
    render() {
        var idx = 0;
        var events = this.props.events.map(function(event){
            idx = idx + 1;
            return (<EventRow key={idx} data={event}/>);
        });
        return (
            <table className="table" id="event-table">
                <thead>
                    <tr>
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
        );
    }
};

var EventRow = React.createClass({
    render: function(){
        return (
            <tr>
                <td><a href={"/events/"+this.props.data.id}>{this.props.data.name}</a></td>
                <td>{this.props.data.date}</td>
                <td>{this.props.data.price}</td>
                <td>{this.props.data.author}</td>
            </tr>
        )}
});

var EventTableAccorded = React.createClass({
    getInitialState: function() { return { events: [] }; },

    componentDidMount: function() {
        $.ajax({
            type: 'get',
            url: '/api/events/',
            headers: {
                Authorization: 'Token ' + window.localStorage.getItem('token')
            },
            dataType: 'json',
            success: function(response){
                this.setState({ events: response })
            }.bind(this)
        });
    },
    render: function(){
        return (
            <main className="col-md-12">
                <header className="row">
                    <div className="col-md-10">
                        <h3>Список событий</h3>
                    </div>
                    <div className="col-md-2">
                        <a className="btn btn-success" href="#" style={{marginTop:'16px'}} data-toggle="modal" data-target="#new-event-dlg">
                            <span className="glyphicon glyphicon-plus"></span> Новое событие
                        </a>
                    </div>
                </header>
                <div className="row" style={{marginTop:'20px'}}>
                    <div className="col-md-12">
                        <EventAccordion items={this.state.events}/>
                    </div>
                </div>
            </main>
        );
    }
});



