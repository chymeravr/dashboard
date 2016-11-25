var React = require('react')
var ReactDOM = require('react-dom')
var HomeView = require('./home')
var LoginForm = require('./../user/login')

require('whatwg-fetch')

// Set the initial app state
var state = {
    location: window.location.hash
};

function navigated() {
    setState({
        location: window.location.hash
    });
}

class AppView extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign(
            { header: LoginForm },
            { footer: LoginForm },
            { container: <LoginForm/> },
            props
        )
    }

    render() {
        return (
            <div>
                <this.state.header />
                {this.state.container}
                <this.state.footer />
            </div>
        );
    }
}
// Handle browser navigation events
window.addEventListener('hashchange', navigated, false);

// Make the given changes to the state and perform any required housekeeping
function setState(changes) {
    var component;
    Object.assign(state, changes);

    switch (state.location) {
        case '#/login':
            component = (
                <LoginForm />
            );
            break;
        case '#/profile':
            component = (
                <div>
                    Welcome {state.username}
                </div>
            );
            break;
        default:
            component = (<HomeView />)
    }

    console.info(component);
    ReactDOM.render(
        <AppView container={component = component} />,
        document.getElementById('root')
    );
}

// Handle browser navigation events
window.addEventListener('hashchange', navigated, false);

// Start the app
navigated();