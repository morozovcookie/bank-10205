import React from 'react';
import {MoneyCell} from './moneycell.jsx';

/** Diff transaction for user. Show causer name(link), his action type(in, out)
 * as gliph, diff count, and user debt on this state.
 * @param {Array} transaction - transaction data.
 * Shape: see /api/transactions/
 */
export default function DiffTransactionRow(props) {
    const item = props.item;

    var parent;
    if (item.type == "Перерасчет")
        parent = <Diff item={item.parent} className="col-md-3 col-sm-3 col-xs-3"/>;

    const bg_color = (item.summ < 0 ? "#fee" : "#efe");
    var styles = {
        borderBottom: "1px solid #cacaca",
        backgroundColor: bg_color
    };

    return (
        <div style={styles} className={"row "+props.className}>
            <MoneyCell className="col-md-offset-3 col-md-2 col-sm-2 col-xs-2" value={item.summ}/>
            <span className="col-md-2 col-sm-2 col-xs-2">{item.date}</span>
            <span className="col-md-2 col-sm-2 col-xs-2">{item.type}</span>
            {parent}
        </div>
    );
}

function Diff(props) {
    const item = props.item;
    const icon = (
        item.type == "IN" ?
            <span className="col-md-1 glyphicon glyphicon-log-in"></span>:
            <span className="col-md-1 glyphicon glyphicon-log-out"></span>
    );
    return (
        <span className={props.className}>
            {icon}
            <span className="col-md-10">{item.account.name}</span>
        </span>
    );
}
