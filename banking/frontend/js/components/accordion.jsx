import React from 'react';

/** Display single element. On click, this dropdown it's hidden content.
* @param {Object} event - Event, that was displayed
*/
var EventSection = React.createClass({
    propTypes: {
        /** Expect, that given only 2 childrens: header and content for
         * dropdown. */
        children: function(props, propName, componentName){
            if (React.Children.count(props[propName]) < 2) {
                return new Error("EventSection takes 2 childrens: "
                                 +"header, and dropdown content");
            }
        },
    },
    getInitialState: function(){
        return {
            open: false,
            class: "section",
        }
    },
	render: function() {
        var content;
        if (this.state.open) {
            content = this.props.children[1]
        }
        return (
			<div className={this.state.class}>
				<div className="sectionhead" onClick={this.handleClick}>
                    {this.props.children[0]}
				</div>
				<div className="articlewrap">
					<div className="article">
                        {content}
					</div>
				</div>
			</div>
		);
	},
	handleClick: function(){
        if(this.state.open) {
            this.setState({ open: false, class: "section" });
        }
        else{
            this.setState({ open: true,  class: "section open" });
        }
	},
});

/** Show elements with it's hiden dropdown content. On click expand or collapse
 * dropdown content.
 * Work together with Section.
 * @param {String} title - title of accordion
 */
var EventAccordion = React.createClass({
    // <EventRow data={item}/>
    // <EditableParticipantsList url={'/api/events/'+item.id+'/participants'}/>
	render: function() {
        var sections = this.props.items.map(function(item) {
            return (
                <EventSection key={item.id} >
                    item
                </EventSection>
            );
        });
        return (
            <div className="main">
                {sections}
            </div>
        );
    }
});
