var _ = require("underscore");
var Handlebars = require("base/handlebars");
var $ = require("base/jQuery");
var Backbone = require("base/backbone");
require("bootstrap");
var $script = require("scriptjs");
var soundManager = require("soundmanager2").soundManager;

window.Backbone = Backbone;
// window.Handlebars = Handlebars;
window._ = _;
window.$ = $;
window.soundManager = soundManager;

Handlebars.templates = {};
Handlebars.templates["image-picker"] = require("live-editor/tmpl/image-picker.handlebars");
Handlebars.templates["mediapicker-preview"] = require("live-editor/tmpl/mediapicker-preview.handlebars");
Handlebars.templates["mediapicker-modal"] = require("live-editor/tmpl/mediapicker-modal.handlebars");
Handlebars.templates["tipbar"] = require("live-editor/tmpl/tipbar.handlebars");
Handlebars.templates["live-editor"] = require("live-editor/tmpl/live-editor.handlebars");

window.Jed = require("jed");
require("live-editor/js/shared/i18n.js");

require("live-editor/build/css/live-editor.core_deps.css");
require("live-editor/build/css/live-editor.tooltips.css");
require("live-editor/build/css/live-editor.ui.css");

var ContentBaseView = require("content/baseview");

var ScratchpadView = ContentBaseView.extend({

    template: require("./hbtemplates/scratchpad.handlebars"),

    initialize: function(options) {
        
        ContentBaseView.prototype.initialize.call(this, options);

        _.bindAll(this, "deferred_render", "add_audio_view");

        $script.path(window.sessionModel.get("STATIC_URL") + "external/live-editor/js/");

        var self = this;

        var external = require;

        $script([
            "live-editor.core_deps",
            "live-editor.shared",
            "live-editor.editor_ace_deps"
        ], function() {
            $script("live-editor.ui", function() {
                $script("live-editor.tooltips", function() {
                    $script("live-editor.editor_ace", self.deferred_render);
                });
            });
        });

        // $script(window.sessionModel.get("STATIC_URL") + "js/distributed/bundles/bundle_audio.js", function(){
        //     self.add_audio_view(external("audio").AudioPlayerView);
        // });

    },

    render: function() {
        return this;
    },

    deferred_render: function() {
        this.$el.html(this.template(this.data_model.attributes));

        console.log(this.data_model);

        var outputUrl = window.Urls.code_output();
        var useDebugger = false;
        var self = this;

        var commands = JSON.parse(this.data_model.get("revision").playback);

        var options = {
            el: $("#live-editor"),
            code: window.localStorage["test-code"] || "rect(10, 10, 100, 100);",
            width: 400,
            height: 400,
            editorHeight: "80%",
            autoFocus: true,
            recordingMP3: "http://127.0.0.1:8000/content/" + this.data_model.get("id") + ".mp3",
            recordingCommands: commands.commands,
            recordingInit: commands.init,
            workersDir: window.sessionModel.get("STATIC_URL") + "external/live-editor/workers/",
            externalsDir: window.sessionModel.get("STATIC_URL") + "external/live-editor/external/",
            imagesDir: window.sessionModel.get("STATIC_URL") + "external/live-editor/images",
            execFile: outputUrl,
            jshintFile: window.sessionModel.get("STATIC_URL") + "external/live-editor/external/jshint/jshint.js",
            useDebugger: useDebugger
        };

        options = _.extend(options, this.data_model.attributes.revision);

        this.liveEditor = new window.LiveEditor(options);

        setTimeout(5000, function() {
            $(".scratchpad-editor iframe").css("position", "relative");
        });

        // window.ScratchpadAutosuggest.init(this.liveEditor.editor.editor);
    },

    add_audio_view: function(AudioPlayerView) {
        this.audio_view = new AudioPlayerView({
            data_model: new Backbone.Model({
                content_urls: {stream: this.data_model.get("revision").mp3Url}
            }),
            log_model: this.log_model
        });

        this.$el.append(this.audio_view.el);

        this.audio_view.render();
    }

});

module.exports = {
    ScratchpadView: ScratchpadView
};