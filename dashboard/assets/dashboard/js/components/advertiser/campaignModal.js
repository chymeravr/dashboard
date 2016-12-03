import React, { ReactDOM } from 'react'
import Modal from 'react-modal'


export class CampaignModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: props.modalIsOpen
        };
    }


    render() {
        console.info(this.state);
        return (
            <div></div>
        )
    }
}