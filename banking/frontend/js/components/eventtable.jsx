import React from 'react'

import $ from 'jquery'

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
