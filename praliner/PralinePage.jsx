import React from 'react';
import {render} from 'react-dom';
import Praline from './Praline.jsx'
import PralineSquare from './PralineSquare.jsx'

class PralinePage extends React.Component {
	
	  constructor(props) {
	    super(props);
	    let gridbox8imgsrc = "/themes/chokladkompaniet/images/ajax-loader.gif";  // 6-gridboxx
		this.source = "/react/get_pralinepage_init_det";   
		this.currLocale = $("html").attr('lang');
		this.sortablecache="";
	    this.state = {
	    		current_gridbox_id: 0,
	    		current_gridbox_img_src:"",
	    		current_gridbox_count: 6,
	    		pralines:[],
	    		selectedpralines:[],
	    		squares:[],
	    		pralineboxes:[],
	    		praline_col_md: 8,
	    		praline_box_col_md: 4,
	    		praline_selection_for_edit:[],
	    		praline_image_in_modal_id:"",
	    		praline_image_in_modal_src:"",
	    		praline_image_in_modal_name:"",
	    		praline_image_in_modal_desc:"",
	    		is_praline_added: "hidden",
	    		added_praline_id_for_status:0,
	    		checkout_btn_disabled_class:"disabled"
	    }
	    this.clearPralineSelection = this.clearPralineSelection.bind(this);
	    this.submitPralineSelection = this.submitPralineSelection.bind(this);
	    this.handleRemovePraline = this.handleRemovePraline.bind(this);
	    this.handleRemovePralineX = this.handleRemovePralineX.bind(this);
	  }
	  
	  onQuickViewPraline(id) {
		  $('.praline-quick-view-modal').modal('show');
		  let  item = this.findPraline(id);
		  
  			this.setState({
  				praline_image_in_modal_id:item.id,
  				praline_image_in_modal_src:item.img,
  		  		praline_image_in_modal_name:item.name,
  		  		praline_image_in_modal_desc:item.shortdesc
  			});
	  }
	  
	  showPralineNameOverlay() {
		  $('.praline-wrapper').mouseover(function(){
			  		var overlay_height = $(this).find('.praline-name-overlay').height();
			  		$(this).find('.praline-name-overlay').css('top',((parseInt(overlay_height)*-1)-15) + 'px' );
			  		$(this).find('.praline-name-overlay').show();
			  }).mouseout(function() {
				  $(this).find('.praline-name-overlay').hide();
			  });
		  $('.dropbox').mouseover(function(){
		  		$(this).find('.praline-name-overlay').show();
		  }).mouseout(function() {
			  $(this).find('.praline-name-overlay').hide();
		  });
	  }
	  
	  closePralineModal() {
		  $('.praline-quick-view-modal').modal('hide'); 
		  $('.praline-box-filled-modal').modal('hide');
		  $('.get-started-praline-box-modal').modal('hide');
	  }
	  
	  removePralineAddedByDrag() {
		  $(document).on('click','.rm-added-by-drag',function(){ 
			  $(this).closest('.dropbox').html('');
		  });
	  }
	  handleRemovePralineX(event) {
		  
		  let squares_tmp = this.state.praline_selection_for_edit_selection;
		  var BreakException = {};
		  let classNameToCheck = event.currentTarget.className,
		  	  classNameToCheck2=classNameToCheck.replace('remove-this-praline rm-','');
		  
		  try {
			  squares_tmp.forEach(function(itemid,index) {
					 
						  if(itemid+'-'+index==classNameToCheck2){	
						  	  squares_tmp[index] = 0;
						  	 throw BreakException;
						  }
						  
					  
			  }.bind(this));
		  } catch (e) {
			  if (e !== BreakException) throw e;
			}
		  
		  this.setState({
			  praline_selection_for_edit_selection : squares_tmp
		  });
		  
	  }
	  handleRemovePraline(event) {
		  let squares_tmp = this.state.squares;
		  var BreakException = {};
		  let classNameToCheck = event.currentTarget.className,
		  	  classNameToCheck2=classNameToCheck.replace('remove-this-praline rm-','');
		  
		  try {
			  squares_tmp.forEach(function(itemid,index) {
					 
						  if(itemid+'-'+index==classNameToCheck2){	
						  	  squares_tmp[index] = 0;
						  	
						  	 throw BreakException;
						  }
						  
					  
			  }.bind(this));
		  } catch (e) {
			  if (e !== BreakException) throw e;
			}
		  
		  this.setState({
			  squares : squares_tmp
		  },()=>{ $('.checkout.btn').addClass('disabled'); });
      }
	  
