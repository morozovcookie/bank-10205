import React from 'react';
import $ from 'jquery';

import Section from './accordion.jsx';
import {get} from '../utils/ajax.js';
import TransactionRow from './transactionrow.jsx'

// ^_^
let eventId = () => $('#event').attr('data-id');

/** Show elements with it's hiden dropdown content. On click expand or collapse
 * dropdown content.
 * Work together with Section.
 * @param {String} title - title of accordion
 */
export default class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
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
                grouped[username] = { transactions: [], summ: 0, account: t.account, id: idx };
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
                return (<TransactionRow key={t.id} item={t}/>)
            });
            return (
                <Section key={item.id}>
                    <TransactionRow classNames="head" item={item}/>
                    {childs}
                </Section>
            );
        });
        return (
            <div>
                {sections}
            </div>
        );
    }

}
Transactions.defaultProps = { items: [] };
