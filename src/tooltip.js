
function ToolTip() {
	this.dom = null;
}

ToolTip.prototype = {

	init: function() {
		this.initDom();
	},

	initDom: function() {
		var style = 'position: absolute; display: none; border-style: solid; white-space: nowrap; z-index: 9999999; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1); background-color: rgba(50, 50, 50, 0.701961); border-width: 0px; border-color: rgb(51, 51, 51); border-radius: 4px; color: rgb(255, 255, 255); font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 14px; font-family: sans-serif; line-height: 21px; padding: 5px;';
		this.dom = document.createElement('div');
		this.dom.style = style;

		this.dom.innerHTML = '';

		document.body.appendChild(this.dom);
	},

	setValue: function(value) {
		var innerhtml = value.title + '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + value.color + '"></span>' + value.name + ' : ' + value.value + '';
		this.dom.innerHTML = innerhtml;
	},

	getDom: function() {
		return this.dom;
	}

};

module.exports = ToolTip;