	  handleRemovePralineOnDrag(pralinesquareobj) {
		  let squares_tmp = this.state.squares;
		  var BreakException = {};
		  try {
			  squares_tmp.forEach(function(itemid,index) {
					  if(pralinesquareobj.hasClass( 'squareid-'+index ) ){
						  squares_tmp[index] = 0;
						  throw BreakException;
					  }
					  
			  }.bind(this));
		  } catch (e) {
			  if (e !== BreakException) throw e;
			}
		  
		  this.setState({
			  squares : squares_tmp
		  });		  
		  
	  }
		
	  componentDidMount() {
		  this.serverRequest = $.getJSON(
		    	this.source,
		    	{ 
		    		locale:this.currlocale,
		    		t:Date.now()
				}, function (json_data) {  
					var thisobj = this;
					if(json_data.hasvisited=='no') {
						 $('.get-started-praline-box-modal').modal('show');
					}
					if(json_data.pralineselectionforedit.grid_id) {
				    	  thisobj.setState({
								current_gridbox_count:json_data.pralineselectionforedit.gridcount
						});
				    	  $('.checkout.btn').removeClass('disabled');
				      }
				  let squares = [], thisreact = this,
				  praline_selection_for_edit_selection = [];
			      for (let i = 0; i < this.state.current_gridbox_count; i++) {
			    	  squares.push(0);
				    }
			      
			      
			      this.setState({
				        pralines : json_data.pralines,
				        selectedpralines:json_data.selectedpralines,
				        squares: squares,
				        pralineboxes: json_data.boxes,
				        praline_selection_for_edit: json_data.pralineselectionforedit
				      },() =>{
				    	  this.bindDraggable();
				      }); 
			      if(json_data.pralineselectionforedit.grid_id) {
			    	  var edit_selection_len = json_data.pralineselectionforedit.selection.length;
			    	  json_data.pralineselectionforedit.selection.forEach(function(itemid,index){
			    		 
			    		  praline_selection_for_edit_selection.push(parseInt(itemid));
			    		  if(!--edit_selection_len) {
			    			  thisreact.setState({squares:praline_selection_for_edit_selection});
			    			  
			    		  }
			    	  });
			    	  praline_selection_for_edit_selection = json_data.pralineselectionforedit.selection;
			      }
			      json_data.boxes.forEach(function(praline_box){
				      if(parseInt(praline_box.isdefault)==1) {
				    	  thisobj.setState({
							  current_gridbox_img_src: praline_box.img,
							  current_gridbox_id : praline_box.id
						  });
					  }
			      });
			      if(json_data.pralineselectionforedit.grid_id &&
			    		  json_data.pralineselectionforedit.gridcount>10) {
						let praline_col_md=7,
						praline_box_col_md=5;
						thisobj.setState({
								praline_col_md:praline_col_md,
								praline_box_col_md:praline_box_col_md
						});
				  }
			      
			      this.showPralineNameOverlay();
			      this.removePralineAddedByDrag();
			      
			      var impressions = [],
					shop_items = json_data.pralines;
					var arrayLength = shop_items.length,
						arrayLengthTrig = arrayLength;
					for (var i = 0; i < arrayLength; i++) {
					    
					    var item = shop_items[i];
					    impressions.push({
					    	'name': item.name,       // Name or ID is required.
						    'id': item.id,
						    'brand': 'Chokladkompaniet',
						    'category': 'Praline',
						    'variant': item.shortdesc,
						    'list':  'praliner',
						    'position': (i+1)
					    });
					    if(!--arrayLengthTrig) {
					    	dataLayer.push({
								  'ecommerce': {
								    'currencyCode': 'SEK',                       // Local currency is optional.
								    'impressions': impressions } 
					    	});
					    }
					}
			      
		    }.bind(this) );
		    
		    
		  } 
	  
	  
	  onAddPraline(id) {
		  
		  this.onSelectPraline(id);
	  }
	  
