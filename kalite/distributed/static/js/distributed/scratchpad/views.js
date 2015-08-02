var _ = require("underscore");
var Handlebars = require("base/handlebars");
var $ = require("base/jQuery");
var Backbone = require("base/backbone");
require("bootstrap");

// require("live-editor/build/js/live-editor.editor_ace_deps.js");

require("soundmanager2");
require("live-editor/external/multirecorderjs/multirecorder.js");
require("live-editor/external/transloaditxhr/transloadit_xhr.js");
Handlesbars["dev-record"] = require("live-editor/tmpl/dev-record.handlebars");
require("live-editor/js/ui/jquery.button.js");

require("live-editor/js/shared/images.js");
require("live-editor/js/shared/sounds.js");
require("live-editor/js/shared/record.js");
require("live-editor/js/shared/config.js");
require("live-editor/external/visibly/visibly.js");

require("live-editor/external/colorpicker/colorpicker.js");
require("live-editor/js/ui/autosuggest.js");
require("live-editor/js/ui/autosuggest-data.js");
require("live-editor/js/ui/tooltip-engine.js");
require("live-editor/js/ui/tooltips/auto-suggest.js");
require("live-editor/js/ui/tooltips/color-picker.js");
require("live-editor/js/ui/tooltips/image-modal.js");
require("live-editor/js/ui/tooltips/image-picker.js");
require("live-editor/js/ui/tooltips/number-scrubber-click.js");
require("live-editor/js/ui/tooltips/number-scrubber.js");
require("live-editor/js/ui/tooltips/tooltip-utils.js");

Handlebars["image-picker"] = require("live-editor/tmpl/image-picker.handlebars");
Handlebars["mediapicker-preview"] = require("live-editor/tmpl/mediapicker-preview.handlebars");
Handlebars["mediapicker-modal"] = require("live-editor/tmpl/mediapicker-modal.handlebars");
require("live-editor/js/ui/structured-blocks-tooltips.js");

Handlebars["tipbar"] = require("live-editor/tmpl/tipbar.handlebars");
require("live-editor/js/ui/tipbar.js");
Handlebars["live-editor"] = require("live-editor/tmpl/live-editor.handlebars");
require("live-editor/js/ui/canvas.js");
require("live-editor/js/ui/record.js");
require("live-editor/js/live-editor.js");
require("live-editor/js/editors/ace/editor-ace.js");

var ContentBaseView = require("content/baseview");

var ScratchpadView = ContentBaseView.extend({

    template: require("./hbtemplates/scratchpad.handlebars"),

    render: function() {
        this.$el.html(this.template(this.data_model.attributes));
        var outputUrl = "output.html";
        var useDebugger = false;
        var self = this;

        var options = {
            el: $("#sample-live-editor"),
            code: window.localStorage["test-code"] || "rect(10, 10, 100, 100);",
            width: 400,
            height: 400,
            editorHeight: "80%",
            autoFocus: true,
            workersDir: "../../build/workers/",
            externalsDir: "../../build/external/",
            imagesDir: "../../build/images/",
            soundsDir: "../../sounds/",
            execFile: outputUrl,
            jshintFile: "../../build/external/jshint/jshint.js",
            useDebugger: useDebugger
        };

        options = _.extend(options, this.data_model.attributes);

        this.liveEditor = new LiveEditor(options);
        this.liveEditor.editor.on("change", function() {
            window.localStorage["test-code"] = self.liveEditor.editor.text();
        });
        ScratchpadAutosuggest.init(this.liveEditor.editor.editor);
    }

});

module.exports = {
    ScratchpadView: ScratchpadView
};