import React from 'react'
import { debug } from '../lib.js'
import { config } from '../config.js'

export class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        debug('Profile View', props);
        debug(null, config);
    }

    render() {
        return (
            <div>
                <div className="container">
                    Logged in as {this.props.params.username};
                </div>
            </div>
        );
    }
}