	  onSelectPraline(id) {
		  let gridbox = this.state.gridbox,
		  	  pralines= this.state.pralines,
		  	  item = this.findPraline(id),
		  	  squares_tmp = this.state.squares,
		  	  thisreactobj = this,
		  	  squares_tmp_len = squares_tmp.length;
			  var BreakException = {};
			  try {
				  squares_tmp.forEach(function(pralinesquare,index) {
					
						  if( !($('.dropbox-wrap').find( '.squareid-'+index ).find('img').length)){
							  squares_tmp[index] = id;
							  
							  if((parseInt($('.dropbox-wrap').find('.draggable-praline-item').length)+1)==parseInt(thisreactobj.state.current_gridbox_count)){
				        			$('.checkout.btn').removeClass('disabled');
				        			if($('.over-pralines-text .visible-xs').is(':visible')) {
				        				$('.praline-box-filled-modal').modal('show');
									}
							  } else {
				        		  $('.praline-quick-view-modal').find('.praline-modal-status').show();
				        		  thisreactobj.setState({
				      				  added_praline_id_for_status: id
				      			  	});
				        	  }
							  
							  $('.draggable-praline.praline-'+id).closest('.praline-wrapper').find('.praline-name-overlay').hide();
							  throw BreakException;
						  }
						  
				  }.bind(this));
			  } catch (e) {
				  if (e !== BreakException) throw e;
			  }
			  

				  thisreactobj.setState({
					  squares : squares_tmp,
					  is_praline_added:""
				  });
				  setTimeout(function(){
					  thisreactobj.setState({
						  is_praline_added:"hidden",
						  added_praline_id_for_status: 0
					  });
					  $('.praline-quick-view-modal').find('.praline-modal-status').hide();
				  },2000);

	}	
	  
   findPraline(id) {
	   
	   function findItem(praline) { 
		    return praline.id === id;
		}
	   
	    return this.state.pralines.find(findItem);
	   
   }
   
	findPralineIndex(id) {
		   
	   function findItem(praline) { 
		    return praline.id === id;
		}
	   
	    return this.state.gridbox.findIndex(findItem);
   }
	
	findPralineBox(id) {
		   
		   function findItem(pralinebox) { 
			    return pralinebox.id === id;
			}
		   
		    return this.state.pralineboxes.find(findItem);
   }
	
	clearPralineSelection() {
		let squares = [];
		
	      for (let i = 0; i < this.state.current_gridbox_count; i++) {
	    	  squares.push(0);
		    }
	    squares.sort();
	    this.setState({
			  squares : squares,
			  praline_selection_for_edit:[]
		  },()=>{
			$('.dropbox .praline-name-overlay').remove();
			$('.remove-this-praline').remove();
			$('.draggable-praline-item.dropped').remove();
			$('.checkout.btn').addClass('disabled'); });
		  
		//
		
		
		
	}
	
