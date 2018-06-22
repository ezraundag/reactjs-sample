import React, { Component, PropTypes } from 'react';
		
export default class Praline extends Component {
  constructor() {
    super();   
    this.handleClick = this.handleClick.bind(this);
    this.quickViewPraline = this.quickViewPraline.bind(this);
  }
  
  quickViewPraline(id) {
	  this.props.onQuickViewPraline(id);
  }
  
  handleClick(id) {
    this.props.onSelectPraline(id);
  }
  
  
  render() {
	  let show_text = this.props.addedPralineIdForStatus == this.props.item.id ? "show" : "hidden";
	  return (<div className="col-md-2 col-sm-4 col-xs-4"><div onClick={this.handleClick.bind(null,this.props.item.id)} style={{
				cursor: 'move'
    		}} data-itemid={this.props.item.id}  
	  				itemID={this.props.item.ids} 
	  					className="praline-wrapper">
	  			<div className={` praline-name-overlay`}>{this.props.item.shortdesc}</div>
	    		<img src={this.props.item.img} className={`img-responsive center-block draggable-praline praline-${ this.props.item.id }`} alt={this.props.item.name} />
	    		<div className={` added-status-overlay ${ show_text }`}>LAGT TILL</div>
	    		
	        </div>
	    		<a href="javascript:void(0);" onClick={this.quickViewPraline.bind(null,this.props.item.id)} className="praline-name-wrapper">{this.props.item.name}</a>
    		</div>
	  		);
  }
}

Praline.propTypes = {
	onSelectPraline: React.PropTypes.func,
	onQuickViewPraline: React.PropTypes.func
}