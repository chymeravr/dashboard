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