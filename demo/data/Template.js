class TemplateToolbar {
  /**
   * @param {Object} options
   * @param {string=} options.color
   * @param {string=} options.title
   * @param {(string|string[])=} options.start
   * @param {(string|string[])=} options.end
   */
  constructor(options = {}) {
    this.color = options.color;
    this.title = options.title;
    if (options.start) {
      this.start = Array.isArray(options.start) ? options.start : [options.start];
    } else {
      this.start = [];
    }
    if (options.end) {
      this.end = Array.isArray(options.end) ? options.end : [options.end];
    } else {
      this.end = [];
    }
  }
}

class Template {
  /**
   * @param {Object} options
   * @param {string} options.id
   * @param {string} options.img
   * @param {string=} options.statusBarColor
   * @param {TemplateToolbar=} options.toolbar
   * @param {string=} options.content
   * @param {(function(MouseEvent):void)=} options.onImageClick
   */
  constructor(options) {
    this.id = options.id;
    this.img = options.img;
    this.statusBarColor = options.statusBarColor;
    this.toolbar = options.toolbar || new TemplateToolbar();
    this.content = options.content || '';
    this.onImageClick = options.onImageClick;
  }
}

export {
  TemplateToolbar,
  Template,
};
