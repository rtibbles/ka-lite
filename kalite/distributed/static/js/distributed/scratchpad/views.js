var _ = require("underscore");
var Handlebars = require("base/handlebars");

var LiveEditor = require("live-editor/js/live-editor");

var ContentBaseView = require("content/baseview");

var ScratchpadView = ContentBaseView.extend({

    template: require("./hbtemplates/scratchpad.handlebars"),

    render: function() {
        this.$el.html(this.template(this.data_model.attributes));
    }

});

module.exports = {
    ScratchpadView: ScratchpadView
};