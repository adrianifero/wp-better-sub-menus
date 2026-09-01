( function ( $ ) {
	'use strict';

	var MENU_LIST_ID = 'menu-to-edit';

	function menuItemDepth( $item ) {
		var classes = $item.attr( 'class' ) || '';
		var match   = classes.match( /menu-item-depth-(\d+)/ );
		return match ? parseInt( match[1], 10 ) : 0;
	}

	function descendantSelector( depth ) {
		var parts = [];
		for ( var i = depth + 1; i <= 99; i++ ) {
			parts.push( '.menu-item-depth-' + i );
		}
		return parts.join( ', ' );
	}

	function directChildSelector( depth ) {
		return '.menu-item-depth-' + ( depth + 1 );
	}

	function hideDescendants( $item ) {
		var depth = menuItemDepth( $item );
		$item
			.nextUntil( '.menu-item-depth-' + depth, descendantSelector( depth ) )
			.addClass( 'hide' );
	}

	function showDirectChildren( $item ) {
		var depth = menuItemDepth( $item );
		$item
			.nextUntil( '.menu-item-depth-' + depth, directChildSelector( depth ) )
			.removeClass( 'hide' );
	}

	function syncExpandControls() {
		var collapseLabel =
			window.wpBetterSubMenus && window.wpBetterSubMenus.collapseLabel
				? window.wpBetterSubMenus.collapseLabel
				: 'Collapse submenu';
		var expandLabel =
			window.wpBetterSubMenus && window.wpBetterSubMenus.expandLabel
				? window.wpBetterSubMenus.expandLabel
				: 'Expand submenu';

		$( '#menu-to-edit .menu-item' ).each( function () {
			var $item  = $( this );
			var depth  = menuItemDepth( $item );
			var $toggle = $item.find( '.item-expand' );
			var hasChild = $item.next( directChildSelector( depth ) ).length > 0;

			if ( ! hasChild ) {
				$toggle.remove();
				return;
			}

			if ( ! $toggle.length ) {
				$item.find( '.item-title' ).before(
					'<button type="button" class="item-expand" aria-expanded="true" aria-label="' +
						collapseLabel +
						'"></button>'
				);
				return;
			}

			var collapsed = $toggle.hasClass( 'is-collapsed' );
			$toggle
				.attr( 'aria-expanded', collapsed ? 'false' : 'true' )
				.attr( 'aria-label', collapsed ? expandLabel : collapseLabel );
		} );
	}

	function bindExpandClicks() {
		$( document ).on( 'click', '.item-expand', function ( event ) {
			event.preventDefault();
			event.stopPropagation();

			var $toggle = $( this );
			var $item   = $toggle.closest( '.menu-item' );

			if ( $toggle.hasClass( 'is-collapsed' ) ) {
				showDirectChildren( $item );
				$toggle.removeClass( 'is-collapsed' ).attr( 'aria-expanded', 'true' );
			} else {
				hideDescendants( $item );
				$toggle.addClass( 'is-collapsed' ).attr( 'aria-expanded', 'false' );
			}

			var collapseLabel =
				window.wpBetterSubMenus && window.wpBetterSubMenus.collapseLabel
					? window.wpBetterSubMenus.collapseLabel
					: 'Collapse submenu';
			var expandLabel =
				window.wpBetterSubMenus && window.wpBetterSubMenus.expandLabel
					? window.wpBetterSubMenus.expandLabel
					: 'Expand submenu';
			$toggle.attr( 'aria-label', $toggle.hasClass( 'is-collapsed' ) ? expandLabel : collapseLabel );
		} );
	}

	function watchMenuList() {
		var list = document.getElementById( MENU_LIST_ID );
		if ( ! list || typeof MutationObserver === 'undefined' ) {
			return;
		}

		var pending = false;
		var observer = new MutationObserver( function () {
			if ( pending ) {
				return;
			}
			pending = true;
			window.requestAnimationFrame( function () {
				syncExpandControls();
				pending = false;
			} );
		} );

		observer.observe( list, { childList: true, subtree: true } );
	}

	$( function () {
		if ( ! $( '#menu-to-edit .menu-item' ).length ) {
			return;
		}

		syncExpandControls();
		bindExpandClicks();
		watchMenuList();
	} );
}( jQuery ) );
