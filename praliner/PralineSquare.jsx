import React,{ Component, PropTypes } from 'react';

export default class PralineSquare extends Component{
	constructor() {
	    super();   
	  }
	 render() {
		    return (
		      <div className={`dropbox ui-state-default squareid-${ this.props.squareID }`}>
		        {this.props.children}
		      </div>
		    );
		  }
}