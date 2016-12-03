import { React, ReactDOM } from 'react'
import { Modal } from 'react-modal'

class CampaignEditModal extends React.Component {
    render() {
        return (
            <Modal
                isOpen={bool}
                onAfterOpen={afterOpenFn}
                onRequestClose={requestCloseFn}
                closeTimeoutMS={n}
                shouldCloseOnOverlayClick={false}
                style={customStyle}
                contentLabel="No Overlay Click Modal"
                >

                <h1>Force Modal</h1>
                <p>Modal cannot be closed when clicking the overlay area</p>
                <button onClick={handleCloseFunc}>Close Modal...</button>
            </Modal>
        )
    }
}