var React = require('react')

class Footer extends React.Component {
    render() {
        var style = {
            fontWeight: "lighter",
            color: '#ffffff',
            marginTop: '0px'
        }

        return (
            <footer className="page-footer" style={style}>
                <div className="container">
                    <div className="row">
                        <div className="col s6">
                            <h5 className="white-text">Links</h5>
                            <ul>
                                <li><a className="grey-text text-lighten-3" href="#!">Link 1</a></li>
                                <li><a className="grey-text text-lighten-3" href="#!">Link 2</a></li>
                            </ul>
                        </div>
                         <div className="col s6 offset-6">
                            <a className="grey-text text-lighten-4 right" href="#!">© 2016 Copyright</a>
                        </div>
                    </div>
                </div>

            </footer>
        );
    }
}

module.exports = Footer