	bindDraggable(){
		let thisreactobj = this;
		$(".dropbox").droppable({
	    	  accept: ".draggable-praline",
	          drop: function(event, ui) {
      		  if( $(this).find('img').length == 0 ){
      			  	var img_el=ui.helper.clone();
      			  	$(this).append(img_el);
      			  	$(img_el).addClass('dropped draggable-praline-item center-block');
	        		$('.draggable-praline-item').removeClass('draggable-praline ui-draggable ui-draggable-handle');
	        		$(this).append($('<div class="praline-name-overlay">'+img_el.attr('alt')+'</div>'));
	        		$(this).append($('<a href="javascript:void();" class="remove-this-praline rm-added-by-drag"><i class="fa fa-remove fa-lg"></i></a>'));
	        		$('.praline-wrapper').find('.praline-name-overlay').hide();
	        		
	        		if(parseInt($('.dropbox-wrap').find('.draggable-praline-item').length)==parseInt(thisreactobj.state.current_gridbox_count)){
	        			$('.checkout.btn').removeClass('disabled');
	        			if($('.over-pralines-text .visible-xs').is(':visible')) {
	        				$('.praline-box-filled-modal').modal('show');
						}
	        		}
	        	  }	
	          }
	      });
	      
	      $( ".draggable-praline" ).draggable({
	            connectToSortable: ".dropbox",
	            helper: "clone",
	            revert: "invalid",
	            scroll: false,
	            containment:$("#praline-page-canvass"),
	            appendTo: 'body'
	            
	        });
	      
	      var thisobj = this;
	      var outside = false;
	      $( ".dropbox-wrap" ).sortable({
	    	  revert: false,
	    	  appendTo: 'body',
	    	  over: function (event, ui) {
	    	        outside = false;
	    	    },
	    	  out: function (event, ui) {
	    	        outside = true;
	    	    }
	        });
	      $( ".dropbox-wrap, .draggable-praline, .draggable-praline-item" ).disableSelection();
	     
	      
	}
	
	submitPralineSelection() {
		var dropbox_len = $(".dropbox-wrap").find('.dropbox').length,
			praline_classes=[];
		var currlocale = this.currLocale; 
		$(".dropbox-wrap").find('.dropbox').each(function(){
			var thisobj = $(this);
			
			if( thisobj.find('img').length != 0 ) {
				praline_classes.push( thisobj.find('img').attr("class") );
								
				if(!--dropbox_len) {
					
					$.post('/react/post_praline_selection?locale='+currlocale,{
						pralineboxclass:$('.box-wrapper .praline-box').attr('class'),
						pralineclasses: praline_classes,
						},function(response){
							var json_data = $.parseJSON(response);
							if(json_data.status=="success") {
								
								dataLayer.push({
									  'event': 'addToCart',
									  'ecommerce': {
									    'currencyCode': 'SEK',
									    'add': {                                
									      'products': json_data.praliner_and_box
									    }
									  },
									  'eventCallback' : function() {
										  window.location.href=json_data.url_to_redirect
									    }
									});
								
								
							}
					});
				}
			}
			
		});
	}
	
	changePralineBox(id) {
		
		let praline_box = this.findPralineBox(id),
			praline_col_md=8,
			praline_box_col_md=4,
			squares = [],
			gridcount_init = parseInt(praline_box.gridcount),
			gridcount = parseInt(praline_box.gridcount),
			thisobj = this;
	      for (let i = 0; i < gridcount; i++) {
	    	  squares.push(0);
	    	 if( !--gridcount_init ) {
	    		  $(".dropbox").droppable('destroy');
	    		  $(".dropbox").unbind();
	    		  $( ".dropbox-wrap" ).sortable('destroy');
	    		  $( ".dropbox-wrap" ).unbind();
	    		  thisobj.clearPralineSelection();
	    		  thisobj.showPralineNameOverlay();
	    	  }
		  }
	      
		if(praline_box.gridcount>10) {
			praline_col_md=7,
			praline_box_col_md=5;
		}
		this.setState({
			current_gridbox_img_src: praline_box.img,
			current_gridbox_id: praline_box.id,
			praline_col_md:praline_col_md,
			praline_box_col_md:praline_box_col_md,
			current_gridbox_count:praline_box.gridcount,
			squares: squares,
			praline_selection_for_edit:[]
		},() => {
			thisobj.bindDraggable();
		});
		
		
	}
	  
