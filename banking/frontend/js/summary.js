import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class UserRow extends React.Component {
    render() {
        const events = this.props.user.events.map( (e) => {
            <div>
                <td>{e.my_parts}</td>
                <td>{e.my_debt}</td>
            </div>
        });

        return (
            <tr>
                <td>{this.props.user.username}</td>
                <td>{this.props.user.balance}</td>
            </tr>
        );
    }
}

class EventRow extends React.Component {
    render() {
        // we coupled with UserRow. So, we need pad.
        return (
            <tr>
                <td></td>
                <td></td>
                <td>{this.props.event.name}</td>
                <td>{this.props.event.date}</td>
                <td>{this.props.event.price}</td>
            </tr>
        );
    }
}

class Summary extends React.Component {
    render() {
        const events_count = this.props.events.length;

        const users = this.props.users.map( (u) => { return <UserRow key={u.id} user={u}/> ;});
        const events = this.props.events.map( (e) => { return <EventRow key={e.id} event={e}/> ;});

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Users</th>
                        <th colSpan="{events_count}">Events</th>
                    </tr>
                </thead>
                <tbody>
                    {events}
                    {users}
                </tbody>
            </table>
        );
    }
}

$.get('/api/summary/')
.done((data) => {
    console.log("Income data:", data);
    ReactDOM.render(
        <Summary users={data.users} events={data.events}/>,
        document.getElementById('summary')
    );
})
.fail((data) => {
    ReactDOM.render(
        <center>
            Uooops. No data found There! Joy!
        </center> ,
        document.getElementById('summary')
    );

});

