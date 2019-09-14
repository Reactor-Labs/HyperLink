$(document).ready(() => {
  var TEMPLATE =
    "<div>\n" +
    '<nav class="hyperlink_sidebar">\n' +
    '<a class="hyperlink_toggle">\n' +
    '<div class="loader"></div>\n' +
    "<span></span>\n" +
    "\n" +
    '<div class="popup">\n' +
    '<div class="arrow">Hello</div>\n' +
    '<div class="content">\n' +
    "JQN HyperLink is enabled on this page. Click this button or press\n" +
    "<kbd>cmd shift s</kbd> (or <kbd>ctrl shift s</kbd>)\n" +
    "to show it.\n" +
    "</div>\n" +
    "</div>\n" +
    "</a>\n" +
    "\n" +
    '<a class="hyperlink_opts" href="javascript:void(0)">\n' +
    "<span></span>\n" +
    "</a>\n" +
    "\n" +
    '<div class="hyperlink_views">\n' +
    '<div class="hyperlink_view hyperlink_treeview current">\n' +
    '<div class="hyperlink_view_header"></div>\n' +
    '<div class="hyperlink_view_body"></div>\n' +
    "</div>\n" +
    "\n" +
    '<div class="hyperlink_view hyperlink_errorview">\n' +
    '<div class="hyperlink_view_header"></div>\n' +
    '<form class="hyperlink_view_body">\n' +
    '<div class="message"></div>\n' +
    "<div>\n" +
    '<input name="token" type="text" placeholder="Paste access token here" autocomplete="off">\n' +
    "</div>\n" +
    "<div>\n" +
    '<button type="submit" class="btn">Save</button>\n' +
    '<a href="https://github.com/buunguyen/hyperlink#access-token" target="_blank" tabIndex="-1">Why is this required?</a>\n' +
    "</div>\n" +
    '<div class="error"></div>\n' +
    "</form>\n" +
    "</div>\n" +
    "\n" +
    '<div class="hyperlink_view hyperlink_optsview">\n' +
    '<div class="hyperlink_view_header">Settings</div>\n' +
    '<form class="hyperlink_view_body">\n' +
    "<div>\n" +
    "<label>Site access token</label>\n" +
    '<a class="hyperlink_help" href="https://github.com/buunguyen/hyperlink#settings" target="_blank" tabIndex="-1">\n' +
    "<span></span>\n" +
    "</a>\n" +
    '<input type="text" data-store="TOKEN" data-perhost="true">\n' +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    "<div>\n" +
    "<label>Hotkeys</label>\n" +
    "</div>\n" +
    '<input type="text" data-store="HOTKEYS">\n' +
    "</div>\n" +
    "\n" +
    '<div class="hyperlink_github_only">\n' +
    "<div>\n" +
    "<label>GitHub Enterprise URLs</label>\n" +
    "</div>\n" +
    '<textarea data-store="GHEURLS" placeholder="https://github.mysite1.com https://github.mysite2.com">\n' +
    "</textarea>\n" +
    "</div>\n" +
    "<div>\n" +
    '<label><input type="checkbox" data-store="ICONS"> Show file-specific icons</label>\n' +
    "</div>\n" +
    "<div>\n" +
    '<label><input type="checkbox" data-store="REMEMBER"> Remember sidebar visibility</label>\n' +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    '<label><input type="checkbox" data-store="NONCODE"> Show in non-code pages</label>\n' +
    "</div>\n" +
    "\n" +
    '<div class="hyperlink_github_only">\n' +
    '<label><input type="checkbox" data-store="LOADALL"> Load entire tree at once</label>\n' +
    "</div>\n" +
    "\n" +
    '<div class="hyperlink_github_only">\n' +
    "<label>\n" +
    '<input type="checkbox" data-store="PR">\n' +
    "Show only pull request changes\n" +
    '<span class="hyperlink_opts_disclaimer">Note: maximum of 300 files</span>\n' +
    "</label>\n" +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    '<button type="submit" class="btn">Save</button>\n' +
    "</div>\n" +
    "\n" +
    '<div class="hyperlink_opts_backing">\n' +
    '<span>Feeling awesome? <a href="https://opencollective.com/hyperlink" target="_blank">Donate</a> to help us continue working on hyperlink.</span>\n' +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n" +
    "  </nav>\n" +
    "</div>\n";

  var NODE_PREFIX = "hyperlink";
  var ADDON_CLASS = "hyperlink";
  var SHOW_CLASS = "hyperlink-show";

  var STORE = {
    TOKEN: "octotree.access_token",
    REMEMBER: "octotree.remember",
    NONCODE: "octotree.noncode_shown",
    PR: "octotree.pr_shown",
    HOTKEYS: "octotree.hotkeys",
    ICONS: "octotree.icons",
    LOADALL: "octotree.loadall",
    POPUP: "octotree.popup_shown",
    WIDTH: "octotree.sidebar_width",
    SHOWN: "octotree.sidebar_shown",
    GHEURLS: "octotree.gheurls.shared",
    GLEURLS: "octotree.gleurls.shared",
  };

  var DEFAULTS = {
    TOKEN: "",
    REMEMBER: true,
    NONCODE: true,
    PR: true,
    LOADALL: true,
    HOTKEYS: "⌘+⇧+s, ⌃+⇧+s",
    ICONS: true,
    POPUP: false,
    WIDTH: 232,
    SHOWN: false,
    GHEURLS: "",
    GLEURLS: "",
  };

  var EVENT = {
    TOGGLE: "octotree:toggle",
    LOC_CHANGE: "octotree:location",
    LAYOUT_CHANGE: "octotree:layout",
    REQ_START: "octotree:start",
    REQ_END: "octotree:end",
    OPTS_CHANGE: "octotree:change",
    VIEW_READY: "octotree:ready",
    VIEW_CLOSE: "octotree:close",
    FETCH_ERROR: "octotree:error",
  };

  // var div = document.createElement("div");
  // div.style.position = "fixed";
  // div.style.top = 0;
  // div.style.right = 0;
  // div.textContent = "Injected!";
  // document.body.appendChild(div);

  const $html = $("html");
  const $document = $(document);
  const $dom = $(TEMPLATE);
  var $sidebar = $dom.find(".hyperlink_sidebar");
  var $toggler = $sidebar.find(".hyperlink_toggle");
  var $views = $sidebar.find(".hyperlink_view");

  $html.addClass(ADDON_CLASS);
  $sidebar.appendTo($("body"));
  $toggler.is(":visible");
  // alert("inserted self");
});
