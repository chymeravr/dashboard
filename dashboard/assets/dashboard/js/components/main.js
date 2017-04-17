import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import 'fuckadblock'
import 'whatwg-fetch'
import 'particlesjs'

import { HomeView } from './home'
import Header_C from './header_c'
import Footer from './footer'
import { ProfileView } from './profile'
import { ContactView } from './contact'
import { CareerView } from './careers'
import Login_C from './login_c'
import { TermsView } from './terms'
import { AdvertiserView } from './advertiser/advertiser'
import { CampaignDetailView } from './advertiser/campaignDetail'
import { AdgroupDetailView } from './advertiser/adgroupDetail'
import { PublisherHomeView } from './publisher/publisherHome'
import { AdvertiserHomeView } from './advertiser/advertiserHome'
import { PublisherView } from './publisher/publisher'
import { AppDetailView } from './publisher/appDetail'
import { debug, callApiWithJwt, callRawApiWithJwt } from '../lib.js'
import { config } from '../config'
import ReactGA from 'react-ga'
import '../../../../../semantic/dist/semantic.min.css';
import { Grid, Container, Message } from 'semantic-ui-react'
import { createStore, store } from 'redux'
import { Provider, connect } from 'react-redux'
import loginApp from '../redux/loginReducers'
import { loginSucceeded } from '../redux/loginActions'

ReactGA.initialize('UA-89829978-1');

let loginStore = createStore(loginApp)

function logPageView() {
    window.scrollTo(0, 0);
    ReactGA.set({ page: window.location.hash });
    ReactGA.pageview(window.location.hash);
}

let createHandlers = function(dispatch) {
    return {
        checkLogin: () => {
            callApiWithJwt('/user/api/view_profile',
                'GET',
                null,
                (response) => { console.info(response); loginStore.dispatch(loginSucceeded(response.user.username)) },
                (error) => { }
            );
        },
    }
}

class AppView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handlers = createHandlers(this.props.dispatch);
    }

    componentWillMount() {
        this.handlers.checkLogin();
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

    render() {
        debug("main", this.state);
        var props = {}
        var currentRoute = this.props.children.props.route.name;
        var align = "";
        if (!currentRoute
            || currentRoute == 'profile'
            || currentRoute == 'home'
            || currentRoute == 'login') {
            align += "  ui center aligned grid";
        }
        var transparent = false;
        if (['publisher', 'advertiser'].indexOf(currentRoute) >= 0) {
            transparent = true;
        }

        if (!this.state.adblock || ['home', 'contact', 'careers', 'advertiser', 'publisher'].indexOf(currentRoute) >= 0) {
            return (
                <div className="Site">
                    <Header_C currentPath={this.props.location.pathname} transparent={transparent} handleLogout={this.handleLogout} />
                    {this.props.children}
                    <Footer />
                </div>
            );
        } else {
            return (
                <div className="Site">
                    <Header_C currentPath={this.props.location.pathname} handleLogout={this.handleLogout} />
                    <main className="Site-content ui center aligned" style={{ backgroundColor: '#008FCB' }}>
                        <Grid centered columns={16} style={{ margin: 0 }} verticalAlign='middle'>
                            <Grid.Row columns={16} verticalAlign='middle' style={{ height: '92vh' }}>
                                <Grid.Column width={10}>
                                    <Message negative>
                                        <Message.Header>Disable AdBlock</Message.Header>
                                        <p>Please turn off AdBlock to navigate the site. Adblock falsely marks our API requests as Ads</p>
                                    </Message>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </main >
                    <Footer />
                </div>
            )
        }
    }

}


render((
    <Provider store={loginStore}>
        <Router history={hashHistory} onUpdate={logPageView} >
            <Route path="/" component={connect()(AppView)}>
                <IndexRoute name="home" component={HomeView} />
                <Route name="contact" path="/contact/" component={ContactView} />
                <Route name="career" path="/careers/" component={CareerView} />
                <Route name="terms" path="/terms/" component={TermsView} />
                <Route name="login" path="/login/" component={Login_C} />
                <Route name="profile" path="/profile/" component={ProfileView} />} />
                <Route name="advertiser" path="/advertiser/" component={AdvertiserHomeView} />
                <Route name="advertiserDashbooard" path="/dashboard/advertiser/" component={AdvertiserView} />
                <Route name="publisherDashbooard" path="/dashboard/publisher/" component={PublisherView} />
                <Route name="campaignDetail" path="/advertiser/campaigns/:campaignId" component={CampaignDetailView} />
                <Route name="adgroupDetail" path="/advertiser/adgroups/:adgroupId" component={AdgroupDetailView} />
                <Route name="publisher" path="/publisher/" component={PublisherHomeView} />
                <Route name="appDetail" path="/publisher/apps/:appId" component={AppDetailView} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('root'))

let sitemapFunction = (() => {
    return (
        <urlset>
            <url><loc>http://chymeravr.com</loc><priority>0.5</priority></url>
            <url><loc>http://chymeravr.com/#/advertiser/</loc><priority>0.5</priority></url>
            <url><loc>http://chymeravr.com/#/publisher/</loc><priority>0.5</priority></url>
            <url><loc>http://chymeravr.com/#/careers</loc><priority>0.5</priority></url>
            <url><loc>http://chymeravr.com/</loc><priority>0.5</priority></url>
            <url><loc>http://chymeravr.com/#/terms</loc><priority>0.5</priority></url>
            <url><loc>http://chymeravr.com/#/contact</loc><priority>0.5</priority></url>
            <url><loc>http://chymeravr.com/#/terms</loc><priority>0.5</priority></url>


        </urlset>
    )
});
