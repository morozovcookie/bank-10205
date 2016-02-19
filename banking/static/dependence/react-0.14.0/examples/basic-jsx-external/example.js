var dummy = [
{ name: "Cookies", price: 1000.2, id: 1, author: "intey"},
{ name: "AsdaiII", price: 100,    id: 2, author: "andreyk"},
{ name: "Teabugs", price: 1930.2, id: 3, author: "intey"}

];
var dummy_empty = [];

var EventList = React.createClass({
  render: function() {
    var events; 
    if (this.props.data.length == 0) {
      events = <span>No events found.</span>
    } else {
      events = this.props.data.map(function(d) {
        return <EventRow key={d.id} event={d}/>;
      });
    }

    var styles = { width: 200 };
    return ( 
      <div className="events" style={styles}>
          <table>
          <tbody>
            {events}
          </tbody>
          </table>
      </div>
    );
  }
});

var EventRow = React.createClass({
  render: function() {
    return ( 
      <span>
        <Event data={this.props.event}/>
        <EventActions />
      </span>
    );
  } 
    
});

var EventActions = React.createClass({
  render: function() {
    return ( 
    );
  } 
});
var Action = React.createClass({
  render: function() {
    return ( 
    );
  } 
});

var Event = React.createClass({
  render: function() {
    var styles = {
      borderBottom: "solid black 2px"
    };
    return ( 
        <li style={styles}>
          <p>
            {this.props.data.name}
          </p>
          <p>{this.props.data.price}</p>
          <p>{this.props.data.author}</p>
        </li>
    );
  } 
});

ReactDOM.render(
  <EventList data={dummy}/>,
  document.getElementById('container')
);

