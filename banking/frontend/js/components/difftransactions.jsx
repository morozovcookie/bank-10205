import React from 'react';

export default class DiffTransactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.update = this.update.bind(this);
    }
    update() {
        $.get('/api/transactions/', {parent:id});

    }
    render() {

        return (
            <div>No data</div>
        );
    }

}

