'use strict'
import React    from 'react'
import ReactDOM from 'react-dom'
import $        from 'jquery'

import EventTable     from './components/eventtable.jsx'
import CreateEventDlg from './components/createeventdlg.jsx'

ReactDOM.render(
    <CreateEventDlg />,
    document.getElementById('create-event')
);

$.ajax({
    type: 'get',
    url: '/api/events/',
    headers: {
        Authorization: 'Token ' + window.localStorage.getItem('token')
    },
    dataType: 'json',
    success: function(response){
        ReactDOM.render(
            <EventTable events={response} />,
            document.getElementById('event-content')
        );
    }
});
