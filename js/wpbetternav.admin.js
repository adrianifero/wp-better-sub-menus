( function ( $ ) {
	'use strict';

	var MENU_LIST_ID = 'menu-to-edit';
	var ANIMATION_MS  = window.matchMedia &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
		? 0
		: 220;

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

	function getDescendants( $item ) {
		var depth = menuItemDepth( $item );
		return $item.nextUntil( '.menu-item-depth-' + depth, descendantSelector( depth ) );
	}

	function getDirectChildren( $item ) {
		var depth = menuItemDepth( $item );
		return $item.nextUntil( '.menu-item-depth-' + depth, directChildSelector( depth ) );
	}

	function hideDescendants( $item, callback ) {
		var $all     = getDescendants( $item );
		var $visible = $all.filter( ':visible' );

		if ( ! $visible.length || ! ANIMATION_MS ) {
			$all.addClass( 'hide' ).css( 'display', '' );
			if ( callback ) {
				callback();
			}
			return;
		}

		var remaining = $visible.length;
		$visible.stop( true, true ).slideUp( ANIMATION_MS, function () {
			$( this ).addClass( 'hide' ).css( 'display', '' );
			remaining -= 1;
			if ( remaining === 0 ) {
				$all.addClass( 'hide' );
				if ( callback ) {
					callback();
				}
			}
		} );
	}

	function showDirectChildren( $item, callback ) {
		var $children = getDirectChildren( $item );

		if ( ! $children.length ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		if ( ! ANIMATION_MS ) {
			$children.removeClass( 'hide' ).css( 'display', '' );
			if ( callback ) {
				callback();
			}
			return;
		}

		$children.removeClass( 'hide' ).css( 'display', 'none' );

		var remaining = $children.length;
		$children.stop( true, true ).slideDown( ANIMATION_MS, function () {
			remaining -= 1;
			if ( remaining === 0 && callback ) {
				callback();
			}
		} );
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
			var $item   = $( this );
			var depth   = menuItemDepth( $item );
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
			if ( $toggle.prop( 'disabled' ) ) {
				return;
			}

			var $item = $toggle.closest( '.menu-item' );
			var collapseLabel =
				window.wpBetterSubMenus && window.wpBetterSubMenus.collapseLabel
					? window.wpBetterSubMenus.collapseLabel
					: 'Collapse submenu';
			var expandLabel =
				window.wpBetterSubMenus && window.wpBetterSubMenus.expandLabel
					? window.wpBetterSubMenus.expandLabel
					: 'Expand submenu';

			$toggle.prop( 'disabled', true );

			function finishToggle( collapsed ) {
				$toggle
					.toggleClass( 'is-collapsed', collapsed )
					.attr( 'aria-expanded', collapsed ? 'false' : 'true' )
					.attr( 'aria-label', collapsed ? expandLabel : collapseLabel )
					.prop( 'disabled', false );
			}

			if ( $toggle.hasClass( 'is-collapsed' ) ) {
				showDirectChildren( $item, function () {
					finishToggle( false );
				} );
			} else {
				hideDescendants( $item, function () {
					finishToggle( true );
				} );
			}
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
