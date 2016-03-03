var React = require('react');

module.exports = React.createClass({
    render: function(){
        var idx = 0;
        var events = this.props.events.map(function(event){
            idx = idx + 1;
            console.log(event)
            return (<EventRow key={idx} data={event}/>);
        });
        return (
            <div className="col-md-12">
                <h3>Список событий</h3>
                <div className="row">
                    <div className="col-md-10">
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
        return (
            <tr>
                <th>No data</th>
                <th>No data</th>
                <th>No data</th>
                <th>No data</th>
                <th>No data</th>
            </tr>
        )}
});
