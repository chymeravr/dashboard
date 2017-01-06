import React from 'react'

export class FormInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = props.handleChange;
        this.fieldName = props.fieldName;
        this.label = props.label;
        this.state = {
            value: props.value,
        }
        this.type = props.type ? props.type : "text";
    }

    componentWillReceiveProps(nextProps) {
        this.state.value = nextProps.value;
    }

    render() {
        return (
            <div className="input-field">
                <input id={this.fieldName} type={this.type} value={this.state.value}
                    onChange={this.handleChange} className="validate"/>
                <label htmlFor={this.fieldName} className={this.state.value && this.state.value.length > 0 ? "active" : ""}>
                    {this.label}
                </label>
            </div>
        )
    }
}

export class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = props.handleChange;
        this.fieldName = props.fieldName;
        this.label = props.label;
        this.state = {
            value: props.value,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.state.value = nextProps.value;
    }

    render() {
        return (
            <div className="input-field">
                <input id={this.fieldName} type="number" min="0" value={this.state.value}
                    onChange={this.handleChange} className="validate" step="any" />
                <label htmlFor={this.fieldName} data-error="Enter a positive value" className={this.state.value == 0 || this.state.value ? "active" : ""}>
                    {this.label}
                </label>
            </div>
        )
    }
}

export const spinner = (
    <div className="progress blue" style={{ top: "-8px", position: "fixed" }}>
        <div className="indeterminate white"></div>
    </div>
)

export class PageHeading extends React.Component {
    constructor(props) {
        super(props);
        this.title = props.title;
        this.buttonText = props.buttonText;
        this.onClick = props.onClick;
    }

    render() {
        return (
            <div className="row">
                <h4 className=" right">{this.title}</h4>
                <br />
                <a className="waves-effect waves-light btn-large s2" onClick={this.onClick}>
                    <i className="material-icons left">add</i>
                    {this.buttonText}
                </a>
            </div>
        )
    }
}