import React, { ReactDOM } from 'react'
import { FormInput, NumberInput } from '../common'
import { callRawApiWithJwt, debug, getCreativeType } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'
import { Grid, Card, Table, Checkbox, Button, Icon, Header, Modal, Form, Input, Select, Radio, Dimmer, Loader, Dropdown } from 'semantic-ui-react'
import { ImgUploadColumn } from '../imageUpload'
import { CubeMonoFormat } from './formats/cubeMono'
import { EquiMonoFormat } from './formats/equiMono'
import { CubeStereoFormat } from './formats/cubeStereo'
import { EquiStereoFormat } from './formats/equiStereo'

const creativeFormatOptions = Object.keys(config.creativeFormats).map(id => {
    return { key: id, text: config.creativeFormats[id], value: id };
});


const visionOptions = Object.keys(config.vision).map(id => {
    return { key: id, text: config.vision[id], value: id };
});


export class AdModal extends React.Component {
    constructor(props) {
        super(props);
        this.adgroupId = props.adgroupId;
        this.state = Object.assign({
            ad: {
                adgroup: props.adgroupId,
                stereo: config.defaultStereo,
                creativeFormat: config.defaultCreativeFormat,
                vision: config.defaultVision
            },
            uploading: false,
            open: props.open
        }, JSON.parse(JSON.stringify(props)));
        this.postSave = props.postSave;
        this.closeModal = props.closeModal;
        this.saveAd = this.saveAd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateState = this.validateState.bind(this);
        this.setCreative = this.setCreative.bind(this);
        this.setCreativeFormat = this.setCreativeFormat.bind(this);
        this.setVision = this.setVision.bind(this);
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
        var data = new FormData();
        const ad = this.state.ad;

        data.append("name", ad.name);
        data.append("adgroup", ad.adgroup);
        data.append("creative", ad.creative);
        data.append("landingPage", ad.landingPage);
        data.append("adType", getCreativeType(ad.creativeFormat, ad.vision));
        
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
            this.postSave(ad);
            // Clear ad data
            this.state.ad = {
                adgroup: this.adgroupId,
                stereo: config.defaultStereo,
                creativeFormat: config.defaultCreativeFormat,
                vision: config.defaultVision
            };

            this.setState(Object.assign({}, this.state, {
                uploading: false
            }));
        }).catch(error => {
            console.error(error)
            this.setState(Object.assign({}, this.state, { uploading: false }));
        });
    }

    setCreative(imgData) {
        this.state.ad.creative = imgData;
        this.setState(Object.assign({}, this.state), this.validateState)
    }

    setCreativeFormat(e, d) {
        var ad = Object.assign(this.state.ad, {
            creativeFormat: d.value
        });
        this.setState(Object.assign({}, this.state, { ad: ad }), this.validateState);
    }

    setVision(e, d) {
        var ad = Object.assign(this.state.ad, {
            vision: d.value
        });
        this.setState(Object.assign({}, this.state, { ad: ad }), this.validateState);
    }

    render() {
        const ad = this.state.ad;
        var adInput;
        switch (ad.creativeFormat) {
            case '0':
                switch (ad.vision) {
                    case '0': adInput = <EquiMonoFormat onCreativeAddition={(img) => this.setCreative(img)} />; break
                    case '1': adInput = <EquiStereoFormat onCreativeAddition={(img) => this.setCreative(img)} />; break
                }
                break;
            case '1':
                switch (ad.vision) {
                    case '0': adInput = <CubeMonoFormat onCreativeAddition={(img) => this.setCreative(img)} />; break
                    case '1': adInput = <CubeStereoFormat onCreativeAddition={(img) => this.setCreative(img)} />; break
                }
                break;
        }

        return (
            <Modal open={this.state.open} onClose={this.closeModal} dimmer='blurring'>
                <Modal.Header>{this.label}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field control={Input} label='Ad name' placeholder='Ad name' onChange={this.handleChange('name')} value={ad.name} />
                        <Form.Field control={Input} label='Landing URL' placeholder='URL to redirect clicks to'
                            onChange={this.handleChange('landingPage')} value={ad.landingPage} />
                        <Form.Group>

                        </Form.Group>
                        <Form.Group>
                            <Form.Field control={Dropdown} selection label='Creative Format' options={creativeFormatOptions} placeholder='Creative Format'
                                onChange={this.setCreativeFormat} value={ad.creativeFormat + ''} />
                            <Form.Field control={Dropdown} selection label='Vision' options={visionOptions} placeholder='Vision'
                                onChange={this.setVision} value={ad.vision + ''} />
                        </Form.Group>
                        <Grid>
                            <Grid.Row columns={1}>
                                <Grid.Column width={16}>
                                    <Form.Field>
                                        <label>Creative</label>
                                    </Form.Field>
                                    {adInput}
                                </Grid.Column>
                            </Grid.Row>
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