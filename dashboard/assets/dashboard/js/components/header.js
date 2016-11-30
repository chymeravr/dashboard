var React = require('react')

class Header extends React.Component {
    render() {
        var style = {
            fontWeight: "lighter",
            color: '#ffffff',
        }

        var Links = (
            <div>
                <li><a href="sass.html">Sass</a></li>
                <li><a href="badges.html">Components</a></li>
                <li><a href="collapsible.html">Javascript</a></li>
                <li><a href="mobile.html">Mobile</a></li>
            </div>
        );
        return (
            <header>
                <nav>
                    <div className="nav-wrapper">
                        <a href="#" className="brand-logo" style={style}>Chymera <strong>VR</strong></a>
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