( function ( $ ) {
	'use strict';

	var MENU_LIST_ID = 'menu-to-edit';
	var BRANCH_OPEN   = 'wp-bsm-branch-open';
	var BRANCH_CLOSED = 'wp-bsm-branch-closed';
	var BRANCH_ANIM   = 'wp-bsm-branch-anim';
	var prefersReducedMotion =
		window.matchMedia &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

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

	function prepareForAnimation( $items ) {
		$items.each( function () {
			var $el = $( this );
			$el
				.removeClass( 'hide ' + BRANCH_CLOSED )
				.addClass( BRANCH_OPEN + ' ' + BRANCH_ANIM )
				.css( 'max-height', $el.outerHeight() + 'px' );
		} );
	}

	function afterTransition( $items, callback ) {
		if ( ! $items.length ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		var done    = false;
		var timeout = prefersReducedMotion ? 0 : 400;

		function finish() {
			if ( done ) {
				return;
			}
			done = true;
			if ( callback ) {
				callback();
			}
		}

		if ( prefersReducedMotion ) {
			finish();
			return;
		}

		$items.one( 'transitionend', finish );
		window.setTimeout( finish, timeout );
	}

	function hideDescendants( $item, callback ) {
		var $all = getDescendants( $item );

		if ( prefersReducedMotion ) {
			$all.addClass( 'hide' ).removeClass( BRANCH_OPEN + ' ' + BRANCH_CLOSED + ' ' + BRANCH_ANIM ).css( 'max-height', '' );
			if ( callback ) {
				callback();
			}
			return;
		}

		prepareForAnimation( $all.filter( ':visible' ) );
		$all.filter( '.hide' ).addClass( BRANCH_CLOSED );

		window.requestAnimationFrame( function () {
			$all.removeClass( BRANCH_OPEN ).addClass( BRANCH_CLOSED ).css( 'max-height', '0px' );
		} );

		afterTransition( $all, function () {
			$all
				.addClass( 'hide' )
				.removeClass( BRANCH_OPEN + ' ' + BRANCH_CLOSED + ' ' + BRANCH_ANIM )
				.css( 'max-height', '' );
			if ( callback ) {
				callback();
			}
		} );
	}

	function showDirectChildren( $item, callback ) {
		var $children = getDirectChildren( $item );

		if ( prefersReducedMotion ) {
			$children.removeClass( 'hide ' + BRANCH_OPEN + ' ' + BRANCH_CLOSED + ' ' + BRANCH_ANIM ).css( 'max-height', '' );
			if ( callback ) {
				callback();
			}
			return;
		}

		$children
			.removeClass( 'hide ' + BRANCH_OPEN + ' ' + BRANCH_CLOSED )
			.addClass( BRANCH_CLOSED + ' ' + BRANCH_ANIM )
			.css( 'max-height', '0px' );

		window.requestAnimationFrame( function () {
			$children.each( function () {
				var $el = $( this );
				$el.removeClass( BRANCH_CLOSED ).addClass( BRANCH_OPEN ).css( 'max-height', $el.get( 0 ).scrollHeight + 'px' );
			} );
		} );

		afterTransition( $children, function () {
			$children.removeClass( BRANCH_OPEN + ' ' + BRANCH_CLOSED + ' ' + BRANCH_ANIM ).css( 'max-height', '' );
			if ( callback ) {
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
			var $item    = $( this );
			var depth    = menuItemDepth( $item );
			var $toggle  = $item.find( '.item-expand' );
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
