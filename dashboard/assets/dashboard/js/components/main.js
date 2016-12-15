import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6

import 'whatwg-fetch'

import HomeView from './home'
import Header from './header'
import Footer from './footer'
import { ProfileView } from './profile'
import { LoginForm } from './login'
import { AdvertiserView } from './advertiser/advertiser'
import { CampaignDetailView } from './advertiser/campaignDetail'
import { AdgroupDetailView } from './advertiser/adgroupDetail'
import { PublisherView } from './publisher/publisher'

import { debug } from '../lib.js'
// require('whatwg-fetch')

class AppView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        $('.button-collapse').sideNav();
    }

    render() {
        var props = {}
        // switch (this.props.children.props.route.name) {
        //     case 'login':
        //         props = {
        //             assignUser: this.assignUser.bind(this)
        //         }
        //         break;
        //     case 'login':
        //         break;
        //     default:
        //         break;
        // }
        var currentRoute = this.props.children.props.route.name;
        var align = "";
        var dashboard = true;
        if (!currentRoute
            || currentRoute == 'profile'
            || currentRoute == '/'
            || currentRoute == 'login') {
            align += " valign-wrapper";

            if (currentRoute != 'profile') { // Center profile but show logout button as well
                dashboard = false;
            }
        }
        return (
            <div className="page-flexbox-wrapper">
                <Header showLogout={dashboard} />
                <main className={align}>
                    {this.props.children}
                </main>
                {dashboard ? null : <Footer />}
            </div>
        );
    }
}

render((
    <Router history={hashHistory}>
        <Route path="/" component={AppView}>
            <IndexRoute component={HomeView} />
            <Route name="login" path="/login" component={LoginForm} />
            <Route name="profile" path="/profile/"
                component={ProfileView} />} />
            <Route name="advertiser" path="/advertiser/" component={AdvertiserView} />
            <Route name="campaignDetail" path="/advertiser/campaigns/:campaignId" component={CampaignDetailView} />
            <Route name="adgroupDetail" path="/advertiser/adgroups/:adgroupId" component={AdgroupDetailView} />
            <Route name="publisher" path="/publisher/" component={PublisherView} />
            {// <Route path="users" component={Users}>
                // </Route>
            }
        </Route>
    </Router>
), document.getElementById('root'))

