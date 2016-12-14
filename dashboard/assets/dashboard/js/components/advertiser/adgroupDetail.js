import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import { SideBar } from './sidebar'
import Modal from 'react-modal'
import { FormInput } from '../common'
import { AdgroupEditModal } from './adgroupModal'
import { AdModal } from './adModal'


const customStyles = {
    content: {
        top: '20%',
        left: '20%',
        right: '20%',
        bottom: '20%',
        // marginRight: '-20%',
        // transform: 'translate(-20%, -20%)'
    }
};

/**
 * Store direct properties of campaigns which can be printed by map
 */

const adHeaders = {
    // 'Name': 'name',
    'URL': 'creativeUrl'
}

export class AdgroupDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({
            adgroupId: this.props.params.adgroupId
        });
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        }.bind(this);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/advertiser/adgroups/view/' + this.state.adgroupId,
            'GET',
            null,
            (response) => {
                var pricingId = response.pricing.id;
                response.pricing = pricingId;
                if (response.targeting && response.targeting.length > 0) {
                    this.setState(Object.assign({}, this.state, { adgroup: response, targeting: response.targeting[0] }))
                    // Change this when multiple targetings allowed
                } else {
                    this.setState(Object.assign({}, this.state, { adgroup: response }))
                }
            },
            (error) => {
                throw error;
            },
        );


    }


    openAgModal() {
        $('.modal').modal();
        $('#agForm').modal('open');
        this.setState(Object.assign({}, this.state, { agModalIsOpen: true }));
    }

    openAdModal() {
        $('.modal').modal();
        $('#adForm').modal('open');
        this.setState(Object.assign({}, this.state, { adModalIsOpen: true }));
    }


    postAdgroupEdit(adgroup) {
        this.setState(Object.assign({}, this.state, { adgroup: adgroup }))
    }

    postAdAddition(ad) {
        this.state.adgroup.unshift(ad);
        this.setState(Object.assign({}, this.state));
    }

    render() {
        if (!this.state.adgroup) {
            return <div></div> // TODO : Spinner
        }

        var fabStyle = {
            bottom: '50px',
            right: '50px'
        }

        var heightStyle = {
            height: '100%',
            minHeight: '100%',
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">
                                    {this.state.adgroup.name}
                                </span>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Total Budget</th>
                                            <th>Daily Budget</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="white-text text-darken-1">
                                            <td>{this.state.adgroup.totalBudget}</td>
                                            <td>{this.state.adgroup.dailyBudget}</td>

                                        </tr>
                                    </tbody></table>
                            </div>
                            <div className="card-action">
                                <a onClick={e => this.openAgModal()}>Edit</a>
                                <a onClick={e => this.openAdModal()}>Add Ads</a>
                            </div>
                        </div>
                    </div>
                </div>

                <AdgroupEditModal label="Edit Adgroup" saveMethod="PUT"
                    postSave={this.postAdgroupEdit.bind(this)} successStatus="200"
                    adgroupId={this.state.adgroup.id}
                    adgroup={this.state.adgroup}
                    targeting={this.state.targeting} />

                <AdModal label="Add Ads" saveMethod="POST"
                    postSave={this.postAdgroupEdit.bind(this)} successStatus="201"
                    adgroupId={this.state.adgroup.id} />



                <ReactCSSTransitionGroup
                    component="table"
                    transitionName="fadeTransitionFast"
                    transitionAppear={true}
                    transitionLeave={false}
                    transitionEnterTimeout={150}
                    transitionLeaveTimeout={150}
                    transitionAppearTimeout={150}
                    className="table highlight grey-text text-darken-4 col s12">
                    <thead>
                        <tr>
                            <th>Name</th>
                            {Object.keys(adHeaders).map(header => <th key={header}>{header}</th>)}
                            {//<th>Status</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.adgroup.ads.map(ad =>
                            <tr key={ad.id} className="grey-text text-darken-1">
                                <td>
                                    <Link to={'/advertiser/ad/' + ad.id + "/"}>
                                        {ad.name}
                                    </Link>
                                </td>
                                {Object.keys(adHeaders).map(key => <td key={key}>{ad[adHeaders[key]]}</td>)}
                            </tr>)
                        }
                    </tbody>
                </ReactCSSTransitionGroup>
            </div >
        );
    }
}
