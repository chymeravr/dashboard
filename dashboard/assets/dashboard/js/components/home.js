var React = require('react');
var Link = require('react-router').Link

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var style = {
            fontWeight: "lighter",
            color: '#555',
        }

        return (
            <div className="center-align container">
                <div><img src="" /></div>
                <h2 className="" style={style}>
                    Monetise with <strong>VR</strong>
                </h2>
                <br />
                <Link className="waves-effect waves-light btn" to="/login">GET STARTED</Link>
            </div>
        );
    }
}

module.exports = HomeView 