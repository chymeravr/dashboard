var React = require('react')

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '' };
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(state);
        }.bind(this);
    }

    tryLogin(e) {
        console.log("Trying to log in");
        console.log(this);
        var data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);
        for (var [key, value] of data.entries()) {
            console.log(key, value);
        }
        fetch('/user/api/login', {
            method: 'POST',
            body: data
        }).then(response => response.json()).then(token => {
            localStorage.setItem(TOKEN_KEY, token['token']);
            window.location = "#/profile";
        });
    }

    render() {
        return (
            <div className="container">
                <form>
                    <div className="input-field col s6">
                        <input id="username" type="text" className="validate" value={this.state.username}
                            onChange={this.handleChange('username')} />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="password" type="text" className="validate" value={this.state.password}
                            onChange={this.handleChange('password')} />
                        <label htmlFor="password">Password</label>
                    </div>
                    <a className="waves-effect waves-light btn" onClick={this.tryLogin.bind(this)}>
                    button
                    </a>
                </form>
            </div>
        );
    }
}

module.exports = LoginForm