var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6

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

    componentDidMount() {
        document.title = "Chymera VR"
    }

    render() {
        var style = {
            fontWeight: "lighter",
            color: '#555',
        }

        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="fadeTransition"
                transitionAppear={true}
                transitionLeave={false}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                transitionAppearTimeout={500}
                className="center-align container">
                <div><img src="" /></div>
                <h2 className="light" style={style}>
                    Monetise with <strong>VR</strong>
                </h2>
                <br />
                <Link className="waves-effect orange waves-light btn"
                    to={this.state.next}>GET STARTED</Link>
            </ReactCSSTransitionGroup>
        );
    }
}

module.exports = HomeView 