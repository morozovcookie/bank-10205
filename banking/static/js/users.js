var NewUserDlg = React.createClass({
    getInitialState: function(){
        return {
            username: '',
            password: '',
            first_name: '',
            last_name: ''
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
    handleFirstnameChange: function(event){
        this.setState({
            first_name: event.target.value
        });
    },
    handleLastnameChange: function(event){
        this.setState({
            last_name: event.target.value
        });
    },
    handleAddUser: function(){
        var token = window.localStorage.getItem('token');
        $.ajax({
            type: 'post',
            url: '/api/user/',
            headers: {
                Authorization: 'Token ' + token
            },
            data: this.state,
            success: function(){
                this.state = null;
            }
        });
    },
    render: function(){
        return (
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">x</button>
                    <h4 className="modal-title">Новый сотрудник</h4>
                </div>
                <div className="modal-body">
                    <form className="form-horizontal" name="create-user-form">
                        <fieldset>
                            <Edit Label="Логин" Type="text" LabelId="username-label" EditId="username-input" FormName="create-user-form" Change={this.handleUsernameChange} />
                            <Edit Label="Временный пароль" Type="password" LabelId="temp-password-label" EditId="temp-password-input" FormName="create-user-form" Change={this.handlePasswordChange} />
                            <Edit Label="Имя" Type="text" LabelId="user-firstname-label" EditId="user-firstname-input" FormName="create-user-form" Change={this.handleFirstnameChange} />
                            <Edit Label="Фамилия" Type="text" LabelId="user-secondname-label" EditId="user-secondname-input" FormName="create-user-form" Change={this.handleLastnameChange} />
                        </fieldset>
                    </form>
                </div>
                <div className="modal-footer">
                    <div className="col-md-8"></div>
                    <div className="col-md-4">
                        <OKButton Link="#" Class="btn btn-success" Id="add-user-button" Caption="Добавить" Click={this.handleAddUser}/>
                    </div>
                </div>
            </div>
        );
    }
});

var UpdateUserDlg = React.createClass({
    render: function(){
        return (
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">x</button>
                    <h4 className="modal-title">Изменить пароль</h4>
                </div>
                <div className="modal-body">
                    <form className="form-horizontal" name="update-user-form">
                        <fieldset>			
                            <Edit Label="Логин" Type="text" LabelId="username-label" EditId="username-input" FormName="update-user-form" />
                            <Edit Label="Временный пароль" Type="password" LabelId="temp-password-label" EditId="temp-password-input" FormName="update-user-form" />
                            <Edit Label="Имя" Type="text" LabelId="user-firstname-label" EditId="user-firstname-input" FormName="update-user-form" />
                            <Edit Label="Фамилия" Type="text" LabelId="user-secondname-label" EditId="user-secondname-input" FormName="update-user-form" />
                        </fieldset>
                    </form>
                </div>
                <div className="modal-footer">
                    <div className="col-md-8"></div>
                    <div className="col-md-4">
                        <OKButton Link="#" Class="btn btn-success" Id="update-user-button" Caption="Сохранить" />
                    </div>
                </div>
            </div>            
        );
    }
});

var Edit = React.createClass({
    render: function(){
        return (
            <div className="input-group">
                <span className="input-group-addon" id={this.props.LabelId}>{this.props.Label}</span>
                <input type={this.props.Type} className="form-control" id={this.props.EditId} 
                form={this.props.FormName} aria-describedby={this.props.LabelId} onChange={this.props.Change} />
            </div>
        );
    }
});

var OKButton = React.createClass({
   render: function(){
       return (
           <a href={this.props.Link} className={this.props.Class} id={this.props.Id} data-dismiss="modal" aria-hidden="true" onClick={this.props.Click}>
                <span className="glyphicon glyphicon-ok"></span> {this.props.Caption}
            </a> 
       );
   } 
});

ReactDOM.render(
  <NewUserDlg />,
  document.getElementById('new-user')
);