import React from 'react';

/** Display single element. On click, this dropdown it's hidden content.
* @param {Object} event - Event, that was displayed
*/
export default class AccordSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };

        // es6 so funny.
        this.handleClick = this.handleClick.bind(this);
    }

	handleClick(e) {
        if(this.state.open) {
            this.setState({ open: false });
        }
        else{
            this.setState({ open: true });
        }
	}

    // like binding in constructor
	render() {
        var content = null;
        var classes = "col-md-12 col-sm-12 section";
        if (this.state.open) {
            content = this.props.children[1]
            classes += " open"
        }
        return (
			<div className={classes} onClick={this.handleClick}>
                {this.props.children[0]}
                <div className="articlewrap">
                    {content}
                </div>
			</div>
		);
	}
}

AccordSection.propTypes = {
        /** Expect, that given only 2 childrens: header and content for
         * dropdown. */
        children: function(props, propName, componentName){
            if (React.Children.count(props[propName]) < 2) {
                return new Error("EventSection takes 2 childrens: "
                                 +"header, and dropdown content");
            }
        },
};
