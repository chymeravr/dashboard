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
        var style = {
            fontWeight: "lighter",
            color: '#555',
        }

        return (
            <div className="center-align">
                <br />
                <div><img src="" /></div>
                <h2 className="container" style={style}>
                    Monetise with <strong>VR</strong>
                </h2>
                <a className="waves-effect waves-light btn" 
                onClick={event => window.location = "#/login"}>
                    Get Started
                </a>
            </div>
        );
    }
}

module.exports = HomeView 