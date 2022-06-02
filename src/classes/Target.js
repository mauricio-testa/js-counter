/**
 * class to validate, structure and assign the action of each target
 */

class Target {
  constructor(params, counterOptions) {
    const defaults = {
      selector: null,
      property: 'width',
      type: 'text',
      unit: '%',
      percentage: true,
      mode: 'precision',
    };

    this.counterOptions = counterOptions
    this.options = { ...defaults, ...params };
  }

  /**
   * Update DOM element as counter updates
   */

  get update() {
    switch (this.options.type) {
      case 'text':
        return function (value) {
          const _value = this.options.percentage ? (value * 100 / this.counterOptions.max) : value
          this.element.textContent = `${Math.round(_value).toLocaleString()}${this.options.percentage ? '%' : ''}`
        }

      case 'style':
        return function (value) {
          if (this.options.mode == 'performance') {
            if (value == (this.counterOptions.from + this.counterOptions.step)) {
              this.element.style.setProperty('transition-property', this.options.property);
              this.element.style.setProperty('transition-duration', this.counterOptions.duration+'ms');
              this.element.style.setProperty('transition-timing-function', 'linear');
              this.element.style.setProperty(this.options.property, this.counterOptions.to + this.options.unit);
            }
          }
          else {
            this.element.style.setProperty(this.options.property, (value * 100 / this.counterOptions.max) + this.options.unit);
          }
        }
    }
  }

  /**
   * Returns the target's DOM element
   */

  get element() {
    return document.querySelector(this.options.selector)
  }

  /**
   * Returns if target is valid
   */

  get valid() {

    if (!this.options.selector)
      throw new Error('SELECTOR_NOT_FOUND');

    if (!this.element)
      throw new Error('NO_DOM_ELEMENT_FOUND_FOR_THE_SELECTOR');

    if (!['text', 'style'].includes(this.options.type))
      throw new Error('INVALID_TARGET_TYPE');

    if (this.options.type == 'style' && !this.options.property)
      throw new Error('NO_CSS_PROPERTY_PROVIDED');

    return true
  }
}

export default Target;