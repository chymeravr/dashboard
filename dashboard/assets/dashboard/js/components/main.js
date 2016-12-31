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
import { AppDetailView } from './publisher/appDetail'
import { debug, callApiWithJwt } from '../lib.js'

class AppView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        $('.button-collapse').sideNav();
        $("input").keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                $("form").submit();
            }
        });

        if (this.props.children.props.route.name == 'home') {
            callApiWithJwt('/user/api/view_profile',
                'GET',
                null,
                (response) => hashHistory.push('/profile/'),
                (error) => {

                }
            );
        }
    }

    componentDidUpdate() {
        $("input").keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                $("form").submit();
            }
        });
    }

    render() {
        var props = {}
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

        var mainStyle = {
            "flex": "1 1 auto",
            "overflowY": "auto",
            "minHeight": "0px"
        }

        return (
            <div className="page-flexbox-wrapper" >
                <Header showLogout={dashboard} />
                <main className={align} style={mainStyle}>
                    {this.props.children}
                </main>
                <Footer />
            </div>
        );
    }
}

render((
    <Router history={hashHistory}>
        <Route path="/" component={AppView}>
            <IndexRoute name="home" component={HomeView} />
            <Route name="login" path="/login" component={LoginForm} />
            <Route name="profile" path="/profile/"
                component={ProfileView} />} />
            <Route name="advertiser" path="/advertiser/" component={AdvertiserView} />
            <Route name="campaignDetail" path="/advertiser/campaigns/:campaignId" component={CampaignDetailView} />
            <Route name="adgroupDetail" path="/advertiser/adgroups/:adgroupId" component={AdgroupDetailView} />
            <Route name="publisher" path="/publisher/" component={PublisherView} />
            <Route name="appDetail" path="/publisher/apps/:appId" component={AppDetailView} />
        </Route>
    </Router>
), document.getElementById('root'))

