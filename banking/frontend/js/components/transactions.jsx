import React from 'react';
import $ from 'jquery';
import {csrfSafe} from '../utils/csrf.js';
import AccordSection from './accordsection.jsx';
import TransactionRow from './transactionrow.jsx'
import DiffTransactionRow from './difftransactionrow.jsx'

// ^_^
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
                        console.log(participants_query);
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
        csrfSafe({
            method: "GET",
            url: `/api/events/${eventId()}/participants/`,
            success: (data) => {
                var participants_query = data.reduce((acc, v) => { return acc+=`participants=${v.id}&`}, '')
                console.log(participants_query);
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
        const fields = Object.getOwnPropertyNames(grouped);
        var formated = [];
        return formated.concat( fields.map((f) => grouped[f]) );
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
                        <span className="btn btn-danger glyphicon glyphicon-remove"
                              onClick={RemoveHandler}>
                        </span>
                    </TransactionRow>
                    {childs}
                </AccordSection>
            );
        });
        // append EditField
        return (
            <div>
                {sections}
            </div>
        );
    }

}
