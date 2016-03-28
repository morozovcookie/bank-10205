import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const dummy = {
    users: [
        {
            id: 1,
            username: "Intey",
            balance: 1000.00,
            debts: [
                { // link to events:id
                    id: 1,
                    summ: 100.00,
                    parts: 1.0
                },
                {
                    id: 2,
                    summ: 200.54,
                    parts: 2.0
                },
                {
                    id: 3,
                    summ: 333.12,
                    parts: 3.0
                },
            ]
        },
        {
            id: 2,
            username: "Konstantin",
            balance: 547.99,
            debts: [
                { // link to events:id
                    id: 1,
                    summ: 100.00,
                    parts: 1.0
                },
                {
                    id: 2,
                    summ: 200.54,
                    parts: 2.0
                },
                {
                    id: 3,
                    summ: 333.12,
                    parts: 3.0
                },
            ]
        },
        {
            id: 3,
            username: "Nikolay",
            balance: -150.01,
            debts: [
                { // link to events:id
                    id: 1,
                    summ: 100.00,
                    parts: 1.0
                },
                {
                    id: 2,
                    summ: 200.54,
                    parts: 2.0
                },
                {
                    id: 3,
                    summ: 333.12,
                    parts: 3.0
                },
            ]
        },
        {
            id: 4,
            username: "Igor",
            balance: 15000,
            debts: [
                { // link to events:id
                    id: 1,
                    summ: 100.00,
                    parts: 1.0
                },
                {
                    id: 2,
                    summ: 200.54,
                    parts: 2.0
                },
                {
                    id: 3,
                    summ: 333.12,
                    parts: 3.0
                },
            ]
        }
    ],
    events: [
        {
            id: 1,
            name: "Cookies",
            date: "10-12-2016",
            price: 854,
        },
        {
            id: 2,
            name: "Bar",
            date: "10-02-2016",
            price: 20000,
        },
        {
            id: 3,
            name: "Tea",
            date: "10-12-2016",
            price: 854,
        }
    ]
};

class UserRow extends React.Component {
    render() {
            const styles = { margin: "1rem" };
        const events = this.props.user.debts.map( (e) => {
            return (
                <td key={e.id}>
                    <table width="100%">
                    <tbody>
                    <tr>
                        <td>{e.parts}</td>
                        <td>{e.summ}</td>
                    </tr>
                    </tbody>
                    </table>
                </td>
            )});

        return (
            <tr>
                <td>{this.props.user.username}</td>
                <td>{this.props.user.balance}</td>
                {events}
            </tr>
        );
    }
}

class EventsRow extends React.Component {
    render() {
        // we coupled with UserRow. So, we need pad.
        const events = this.props.events.map( (e) => {
            return
            <td key={e.id}>
                <tr><td>{this.props.event.name}</td></tr>
                <tr><td>{this.props.event.date}</td></tr>
                <tr><td>{this.props.event.price}</td></tr>
            </td>
        });
        return (
            <tr>
                <td></td>
                <td></td>
                {events}
            </tr>
        );
    }
}

class Summary extends React.Component {
    render() {
        const events_count = this.props.events.length;

        const users = this.props.users.map( (u) => { return <UserRow key={u.id} user={u}/> ;});
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th colSpan="2">Users</th>
                        <th colSpan={events_count}>Events</th>
                    </tr>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </table>
        );
        // <EventsRow events={this.props.events}/>
    }
}

ReactDOM.render(
    <Summary users={dummy.users} events={dummy.events}/>,
    document.getElementById('summary')
);
// $.get('/api/summary/')
// .done((data) => {
//     console.log("Income data:", data);
//     ReactDOM.render(
//         <Summary users={data.users} events={data.events}/>,
//         document.getElementById('summary')
//     );
// })
// .fail((data) => {
//     ReactDOM.render(
//         <center>
//             Uooops. No data found There! Joy!
//         </center> ,
//         document.getElementById('summary')
//     );
//
// });

