import React from 'react';

import TransactionRow from './transactionrow.jsx'

export default class DiffTransactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        $.get('/api/transactions/', {parent: this.props.parent}, (res) => {
            this.setState({transactions: res});
        });
    }

    render() {
        const offset = { paddingLeft: "20px"};

        const transactions = this.state.transactions.map( (t) => {
            return (
                <div key={t.id}>
                    <TransactionRow item={t}/>
                </div>
            );
        });

        return (
            <div>
                {transactions}
            </div>
        );
    }

}

