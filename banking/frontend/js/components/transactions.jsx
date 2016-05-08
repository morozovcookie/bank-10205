import React from 'react'
import LinkState from 'react-link-state'
import $ from 'jquery'

import {csrfSafe} from '../utils/csrf.js'

import AccordSection from './accordsection.jsx'
import TransactionRow from './transactionrow.jsx'
import DiffTransactionRow from './difftransactionrow.jsx'

import {AccountAPI} from '../domain/api.js'
import getToken from '../utils/token.js'

var API = new AccountAPI(getToken())

// TODO: to const value
let eventId = () => $('#event').attr('data-id');

/** Show elements with it's hiden dropdown content. On click expand or collapse
 * dropdown content. */
export default class ParticipantsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.addParticipant = this.addParticipant.bind(this);
        this.updateTransactions = this.updateTransactions.bind(this);
    }

    handleRemoveClick(event, item) {
        event.stopPropagation();

        csrfSafe({
            method: "DELETE",
            url: `/api/events/${eventId()}/participants/${item.id}`,
            success: (data) => {
                csrfSafe({
                    method: "GET",
                    url: `/api/events/${eventId()}/participants/`,
                    success: (data) => {
                        var participants_query = data.reduce((acc, v) => { return acc+=`participants=${v.id}&`}, '')
                        csrfSafe({
                            url: '/api/transactions/' + '?'+participants_query,
                            data: {
                                event: eventId()
                            },
                            success: (data) => {
                                this.setState({items: this.groupByUser(data) })
                            }
                        });
                    }
                });
            }
        });
    }

    componentDidMount() {
        this.updateTransactions()
    }

    updateTransactions() {
		csrfSafe({
			url: '/api/transactions/?active=true',
			method: "GET",
			data: { event: eventId() },
			success: (data) => {
				this.setState({items: this.groupByUser(data) })
			}
		})
    }

    /** Group transaction by account.
     * @param {Array} transactions - transacitions, that will be grouped.
     * Shape: account, aditional data.
     * @return {Array} Transaction groups -
     * Shape: transactions, summ, account, id.
     */
    groupByUser(transaction) {
        var grouped = {};
        transaction.forEach( (t) => {
            //fix
            const username = t.account.name;
            if (!grouped[username])
                grouped[username] = { transactions: [], summ: 0, account: t.account, id: t.account.id};
            //work
            grouped[username].transactions.push(t);
            grouped[username].summ += Number(t.summ);
        });
        // convert to array
        const usernames = Object.getOwnPropertyNames(grouped);
        return usernames.map((f) => grouped[f]);
    }

    addParticipant(participation) {
        console.log(JSON.stringify(participation))
        csrfSafe({
            method: 'POST',
            url: `/api/events/${eventId()}/participants/`,
            data: JSON.stringify([participation]),
            success: data => { console.log(data); this.updateTransactions() },
            error: e => console.log(e)
        })
    }

	render() {
        var self = this;

        var sections = this.state.items.map(function(item) {
            var RemoveHandler = (event) => self.handleRemoveClick(event, item);

            var colorClass = item.summ > 0 ?  "danger" : "success";

            const childs = item.transactions.map((t) => {
                return (<DiffTransactionRow key={t.id} item={t}/>)
            });

            return (
                <AccordSection key={item.id}>
                    <TransactionRow classNames="head" item={item}>
                        <span className="btn btn-xs btn-danger glyphicon glyphicon-remove"
                              onClick={RemoveHandler}>
                        </span>
                    </TransactionRow>
                    {childs}
                </AccordSection>
            );
        });

        let exclude = this.state.items.map( item => parseInt(item.id) );
        return (
            <div>
                {sections}
                <NewParticipantRowInput
					exclude={exclude}
					onAdd={this.addParticipant}/>
            </div>
        );
    }
}

class NewParticipantRowInput extends React.Component{
    constructor(props) {
        super(props);
        let date = new Date()
        date = date.toISOString().substring(0,10)
        this.state = {
            accounts: [],
            matches: [],
            selected: { user: {username:""}},
            date: date,
            parts: "" // display placeholder
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleAddParticipant = this.handleAddParticipant.bind(this);
    }

    componentDidMount() {
		API.getUsers(
			response => this.setState({accounts: response}),
			error => console.log(error)
		);
    }

    handleNameChange(e) {
        let matches = [],
            rest = []

        const pattern = e.target.value.toLowerCase()

        // search everywhere
        let accounts = this.state.accounts.concat(this.state.matches)

        let exclude = this.props.exclude

        for (var i = 0; i < accounts.length; i++) {
            const account = accounts[i]
            const username = account.user.username.toLowerCase()
            if (pattern && username.startsWith(pattern) && !exclude.includes(parseInt(account.user.id)))
                matches.push(account)
            else
                rest.push(account)
        };

        this.setState({
            accounts: rest,
            matches: matches,
            selected: { user: { username: e.target.value } } //'couze pattern lowerCased.
        })
    }

    handleSelect(matches_index) {
        this.setState({
            accounts: this.state.accounts.concat(this.state.matches),
            selected: this.state.matches[matches_index],
            matches: [] })
    }

    handleAddParticipant(e) {
        this.props.onAdd({
            account: this.state.selected.user.id,
            parts: parseInt(this.state.parts)
        });
    }

    render() {
        let self = this;
        let matches = this.state.matches;

        let matches_view = matches.map( (account, matches_index) => {
            let handler = (event) => self.handleSelect(matches_index)
            return (
                <li className="item" key={matches_index} onClick={handler}>
                    {account.user.username}
                </li>)
        });

        let maybeDropdown;
        if (matches.length != 0) {
            maybeDropdown = (<ul className="dropdown col-md-2 col-sm-3 col-xs-3">{matches_view}</ul>)
        }

        const id = this.state.selected.user.id || 0
        const parts = this.state.parts || 0.0
        let disable = (id < 1 || parts <= 0)

        return(
        <div className="col-md-12 col-sm-12 section">
            <div className="row head">
                <input className="input col-md-4 col-xs-4" type="text" onChange={this.handleNameChange}
                       placeholder="username..."
                       value={this.state.selected.user.username}></input>
                {maybeDropdown}
                <input className="input col-md-3 col-xs-3" type="number"
                       placeholder="parts..."
                       valueLink={LinkState(this, 'parts')}></input>
                <input className="input col-md-4 col-xs-4" type="date" valueLink={LinkState(this,'date')}></input>
                <span className="col-md-1 col-xs-1">
                    <a className="btn btn-xs btn-success glyphicon glyphicon-ok"
                        disabled={disable}
                        onClick={this.handleAddParticipant}>
                    </a>
                </span>
            </div>
        </div>
    )}
}
