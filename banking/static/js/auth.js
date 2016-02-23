function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function postSCRF(settings){
	var csrftoken = getCookie('csrftoken');
	settings.beforeSend = function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	};
	settings.method = "POST";
	return $.ajax(settings);
}
var AuthForm = React.createClass({
    getInitialState: function(){
        return {
            username: '',
            password: '',
            csrf: ''
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
        var data = this.state;


		postSCRF({
			method:'POST',
			url:'/api/auth/',
			data:this.state})
        .success(function(response){
            var token = response.token;
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('user', JSON.stringify(response.user));
            console.log(response.is_superuser);
            document.location.href = (
                response.user.is_superuser ? '/admin/' : '/client/'
            );
        });
    },
    render: function(){
        return (
            <form className="form-horizontal" name="auth-form" method="post">
                <fieldset>
                    <legend>
                        <h3>Аутентификация</h3>
                    </legend>
                    <Edit label="Username" type="text" change={this.handleUsernameChange}/>
                    <Edit label="Password" type="password" change={this.handlePasswordChange} />
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
                <input type={this.props.type} className="form-control" id="username-input"
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
