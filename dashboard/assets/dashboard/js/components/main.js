var React = require('react')
var ReactDOM = require('react-dom')
var HomeView = require('./home')
var Header = require('./header')
var Footer = require('./footer')

var LoginForm = require('./login')

var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute
var Link = require('react-router').Link
var hashHistory = require('react-router').hashHistory

require('whatwg-fetch')

class AppView extends React.Component {

    componentDidMount() {
        $('.button-collapse').sideNav();
    }

    render() {
        return (
            <div className="page-flexbox-wrapper">
                <Header />
                <br />
                <main>
                    {this.props.children}
                </main>
                <Footer />
            </div>
        );
    }
}

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={AppView}>
            <IndexRoute component={HomeView} />
            <Route path="/login" component={LoginForm} />
            {// <Route path="users" component={Users}>
                //     <Route path="/user/:userId" component={User} />
                // </Route>
            }
        </Route>
    </Router>
), document.getElementById('root'))