import React, { ReactDOM } from 'react'
import Modal from 'react-modal'
import { FormInput, NumberInput } from '../common'
import { callRawApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'

export class AdModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({
            ad: {
                adgroup: props.adgroupId,
            }
        }, JSON.parse(JSON.stringify(props)));
        this.postSave = props.postSave;
    }


    validateState() {
        var valid = true; // TODO
        this.setState(Object.assign({}, this.state, { valid: valid }));
    }

    handleChange(key) {
        return function(e) {
            this.state.ad[key] = e.target.value;
            var newAd = Object.assign({}, this.state.ad);
            newAd[key] = e.target.value;
            // Reired to update state
            this.setState(Object.assign({}, this.state, { ad: newAd }));
            this.validateState();
        };
    }

    componentDidMount() {
        const that = this;
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: true, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });
    }

    saveAd() {
        const jwtToken = localStorage.getItem(config.jwt.tokenKey);
        var data = new FormData(); data.append("name", this.state.ad.name);
        data.append("adgroup", this.state.ad.adgroup);
        data.append("creative", this.state.ad.creative);
        fetch('/user/api/advertiser/ad/', {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': 'JWT ' + jwtToken,
            }
        }).then(response => {
            if (response.status != 201) {
                throw new Error(response.statusText)
            }
            return response.json();
        }).then(ad => {
            this.postSave(ad)
        }).catch(error => {
            console.info(error)
        });
    }

    componentDidUpdate() {
        $('.tooltipped').tooltip({ delay: 25 });

    }

    setFile() {
        console.info('File path detected');
        var oFReader = new FileReader();
        const file = document.getElementById("adPath").files[0];
        this.state.ad.creative = file;
        this.setState(Object.assign({}, this.state))
        oFReader.readAsDataURL(file);
        oFReader.onload = function(oFREvent) {
            document.getElementById("adPreview").src = oFREvent.target.result;
        };
    }

    render() {
        if (this.state.valid) {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn-flat teal white-text"
                    onClick={e => this.saveAd()}>
                    Save
                </a>
        } else {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn-flat teal white-text disabled"
                    onClick={e => this.saveAd()}>
                    Save
                </a>
        }

        return (
            <div>
                <div id="adForm" className="modal modal-fixed-footer">
                    <div className="modal-content valign-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col s8">
                                    <FormInput
                                        fieldName="name"
                                        label="Ad Name"
                                        value={this.state.ad.name}
                                        handleChange={this.handleChange('name').bind(this)} />
                                </div>

                            </div>
                            <div className="row">
                                <div className="file-field input-field">
                                    <div className="btn">
                                        <span>Creative File</span>
                                        <input id="adPath" type="file" onChange={e => this.setFile()} />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" type="text" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <img className="materialboxed" id="adPreview" data-caption="Preview" width="100%" />

                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {saveButton}
                    </div>
                </div >
            </div>
        )
    }
}