(function( $ ) {
    "use strict";
	$(function() {
		
		if ( $('.item-edit').length > 0 ) {
			
			// Hide all submenues on load:
			$('.menu-item:not(.menu-item-depth-0)').addClass('hide');
			
			// For each menu, add the expand bar:
			$('.menu-item').each(function(){
				
				var menuitem = $(this);
				
				var depth = parseInt( menuitem.attr('class').split("menu-item-depth-")[1].substr(0, 1) );
				var childrenDepth = depth + 1;
				
				//console.log( 'This element depth: ' + depth );
				//console.log( 'Children elements depth: ' + childrenDepth );
				
				if ( $(this).next('.menu-item-depth-'+childrenDepth ).length ){
				
					$(this).find('.item-title').before('<a class="item-expand"></a>');
			
				}
					
			});
			
			
			// When clicking on a expand bar, expand the menu or if the menu was already expanded, then hide the submenus.
			$('.item-expand').on('click', function(){
				
				// Toggle arrow icon:
				$(this).toggleClass('expanded');
				
				var menuitem = $(this).parents('.menu-item');
				
				var depth = parseInt( menuitem.attr('class').split("menu-item-depth-")[1].substr(0, 1) );
				var childrenDepth = depth + 1;
				
				//console.log( 'This element depth: ' + depth );
				//console.log( 'Children elements depth: ' + childrenDepth );

				if ( $(this).hasClass('expanded')  ){
					menuitem.nextUntil('.menu-item-depth-'+depth, '.menu-item-depth-'+childrenDepth ).removeClass('hide').find('.item-expand').removeClass('expanded');
				}else{
					menuitem.nextUntil('.menu-item-depth-'+depth, '.menu-item' ).addClass('hide');
				}
					
			});
			
		}
	
									  
	});
}(jQuery));