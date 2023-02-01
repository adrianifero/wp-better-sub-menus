(function( $ ) {
    "use strict";
	$(function() {
		
		if ( $('.item-edit').length > 0 ) {
			
			// Hide all submenues on load:
			//$('.menu-item:not(.menu-item-depth-0)').addClass('hide');
			
			// For each menu, add the expand bar:
			add_expand_bar();
			
			$('.submit-add-to-menu').on('click', function(){
				
				console.log('submit new menu item');
				add_expand_bar();
			
			});
			
			// Monitor changes on menu items:
			setInterval(function(){
				
					add_expand_bar();
				
			},2000);
			
			
			// When clicking on a expand bar, expand the menu or if the menu was already expanded, then hide the submenus.
			$(document).on('click', '.menu-item-handle', function(){
				
				
				var menuitem = $(this).parents('.menu-item');
				
				var depth = parseInt( menuitem.attr('class').split("menu-item-depth-")[1].substr(0, 1) );
				var childrenDepth = depth + 1;
				
				//console.log( 'This element depth: ' + depth );
				//console.log( 'Children elements depth: ' + childrenDepth );

				if ( $(this).hasClass('expanded')  ){
					menuitem.nextUntil('.menu-item-depth-'+depth, '.menu-item-depth-'+childrenDepth ).removeClass('hide').find('.item-expand').removeClass('expanded');
					
					// Toggle arrow icon:
					$(this).removeClass('expanded');
					
				}else{
					menuitem.nextUntil('.menu-item-depth-'+depth, '.menu-item' ).addClass('hide');
					
					// Toggle arrow icon:
					$(this).addClass('expanded');
				}
					
			});
			
		}
		
		
		function add_expand_bar(){
			
			$('.menu-item').each(function(){
				
				var menuitem = $(this);
				
				var depth = parseInt( menuitem.attr('class').split("menu-item-depth-")[1].substr(0, 1) );
				var childrenDepth = depth + 1;
				
				//console.log( 'This element depth: ' + depth );
				//console.log( 'Children elements depth: ' + childrenDepth );
				
				if ( 
					$(this).next('.menu-item-depth-'+childrenDepth ).length &&
					$(this).find('.item-expand').length == 0   
				){
				
					$(this).find('.item-title').before('<a class="item-expand"></a>');
			
				}
					
			});
			
		}
	
	});
}(jQuery));