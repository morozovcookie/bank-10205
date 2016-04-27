import React from 'react'

/** Component for Edit something.
 * @param {String} Type of input, that represent edit value
 * @param {Integer} EditId is html id.
 * @param {...} Value - initial of input
 * @param {String} FormName that for input will be attached
 * @param {Integer} LabelId i don't know what is it for
 * @param {Function} Change callback, on changing.
 * @param {Function} Focus callback, on focus.
 * @param {Function} Blur callback, on blur. (?)
 */
export default class Edit extends React.Component{
    render(){
        return (
            <div className="input-group">
                <span className="input-group-addon" id={this.props.LabelId}>{this.props.Label}</span>
                <input type={this.props.Type} className="form-control" id={this.props.EditId} value={this.props.Value}
                form={this.props.FormName} aria-describedby={this.props.LabelId} onChange={this.props.Change}
                onFocus={this.props.Focus} onBlur={this.props.Blur} />
            </div>
        );
    }
}
