import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import 'whatwg-fetch'

import HomeView from './home'
import Header from './header'
import Footer from './footer'
import { ProfileView } from './profile'
import LoginForm from './login'

import { debug } from '../lib.js'
// require('whatwg-fetch')

class AppView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.state.username = 'rubbalsidhu';
        this.initializeRandom = this.initializeRandom.bind(this);
        this.initializeRandom();
    }

    initializeRandom() {
        // setInterval(() => {
        //     console.info("Triggering");
        //     this.setState({
        //         username: Math.random().toString(36).substring(7)
        //     });
        // }, 10000);
    }

    assignUser(user) {
        this.props.user = user;
    }

    componentDidMount() {
        $('.button-collapse').sideNav();
    }

    render() {
        debug("Rendering AppView", this.props);
        var props = {}
        switch (this.props.children.props.route.name) {
            case 'login':
                props = {
                    assignUser: this.assignUser.bind(this)
                }
                break;
            case 'login':
                break;
            default:
                break;
        }
        debug("children props", props);
        return (
            <div className="page-flexbox-wrapper">
                <Header />
                <br />
                <main>
                    {React.cloneElement(this.props.children, props)}
                </main>
                <Footer />
            </div>
        );
    }
}

render((
    <Router history={hashHistory}>
        <Route path="/" component={AppView}>
            <IndexRoute component={HomeView} />
            <Route name="login" path="/login" component={LoginForm} />
            <Route name="profile" path="/profile/:username"
                component={ProfileView} />} />

            {// <Route path="users" component={Users}>
                //     <Route path="/user/:userId" component={User} />
                // </Route>
            }
        </Route>
    </Router>
), document.getElementById('root'))

