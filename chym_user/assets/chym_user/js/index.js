var React = require('react')
var ReactDOM = require('react-dom')
require('whatwg-fetch')

/*
 * Components
 */


class NameForm extends React.Component {
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
  }

  render() {
    return (
      <div>
        <form>
          Username: <input
            value={this.state.username}
            onChange={this.handleChange('username')} />
          <br />
          Password: <input type="password"
            value={this.state.password}
            onChange={this.handleChange('password')} />
        </form>
        <button onClick={this.tryLogin}>Login</button>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>
      </div>
    );
  }
}

ReactDOM.render(
  <NameForm />,
  document.getElementById('root')
);