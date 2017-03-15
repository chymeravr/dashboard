var React = require('react')
import { Table } from 'semantic-ui-react'
import { debug } from '../lib'

export class ImgUploadColumn extends React.Component {
    constructor(props) {
        super(props);
        this.label = props.label;
        this.onImgFileChange = props.onImgFileChange;
        this.state = {

        }
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        debug("imageUpload", this.state);


        return (
            <Table.Cell collapsing onClick={() => this.fileInput.click()} style={{ width: "150px" }}>
                <img className="ui image" id={this.label} data-caption="Preview" height="150px"/>
                <span>{this.label}</span>
                <input type="file" ref={input => this.fileInput = input} onChange={e => this.onImgFileChange(e)} />
            </Table.Cell>
        );
    }
}