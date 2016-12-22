var React = require('react')
import { hashHistory } from 'react-router'
import { logout } from '../lib'
import { config } from '../config'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showHeader: props.showLogout }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showHeader: nextProps.showLogout});
    }

    render() {
        var style = {
            fontWeight: "lighter",
            color: '#ffffff',
        }

        if (this.state.showHeader && localStorage.getItem(config.jwt.tokenKey)) {
            var logoutButton = (
                <li>
                    <a className="modal-action waves-effect waves-blue btn-flat white blue-text"
                        onClick={e => logout(hashHistory)}>
                        Logout
                    </a>
                </li>)
        } else {
            var logoutButton = ""
        }


        var Links = (
            <div>
                {// <li><a href="sass.html">Sass</a></li>
                // <li><a href="badges.html">Components</a></li>
                // <li><a href="collapsible.html">Javascript</a></li>
                // <li><a href="mobile.html">Mobile</a></li>
                }
                {logoutButton}
            </div>
        );
        return (
            <header>
                <nav>
                    <div className="nav-wrapper container">
                        <a href="/" className="brand-logo" style={style}>Chymera <strong>VR</strong></a>
                        <a href="#" data-activates="mobile-demo" className="button-collapse"
                            ref={select => this._select = select}>
                            <i className="material-icons">menu</i></a>
                        <ul className="right hide-on-med-and-down">
                            {Links}
                        </ul>
                        <ul className="side-nav" id="mobile-demo">
                            {Links}
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

module.exports = Header