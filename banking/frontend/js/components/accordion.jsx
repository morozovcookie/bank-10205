import React from 'react';

/** Display single element. On click, this dropdown it's hidden content.
* @param {Object} event - Event, that was displayed
*/
export default class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            classNames: "col-md-12 col-sm-12 section",
            hover: false,
        };

        // es6 so funny.
        this.handleClick = this.handleClick.bind(this);
    }

	handleClick() {
        if(this.state.open) {
            this.setState({ open: false, classNames: "col-md-12 col-sm-12 section" });
        }
        else{
            this.setState({ open: true,  classNames: "col-md-12 col-sm-12 section open" });
        }
	}

    // like binding in constructor
	render() {
        var content = null;

        if (this.state.open) {
            content = this.props.children[1]
        }
        return (
			<div className={this.state.classNames} onClick={this.handleClick}>
                {this.props.children[0]}
                <div className="articlewrap">
                    {content}
                </div>
			</div>
		);
	}
}

Section.propTypes = {
        /** Expect, that given only 2 childrens: header and content for
         * dropdown. */
        children: function(props, propName, componentName){
            if (React.Children.count(props[propName]) < 2) {
                return new Error("EventSection takes 2 childrens: "
                                 +"header, and dropdown content");
            }
        },
};
