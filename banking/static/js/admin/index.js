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
        var is_superuser = window.localStorage.getItem('is_superuser');
        if (is_superuser == 'true')
        {
            return (
                <ul className="nav nav-pills nav-stacked" id="nav-menu">
                    <MenuListItem IconClass="glyphicon glyphicon-home"      Caption="Главная"           Link="/"                Active  />
                    <MenuListItem IconClass="glyphicon glyphicon-user"      Caption="Сотрудники"        Link="userlist/"                />
                    <MenuListItem IconClass="glyphicon glyphicon-list-alt"  Caption="События"           Link="eventlist/"               />
                    <MenuListItem IconClass="glyphicon glyphicon-duplicate" Caption="Шаблоны событий"   Link="templatelist/"            />
                </ul>
            );
        }
        return (
            <ul className="nav nav-pills nav-stacked" id="nav-menu">
                <MenuListItem IconClass="glyphicon glyphicon-home"      Caption="Главная"           Link="/"                Active  />
                <MenuListItem IconClass="glyphicon glyphicon-user"      Caption="Сотрудники"        Link="userlist/"                />
                <MenuListItem IconClass="glyphicon glyphicon-list-alt"  Caption="События"           Link="eventlist/"               />
            </ul>
        );
    }
});

var MenuListItem = React.createClass({
    render: function(){
        return (
            <li className={this.props.hasOwnProperty('Active') ? "active" : ""}>
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
    render: function(){
        return (
            <ul className="nav navbar-nav navbar-right">
                <NavbarMenuListItem Link="#" Content='Баланс банка <span className="badge">0</span>' />
                <NavbarMenuListItem Link="#" Content="Выход" />
            </ul>
        );
    }
});

var NavbarMenuListItem = React.createClass({
    render: function(){
        return (
            <li>
                <a href={this.props.Link}>{this.props.Content}</a>
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