	  render() {
		  let selectedpralinesrows = [], pralinerows=[], i=1,
		  	  init_square_count = 6, praline_squares = [],
		  	  praline_boxes = [], praline_image_in_modal_id = this.state.praline_image_in_modal_id,
		  	  added_praline_id_for_status = this.state.added_praline_id_for_status,
		  	  thisreactobj = this;
		  	
		  
		  
		  this.state.pralines.forEach(function(praline,index) {
			  pralinerows.push(
					  <Praline item={praline} key={index} addedPralineIdForStatus={added_praline_id_for_status} onSelectPraline={this.onSelectPraline.bind(this)} onQuickViewPraline={this.onQuickViewPraline.bind(this)} />
			  );
			  // for 6 grid box
			  if (i % 6 === 0){
				  pralinerows.push( 
	      					React.createElement("span", {className: "break-float visible-md visible-lg hidden-xs" })
	      			);
    		  }
			  if (i % 3 === 0){
				  pralinerows.push( 
	      					React.createElement("span", {className: "break-float visible-xs" })
	      			);
    		  }
			  
    		  i++;
		  }.bind(this));
		  
		  		this.state.squares.forEach(function(itemid,index){
				  
				  let PralineSquareChildImg = null,
				  item = this.findPraline(parseInt(itemid)),
				  PralineNameOverlay = null,
				  PralineRemoveButton = null;
				  if(item && itemid!==0) {
					  
					  PralineSquareChildImg = ( React.createElement('img',{
							src:item.img,
							className:"img-responsive draggable-praline-item center-block praline-"+itemid
						}));
					  PralineNameOverlay =  ( React.createElement('div',{
							className:"praline-name-overlay hidden-xs"
						}, item.name ) );
					  
					  PralineRemoveButton = (React.createElement('a',{
						  	href:'javascript:void();',
						  	className:'remove-this-praline rm-'+itemid+'-'+index,
						  	onClick:this.handleRemovePraline
					  	},
					  	React.createElement('i',{
					  		className:'fa fa-remove fa-lg'
					  	} ) )  );
				  }
				  praline_squares.push(
						  <PralineSquare squareID={index} key={index} >
						  	{PralineSquareChildImg}
						  	{PralineNameOverlay}
						  	{PralineRemoveButton}
						  </PralineSquare>
				  )
				  
			  }.bind(this));
		  
		  var thisreact = this;
		  this.state.pralineboxes.forEach(function(praline_box,index) {
			  //current_gridbox_id
			  let btn_class = "btn-default",
			  	  hidden_class = "hidden";
			  if( this.state.current_gridbox_id==praline_box.id) {
				  btn_class = "btn-primary";
				  hidden_class = "";
			  }
			  praline_boxes.push(
					  ( React.createElement('div',{
							className:"btn-group grid-box-option",
							key:index
						}, React.createElement('button',{
							type:"button",
							className:"btn btn-sm " + btn_class,
							onClick: this.changePralineBox.bind(this,praline_box.id)
						}, 
						React.createElement('span',
								{ className:"" },
									praline_box.name, React.createElement('span',
											{ className: hidden_class + " box-price-wrapper" },
											" (" +praline_box.price+ " SEK)" ) ) ) ) )	  
			  );
			 
			  
		  }.bind(this));
		  
		    return (
		    		<div>
		    			<div className="row">
		    				<div className="col-md-6">
		    				<p>Välj storlek på din chokladbox </p>
		    				</div>
		    			</div>
			    		<div className="row">
			    			<div className="col-md-6">
				    			<div className="btn-group btn-group-justified praline-boxes-wrapper">
				    				{praline_boxes}
				    			</div>
			    			</div>
			    			<div className="col-md-6 text-right">
		            			<br className="visible-xs"/>
		            			<a className={`clearfix checkout btn btn-primary disabled`} href="javascript:void(0);" onClick={this.submitPralineSelection.bind(null)}>
		            				Gå till betalning &nbsp;<i className="fa fa-arrow-circle-right fa-lg"></i>
		            			</a>
	            			</div>
	        			</div>
	        			
	        			<br/>
		    			<div className="row">
				    		<div className={`col-md-${ this.state.praline_box_col_md } box-wrapper grid-${ this.state.current_gridbox_count }`} id="box-wrapper">
						    	<img src={this.state.current_gridbox_img_src} className={`img-responsive praline-box praline-box-${this.state.current_gridbox_id}`} />
						    	
						    	<div className="dropbox-wrap">
						    			{praline_squares}
						          </div>
						          
					    	</div>
					    	<div className={`col-md-${ this.state.praline_col_md } praline-list`}>
					    		<p className="over-pralines-text">
					    			<span className="hidden-xs">Klicka på eller dra pralinen till chokladboxen för att lägga till den</span>
					    			<span className="visible-xs">Klicka på pralinen för att lägga till den</span>
					    		</p>
			            		<div className="row">
			            			{pralinerows}
			            		</div>
		            		</div>
	            		</div>
	            		<div className="row">
	            			<div className="col-md-6 col-md-offset-6">
	            				<div className="row">
				            		<div className="col-md-12 text-right">
				            			<br className="visible-xs"/>
				            			<a className={`clearfix checkout btn btn-primary disabled`} href="javascript:void(0);" onClick={this.submitPralineSelection.bind(null)}>
				            				Gå till betalning &nbsp;<i className="fa fa-arrow-circle-right fa-lg"></i>
				            			</a>
				            			<br className="visible-xs"/>
				            			<br className="visible-xs"/>
			            			</div>
		            			</div>
	            			</div>
	            		</div>
	            		
	            		<div className="modal fade bs-example-modal-sm praline-quick-view-modal">
	            		  <div className="modal-dialog modal-sm">
	            		    <div className="modal-content">
	            		    	<div className="modal-header">
	            	        	<button type="button" className="close" onClick={() => this.closePralineModal()}><span>&times;</span></button>
	            	        		<h4 className="modal-title">{this.state.praline_image_in_modal_name}</h4>
	            	        	</div>
	            	        	<div className="modal-body">
		            		      	<img src={this.state.praline_image_in_modal_src} className="img-responsive center-block"/>
		            		      	<p className="text-center">{this.state.praline_image_in_modal_desc}</p>
	            		      	</div>
	            		      	<div className="modal-footer">
	            		      		<span className={`praline-modal-status `}>LAGT TILL</span> <button type="button" className="btn btn-primary btn-sm" onClick={() => this.onSelectPraline(praline_image_in_modal_id)}>Lägg till</button>
	            		      </div>
	            		    </div>
	            		  </div>
	            		</div>
	            		
	            		<div className="modal fade bs-example-modal-sm praline-box-filled-modal">
	            		  <div className="modal-dialog modal-sm">
	            		    <div className="modal-content">
	            		    	<div className="modal-header">
	            	        		<button type="button" className="close" onClick={() => this.closePralineModal()}><span>&times;</span></button>
	            	        	</div>
	            	        	<div className="modal-body">
		            		      	<h2 className="text-center">Din chokladbox är nu fylld</h2>
	            		      	</div>
	            		      	<div className="modal-footer">
		            		      	<a className={`clearfix checkout btn btn-primary disabled`} href="javascript:void(0);" onClick={this.submitPralineSelection.bind(null)}>
		            		      		Gå till betalning &nbsp;<i className="fa fa-arrow-circle-right fa-lg"></i>
		            				</a>
	            		      </div>
	            		    </div>
	            		  </div>
	            		</div>
	            		
	            		<div className="modal fade bs-example-modal-sm get-started-praline-box-modal">
	            		  <div className="modal-dialog modal-lg">
	            		    <div className="modal-content">
	            		    	<div className="modal-header">
	            	        		<button type="button" className="close" onClick={() => this.closePralineModal()}><span>&times;</span></button>
	            	        	</div>
	            	        	<div className="modal-body">
	            	        	<h4>Skapa din personliga gåva med att komponera din egen pralinask</h4>
		            		       <img className="img-responsive center-block" src="/themes/chokladkompaniet/images/ck_praline_box.jpg"/>
		            		    	<br/>
		            		       <button type="button" className="btn btn-primary" onClick={() => this.closePralineModal()}>Låt oss börja!</button>		
	            		      	</div>
	            		    </div>
	            		  </div>
	            		</div>
	            		
	            		
            		</div>
			    );
	  }
}
render(<PralinePage/>, document.getElementById('praline-page-canvass') );