var AuthForm = React.createClass({
    getInitialState: function(){
        return {
            username: '',
            password: ''
        }
    },
    handleUsernameChange: function(event){
        this.setState({
            username: event.target.value
        });  
    },
    handlePasswordChange: function(event){
        this.setState({
            password: event.target.value
        });  
    },
    handleAuth: function(){
        $.post('/api/auth', this.state)
        .success(function(response){
            console.log('auth');
            console.log(response);
        });
    },
    render: function(){
        return (
            <form className="form-horizontal" name="auth-form" method="get">
                <fieldset>
                    <legend>
                        <h3>Аутентификация</h3>
                    </legend>
                    <Edit label="Username" change={this.handleUsernameChange}/>
                    <Edit label="Password" change={this.handlePasswordChange} />
                    <Button caption="Войти" click={this.handleAuth}/>
                </fieldset>
            </form>
        );
    }
});

var Edit = React.createClass({
    render: function(){
        return (
            <div className="input-group">
                <span className="input-group-addon" id="username-label">{this.props.label}</span>
                <input type="text" className="form-control" id="username-input" 
                form="auth-form" aria-describedby="username-label" 
                onChange={this.props.change}/>
            </div>
        );
    }
});

var Button = React.createClass({
    render: function(){
        return (
            <div className="btn-group col-md-12">
                <button type="button" className="btn btn-success col-md-12" 
                id="sigin-button" form="auth-form" onClick={this.props.click}>
                    {this.props.caption}
                </button>
            </div>
        );
    }
});

ReactDOM.render(
  <AuthForm/>,
  document.getElementById('auth-panel')
);