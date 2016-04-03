import React from 'react'
import $ from 'jquery';

import Section from './accordion.jsx'
import {get} from '../utils/ajax.js'

// ^_^
let eventId = () => $('#event').attr('data-id');

/** Show elements with it's hiden dropdown content. On click expand or collapse
 * dropdown content.
 * Work together with Section.
 * @param {String} title - title of accordion
 */
export default class TransactionsTable extends React.Component {
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
            return (
                <Section key={item.id} >
                    <div> {item.credit} </div>
                    <div> {item.date} </div>

                </Section>
            );
        });
        return (
            <div className="main">
                {sections}
            </div>
        );
    }

}
TransactionsTable.defaultProps = { items: [] };


