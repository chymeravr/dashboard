var React = require('react');

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    redirectTologin() {
        window.location = '/user/login#/login';
    }
    render() {
        return (
            <div>
                Welcome to ChymeraVR
                <button onClick={this.redirectTologin}>Login</button>
            </div>
        );
    }
}

module.exports = HomeView 