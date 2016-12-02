var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../lib.js'

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { next: '/login' };
    }

    componentWillMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            {},
            (response) => this.setState({ next: '/profile/' }),
            (error) => ({})
        );
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
                <Link className="waves-effect waves-light btn"
                    to={this.state.next}>GET STARTED</Link>
            </div>
        );
    }
}

module.exports = HomeView 