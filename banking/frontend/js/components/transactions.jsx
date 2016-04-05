import React from 'react';
import $ from 'jquery';

import {Section} from './accordion.jsx';
import {get} from '../utils/ajax.js';
import DiffTransactions from './difftransactions.jsx'
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
                console.log("gotten transactions:" + data);
                this.setState({items: data })
            });
    }

	render() {
        var sections = this.state.items.map(function(item) {
            var colorClass = item.summ > 0 ?  "danger" : "success";
            return (
                <Section key={item.id} >
                    <TransactionRow classNames="head" item={item}/>
                    <DiffTransactions parent={item.id}/>
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
