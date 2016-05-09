var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var csrfSafe = require('./utils/csrf.js').csrfSafe;

var NavMenu = React.createClass({
    getInitialState: function(){
        return {
            header: 'Навигация'
        }
    },
    render: function(){
        return (
            <div className="panel panel-default">
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <h3>{this.state.header}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <MenuList />
                    </div>

                </div>
            </div>
        );
    }
});

var MenuList = React.createClass({
    render: function(){
        var user = window.localStorage.getItem('user');
        if (JSON.parse(user).user.is_superuser)
        {
            // <MenuListItem IconClass="glyphicon glyphicon-duplicate" Caption="Шаблоны событий" Link="/templates/" />
            return (
                <ul className="nav nav-pills nav-stacked" id="nav-menu">
                    <MenuListItem IconClass="glyphicon glyphicon-list-alt" Caption="События" Link="/events/" />
                    <MenuListItem IconClass="glyphicon glyphicon-user" Caption="Сотрудники" Link="/users/" />
                </ul>
            );
        }
        return (
            <ul className="nav nav-pills nav-stacked" id="nav-menu">
                <MenuListItem IconClass="glyphicon glyphicon-home" Caption="Главная" Link="/client/" />
                <MenuListItem IconClass="glyphicon glyphicon-list-alt" Caption="События" Link="/events/" />
            </ul>
        );
    }
});

var MenuListItem = React.createClass({
    render: function(){
        return (
            <li onClick={this.props.click}>
                <a href={this.props.Link}>
                    <span className={this.props.IconClass}></span> {this.props.Caption}
                </a>
            </li>
        );
    }
});

var Navbar = React.createClass({
    getInitialState: function(){
        return null;
    },
    render: function(){
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header"></div>
                    <div className="collapse navbar-collapse">
                        <NavbarMenuList />
                    </div>
                </div>
            </nav>
        );
    }
});

var NavbarMenuList = React.createClass({
    logout: function(){
        var token = window.localStorage.getItem('token');
        csrfSafe({
            type: 'delete',
            url: '/api/auth/',
            headers: {
                Authorization: 'Token ' + token
            },
            success: function(response){
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('is_superuser');
                document.location.href = '/auth/';
            }
        });
    },
    render: function(){
        return (
            <ul className="nav navbar-nav navbar-right">
                <NavbarMenuListBadgeItem Link="#" Content='Баланс банка' />
                <NavbarMenuListItem Link="#" Content="Выход" click={this.logout}/>
            </ul>
        );
    }
});

var NavbarMenuListItem = React.createClass({
    render: function(){
        return (
            <li onClick={this.props.click}>
                <a href={this.props.Link}>{this.props.Content}</a>
            </li>
        );
    }
});

var NavbarMenuListBadgeItem = React.createClass({
    render: function(){
        return (
            <li>
                <a href={this.props.Link}>{this.props.Content} <span className="badge">0</span></a>
            </li>
        );
    }
});

ReactDOM.render(
    <NavMenu />,
    document.getElementById('nav')
);

ReactDOM.render(
    <Navbar />,
    document.getElementById('navbar')
);

$(document).ready(function(){
    var url = window.location.href;
    var idx = (url.match(('events|users|templates'))==null ? '/admin/' : '/' + url.match(('events|users|templates'))[0] + '/');
    $($('a[href="' + idx +'"]').parent()).addClass('active');
});
