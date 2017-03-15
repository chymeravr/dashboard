import React, { ReactDOM } from 'react'
import { FormInput, NumberInput } from '../common'
import { callRawApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'
import { Grid, Card, Table, Checkbox, Button, Icon, Header, Modal, Form, Input, Select, Radio, Dimmer, Loader } from 'semantic-ui-react'
import { ImgUploadColumn } from '../imageUpload'
import { CubeMonoFormat } from './formats/cubeMono'

export class AdModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({
            ad: {
                adgroup: props.adgroupId,
            },
            uploading: false,
            open: props.open
        }, JSON.parse(JSON.stringify(props)));
        this.postSave = props.postSave;
        this.closeModal = props.closeModal;
        this.setFile = this.setFile.bind(this)
        this.saveAd = this.saveAd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateState = this.validateState.bind(this);
        this.setFileName = this.setFileName.bind(this);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, { open: nextProps.open }))
    }

    validateState() {
        var valid = this.state.ad && this.state.ad.creative && this.state.ad.landingPage && this.state.ad.name;
        valid = valid && this.state.ad.landingPage.length > 0
        this.setState(Object.assign({}, this.state, { valid: valid }));
    }

    handleChange(key) {
        return (e, d) => {
            this.state.ad[key] = e.target.value;
            var newAd = Object.assign({}, this.state.ad);
            newAd[key] = e.target.value;
            // Reired to update state
            this.setState(Object.assign({}, this.state, { ad: newAd }), this.validateState);
        };
    }

    saveAd() {
        this.setState(Object.assign({}, this.state, { uploading: true }));
        const jwtToken = localStorage.getItem(config.jwt.tokenKey);
        var data = new FormData(); data.append("name", this.state.ad.name);
        data.append("adgroup", this.state.ad.adgroup);
        data.append("creative", this.state.ad.creative);
        data.append("landingPage", this.state.ad.landingPage);
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
            this.setState(Object.assign({}, this.state, { uploading: false }));
        }).catch(error => {
            console.info(error)
            this.setState(Object.assign({}, this.state, { uploading: false }));
        });
    }

    setFile(file, label) {
        var oFReader = new FileReader();
        this.state.ad.creative = file;
        oFReader.readAsDataURL(file);
        oFReader.onload = function (oFREvent) {
            document.getElementById(label).src = oFREvent.target.result;
        };
        this.setState(Object.assign({}, this.state), this.validateState)

    }

    setFileName(label) {
        return e => {
            this.setFile(e.target.files[0], label);
            const fileObject = {}
            fileObject[label] = e.target.files[0];
            this.setState(Object.assign({}, this.state, fileObject))
        };
    }

    render() {
        debug("adModal", this.state);
        const ad = this.state.ad;

        return (
            <Modal open={this.state.open} onClose={this.closeModal} dimmer='blurring'>
                <Modal.Header>{this.label}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field control={Input} label='Ad name' placeholder='Ad name' onChange={this.handleChange('name')} value={ad.name} />
                        <Form.Field control={Input} label='Landing URL' placeholder='URL to redirect clicks to' onChange={this.handleChange('landingPage')} value={ad.landingPage} />


                        <Grid centered>
                            <CubeMonoFormat onCreativeAddition={() => console.info("done")} />
                        </Grid>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive content="Create" disabled={!this.state.valid} onClick={this.saveAd} />
                </Modal.Actions>
                <Dimmer active={this.state.uploading} inverted>
                    <Loader>Uploading File..</Loader>
                </Dimmer>
            </Modal>
        )
    }
}