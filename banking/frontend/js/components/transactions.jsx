import React from 'react';
import $ from 'jquery';

import AccordSection from './accordsection.jsx';
import {get} from '../utils/ajax.js';
import TransactionRow from './transactionrow.jsx'
import DiffTransactionRow from './difftransactionrow.jsx'

// ^_^
let eventId = () => $('#event').attr('data-id');

/** Show elements with it's hiden dropdown content. On click expand or collapse
 * dropdown content. */
export default class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
    }

    componentDidMount() {
        $.get(
            '/api/transactions/',
            { event: eventId() },
            (data) => {
                this.setState({items: data })
            });
    }

    /** Group transaction by account.
     * @param {Array} transactions - transacitions, that will be grouped.
     * Shape: account, debit, credit, account.
     * @return {Array} Transaction groups. Shape: transactions, sum, account,
     * date. Date is date of latest transaction in group.
     */
    groupByUser(transaction) {
        var grouped = {};
        transaction.forEach( (t, idx) => {
            //fix
            const username = t.account.name;
            if (!grouped[username])
                grouped[username] = { transactions: [], summ: 0, account: t.account, id: idx};
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
        var sections = this.groupByUser(this.state.items).map(function(item) {
            var colorClass = item.summ > 0 ?  "danger" : "success";
            const childs = item.transactions.map((t) => {
                return (<DiffTransactionRow key={t.id} item={t}/>)
            });
            return (
                <AccordSection key={item.id}>
                    <TransactionRow classNames="head" item={item}/>
                    {childs}
                </AccordSection>
            );
        });
        return (
            <div>
                {sections}
            </div>
        );
    }

}
