=== WP Better Sub Menus ===
Contributors: adrianifero
Tags: nav menu, menu, admin, navigation, menus
Requires at least: 6.0
Tested up to: 7.1
Stable tag: 1.1.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Collapse and expand nested menu items on Appearance → Menus. Built for sites with long, deep menus.

== Description ==

WP Better Sub Menus improves the **Appearance → Menus** screen when you manage large nested menus.

* Click the colored bar on a parent item to collapse or expand its branch
* Sticky, scrollable left column (Pages, Posts, categories, etc.) while you edit
* Depth colors so nested levels are easier to scan
* Visual changes only — front-end navigation is unchanged

Especially useful when a menu has dozens of items and several levels deep.

== Installation ==

1. Install from Plugins → Add New (search “WP Better Sub Menus”), or upload a zip whose top-level folder is `wp-better-sub-menus`.
2. Activate the plugin.
3. Go to **Appearance → Menus**. Parent items with children show a colored expand control on the left.

If your menu has no sub-items, the screen looks the same as before.

== Frequently Asked Questions ==

= Does this change my site menu on the front end? =

No. It only improves the admin menu editor.

= Why do I not see any difference? =

The plugin adds controls when menu items have child items. Flat menus look unchanged.

= Does it work with deep menus? =

Yes. Collapse/expand supports nested depths beyond ten levels.

== Screenshots ==

1. Before: a long menu is hard to scan.
2. After: branches collapse; the left panel stays sticky and scrollable.
3. Click the colored bar to collapse or expand a branch.

== Changelog ==

= 1.1.0 =
* Verified for WordPress 6.x and 7.x; Tested up to 7.1.
* Replace polling with MutationObserver when menu items change (drag-and-drop, add, delete).
* Fix depth detection for menus deeper than nine levels.
* Expand/collapse uses the colored bar only — no longer hijacks the whole row click.
* Accessible toggle button with aria-expanded.

= 1.0.5 =
* Ten levels of menu items with gradient colors.
* All items collapsible, including items just drag-and-dropped while editing.

= 1.0.4 =
* Ten levels of menu items with gradient colors.
* All items collapsible, including items just drag-and-dropped while editing.

= 1.0.3 =
* Screenshots and description added.

= 1.0.2 =
* Color bars and sticky menu features added.

== Upgrade Notice ==

= 1.1.0 =
Reliable on current WordPress. Safer expand control and better behavior after drag-and-drop. Recommended update from 1.0.5.
