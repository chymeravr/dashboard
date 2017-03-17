var React = require('react')
import { Table, Label } from 'semantic-ui-react'
import { debug } from '../lib'

export class ImgUploadColumn extends React.Component {
    constructor(props) {
        super(props);
        this.label = props.label;
        this.onImgFileChange = props.onImgFileChange;
        this.state = {
            src: props.src
        }
        this.height = props.height ? props.height : '150px';
        this.width = props.width ? props.width : '150px';
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ src: nextProps.src })
    }

    render() {
        // debug("imageUpload", this.state);


        return (
            <Table.Cell collapsing onClick={() => this.fileInput.click()} style={{ width: this.width }}>
                <img style={{ margin: "0px auto" }} className="ui image" id={this.label} data-caption="Preview" height={this.height} src={this.state.src} />
                <span>{this.label}</span>
                <input type="file" ref={input => this.fileInput = input} onChange={e => this.onImgFileChange(e)} />
            </Table.Cell>

        );
    }
}