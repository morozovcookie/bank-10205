import React from 'react';
import {MoneyCell} from './moneycell.jsx';

export default class TransactionRow extends React.Component {
    render() {
        const item = this.props.item;
        return (
        <div className={"row "+this.props.classNames}>
            <span className="col-md-3 col-sm-3 col-xs-3">
                <a href={item.account.link}>
                    {item.account.name}
                </a>
            </span>
            <MoneyCell className="col-md-2 col-sm-2 col-xs-2" value={item.summ}/>
            <span className="col-md-3 col-sm-3 col-xs-3">{item.date}</span>
            <span className="col-md-2 col-sm-2 col-xs-2">{item.type}</span>
        </div>
        );
    }

}

