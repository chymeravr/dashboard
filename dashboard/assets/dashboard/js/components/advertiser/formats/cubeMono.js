var React = require('react')
import { Table, Button } from 'semantic-ui-react'
import { debug } from '../../../lib'
import { ImgUploadColumn } from '../../imageUpload'

export class CubeMonoFormat extends React.Component {
    constructor(props) {
        super(props);
        this.onCreativeAddition = props.onCreativeAddition;
        this.state = {

        }
        this.convertToEqui = this.convertToEqui.bind(this);
        this.setFile = this.setFile.bind(this);
        this.setFileName = this.setFileName.bind(this);
    }

    setFile(file, label) {
        const that = this;
        var oFReader = new FileReader();
        oFReader.readAsDataURL(file);
        oFReader.onload = function (oFREvent) {
            document.getElementById(label).src = oFREvent.target.result;
            that.state[label + "ImageData"] = oFREvent.target.result;
            that.setState(Object.assign({}, this.state), this.validateState)
        };

    }

    setFileName(label) {
        return e => {
            this.setFile(e.target.files[0], label);
            const fileObject = {}
            fileObject[label] = e.target.files[0];
            this.setState(Object.assign({}, this.state, fileObject))
        };
    }

    convertToEqui() {
        var c = document.getElementById("workingCanvas");
        var ctx = c.getContext("2d");
        // const img = new Image();
        // img.src = this.state.topImageData;
        // ctx.drawImage(img, 0, 0, 1024, 1024);
        // var data = ctx.getImageData(0, 0, 1024, 1024);
        // console.info(data);

        // img.src = this.state.bottomImageData;
        // ctx.drawImage(img, 100, 0, 100, 100);
        // var data = ctx.getImageData(0, 0, 1024, 1024).data;



        var width = 4096,
            height = 2048,
            buffer = new Uint8ClampedArray(width * height * 4);

        var m_theta = 0;
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var x = 2 * i / width - 1;
                var y = j / height;


                var phi = x * Math.PI
                var theta = y * Math.PI
                m_theta = Math.max(m_theta, theta)
                var p_x = Math.cos(phi) * Math.sin(theta)
                var p_y = Math.sin(phi) * Math.sin(theta)
                var p_z = Math.cos(phi)

                const pi = Math.PI;

                var pos = (j * width + i) * 4; // position in buffer based on x and y

                if (pi / 4 < theta && theta < 3 * pi / 4) {
                    if (phi > - pi / 4 && phi < pi / 4) buffer[pos] = 0;
                    else if (phi > pi / 4 && phi < 3 * pi / 4) buffer[pos] = 100;
                    else if (phi > - 3 * pi / 4 && phi < -pi / 4) buffer[pos] = 200;
                    else buffer[pos] = 220;
                } else {
                    buffer[pos + 1] = 220;
                }

                buffer[pos + 3] = 255;           // set alpha channel

            }
        }
        console.info(theta)
        // create imageData object
        var idata = ctx.createImageData(width, height);

        // set our buffer as source
        idata.data.set(buffer);
        ctx.putImageData(idata, 0, 0)

        var previewCanvas = document.getElementById("previewCanvas");
        var previewContext = previewCanvas.getContext("2d");
        var previewImg = new Image();
        previewImg.src = c.toDataURL();
        previewContext.drawImage(previewImg, 0, 0, 4096, 4096, 0, 0, 300, 300)

        console.info(this.state)
    }

    render() {
        debug("equiMono", this.state);

        return (
            <div>
                <Table celled collapsing padded={false} style={{ padding: 0 }}>
                    <Table.Body>
                        <Table.Row>
                            <ImgUploadColumn label="top" onImgFileChange={e => this.setFileName("top")(e)} />
                            <ImgUploadColumn label="left" onImgFileChange={e => this.setFileName("left")(e)} />
                            <ImgUploadColumn label="front" onImgFileChange={e => this.setFileName("front")(e)} />
                        </Table.Row>
                        <Table.Row>
                            <ImgUploadColumn label="bottom" onImgFileChange={e => this.setFileName("bottom")(e)} />
                            <ImgUploadColumn label="right" onImgFileChange={e => this.setFileName("right")(e)} />
                            <ImgUploadColumn label="back" onImgFileChange={e => this.setFileName("back")(e)} />
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Button positive content="Convert" onClick={this.convertToEqui} />
                <canvas id="workingCanvas" height="2048" width="4096" style={{ display: "none" }} />
                <canvas id="previewCanvas" />
            </div>
        );
    }
}