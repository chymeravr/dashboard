import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import 'fuckadblock'
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
import ReactGA from 'react-ga'
import '../../../../../semantic/dist/semantic.min.css';
import { Grid, Container } from 'semantic-ui-react'

ReactGA.initialize('UA-89829978-1');

function logPageView() {
    console.info('logging to ga : ' + window.location.hash)
    ReactGA.set({ page: window.location.hash });
    ReactGA.pageview(window.location.hash);
}

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

        var isAdBlockDetected;
        // Function called if AdBlock is not detected
        function adBlockNotDetected() {
            isAdBlockDetected = false;
        }
        // Function called if AdBlock is detected
        function adBlockDetected() {
            isAdBlockDetected = true;
        }

        // Recommended audit because AdBlock lock the file 'fuckadblock.js' 
        // If the file is not called, the variable does not exist 'fuckAdBlock'
        // This means that AdBlock is present
        if (typeof fuckAdBlock === 'undefined') {
            adBlockDetected();
        } else {
            fuckAdBlock.onDetected(() => this.setAdBlockStatus(true));
            fuckAdBlock.onNotDetected(() => this.setAdBlockStatus(false));
        }

    }

    setAdBlockStatus(isAdBlockDetected) {
        this.setState(Object.assign({}, this.state, { adblock: isAdBlockDetected }));
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
            || currentRoute == 'home'
            || currentRoute == 'login') {
            align += "  ui center aligned grid";

            if (currentRoute != 'profile') { // Center profile but show logout button as well
                dashboard = false;
            }
        }

        var mainStyle = {

        }

        if (!this.state.adblock || currentRoute == "home") {
            return (
                <div className="Site">
                    <Header showLogout={dashboard} currentPath={this.props.location.pathname} />
                    <main className={"Site-content" + align}>
                        {this.props.children}
                    </main>
                    <Footer />
                </div>
            );
        } else {
            return (
                <div className="page-flexbox-wrapper" >
                    <Header showLogout={dashboard} currentPath={this.props.location.pathname} />
                    <main className={align} style={mainStyle}>
                        <div className="container center-align">
                            <ReactCSSTransitionGroup
                                component="div"
                                transitionName="fadeTransition"
                                transitionAppear={true}
                                transitionLeave={false}
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={500}
                                transitionAppearTimeout={500}
                                className="center-align container">
                                <div className="card-panel z-depth-3 red lighten-2 white-text ">
                                    LOOKS LIKE YOU HAVE ADBLOCK ENABLED. UNFORTUNATELY, ADBLOCK INCORRECTLY DETECTS ANY COMMUNICATION WITH OUR WEBSITE AS AD TRAFFIC AND BLOCKS IT.
                                <br />
                                    PLEASE DISABLE ADBLOCK TO CONTINUE USING OUR WEBSITE.
                            </div>
                            </ReactCSSTransitionGroup>
                        </div>
                    </main>
                    <Footer />
                </div>
            )
        }
    }
}

render((
    <Router history={hashHistory} onUpdate={logPageView} >
        <Route path="/" component={AppView}>
            <IndexRoute name="home" component={HomeView} />
            <Route name="login" path="/login" component={LoginForm} />
            <Route name="profile" path="/profile/" component={ProfileView} />} />
            <Route name="advertiser" path="/advertiser/" component={AdvertiserView} />
            <Route name="campaignDetail" path="/advertiser/campaigns/:campaignId" component={CampaignDetailView} />
            <Route name="adgroupDetail" path="/advertiser/adgroups/:adgroupId" component={AdgroupDetailView} />
            <Route name="publisher" path="/publisher/" component={PublisherView} />
            <Route name="appDetail" path="/publisher/apps/:appId" component={AppDetailView} />
        </Route>
    </Router>
), document.getElementById('root'))

