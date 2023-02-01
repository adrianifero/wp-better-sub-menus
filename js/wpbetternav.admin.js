(function( $ ) {
    "use strict";
	$(function() {
		
		if ( $('.item-edit').length > 0 ) {
			
			// Hide all submenues on load:
			//$('.menu-item:not(.menu-item-depth-0)').addClass('hide');
			
			// For each menu, add the expand bar:
			add_expand_bar();
			
			// Monitor changes on menu items:
			setInterval(function(){
				
					add_expand_bar();
				
			},1000);
			
			
			// When clicking on a expand bar, expand the menu or if the menu was already expanded, then hide the submenus.
			$(document).on('click', '.menu-item-handle', function(){
				
				
				var menuitem = $(this).parents('.menu-item');
				
				var depth = parseInt( menuitem.attr('class').split("menu-item-depth-")[1].substr(0, 1) );
				var childrenDepth = depth + 1;
				
				//console.log( 'This element depth: ' + depth );
				//console.log( 'Children elements depth: ' + childrenDepth );
				
				var notClasses = '';
				for (var i = 0; i < depth; i++) {
					if (i !== depth - 1) {
						notClasses += `.menu-item-depth-${i}, `;
					} else {
						notClasses += `.menu-item-depth-${i}`;
					}
				}
				

				if ( $(this).hasClass('expanded')  ){
					menuitem
						.nextUntil('.menu-item-depth-'+depth, '.menu-item-depth-'+childrenDepth )
						.not('.menu-item-depth-' + depth)
						.not(notClasses)
						.removeClass('hide')
						.find('.item-expand')
					$(this).removeClass('expanded');
				}else{
					menuitem
						.nextUntil('.menu-item-depth-' + depth, '.menu-item')
						.not('.menu-item-depth-' + depth)
						.not(notClasses)
						.addClass('hide');
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
				
				if ( $(this).next('.menu-item-depth-'+childrenDepth ).length ){
					
					if ( $(this).find('.item-expand').length == 0 ){
						$(this).find('.item-title').before('<a class="item-expand"></a>');
					}
					
				}else{
						$(this).find('.item-expand').remove();
				}
					
			});
			
		}
	
	});
}(jQuery));