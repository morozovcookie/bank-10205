import React from 'react'

export default class Button extends React.Component{
   render(){
       return (
           <a href={this.props.Link} className={this.props.Class} id={this.props.Id} onClick={this.props.Click}>
                <span className={this.props.Icon}></span> {this.props.Caption}
            </a>
       );
   }
}

