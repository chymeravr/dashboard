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
            <div className="input-field row">
                <input id={this.fieldName} type={this.type} value={this.state.value}
                    onChange={this.handleChange} />
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
            <div className="input-field row">
                <input id={this.fieldName} type="number" min="0" value={this.state.value}
                    onChange={this.handleChange} className="validate" step="any"/>
                <label htmlFor={this.fieldName} data-error="Enter a positive value" className={this.state.value == 0 || this.state.value ? "active" : ""}>
                    {this.label}
                </label>
            </div>
        )
    }
}