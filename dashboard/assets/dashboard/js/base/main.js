var React = require('react')
var ReactDOM = require('react-dom')
var HomeView = require('./home')
var Header = require('./header')
var Footer = require('./footer')

var LoginForm = require('./../user/login')

var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link
var hashHistory = require('react-router').hashHistory

require('whatwg-fetch')

class AppView extends React.Component {

    componentDidMount() {
        $('.button-collapse').sideNav();
    }

    constructor(props) {
        super(props);
        this.state = Object.assign(
            { header: Header },
            { footer: Footer },
            { container: <LoginForm /> },
            props
        )
    }

    render() {
        return (
            <div className="page-flexbox-wrapper">
                <this.state.header />
                <main>
                   
                    {this.props.children}
                </main>
                <this.state.footer />
            </div>
        );
    }
}

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={AppView}>
            <Route path="login" component={LoginForm} />
            {// <Route path="users" component={Users}>
                //     <Route path="/user/:userId" component={User} />
                // </Route>
            }
            <Route path="*" component={AppView} />
        </Route>
    </Router>
), document.getElementById('root'))