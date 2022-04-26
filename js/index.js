
(function () {
  "use strict";
  function Slider(options) {
    var slider = document.getElementsByClassName(options.slider)[0];
    this.slider = slider;
    this.items = slider.children;
    this.count = slider.childElementCount;
    this.speed = options.speed;
    this.showPoints = options.showPoints || true;
    this.pointItems = [];
    if (this.showPoints) {
      this.pointItems = this.initPoints("point-wrapper", "point-item");
    }
    this.start();
    this.index = 0;
    this.timer;
    this.animateTimer;
  }

  /**
   * 计算一个元素当前的样式
   */
  var getStyle = (function () {
    if (window.getComputedStyle) {
      return function (ele, prop) {
        var styles = window.getComputedStyle(ele, null);
        return styles[prop] ? styles[prop] : undefined;
      };
    }

    return function (el, prop) {
      // ie
      var styles = el.currentStyle;
      return styles[prop] ? styles[prop] : undefined;
    };
  })();

  // 选中一个指示灯
  Slider.prototype.selectPoint = function () {
    var items = this.pointItems;
    for (var i = 0, len = items.length; i < len; i++) {
      items[i].classList.remove("active");
    }
    items[this.index].classList.add("active");
  };

  // 开启循环
  Slider.prototype.start = function () {
    this.timer && clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.index += 1;
      if (this.index >= this.count) {
        this.index = 0;
      }
      this.move();
    }, 2000);
  };

  // 切换动画
  Slider.prototype.move = function () {
    var sliderWidth = parseInt(getStyle(this.slider, "width")), // 总宽度
      itemWidth = sliderWidth / this.count, // 每一个的宽度
      target = this.index * itemWidth, // 目标位置
      current = target - itemWidth; // 当前位置

    this.animateTimer && clearInterval(this.animateTimer);
    this.animateTimer = setInterval(() => {
      // start move animate
      current += 10;
      if (current >= target) {
        current = target;
        this.slider.style.marginLeft = -current + "px";
        this.animateTimer && clearInterval(this.animateTimer);
        return;
      }
      this.slider.style.marginLeft = -current + "px";
    }, 5);
    this.selectPoint();
  };

  // 初始化指示灯
  Slider.prototype.initPoints = function (pointClass, itemClass) {
    var mouseEnterHandler = (i) => {
      return () => {
        this.timer && clearInterval(this.timer);
        this.animateTimer && clearInterval(this.animateTimer);
        this.index = i;
        this.move();
      };
    };
    var mouseLeaveHandler = (i) => {
      this.index = i;
      return this.start.bind(this);
    };

    var pointWrapper = document.createElement("ul");
    pointWrapper.classList.add(pointClass);
    var item;
    var pointItems = [];
    for (var i = 0, len = this.count; i < len; i++) {
      item = document.createElement("li");
      item.classList.add(itemClass);
      (function (i) {
        item.onmouseenter = mouseEnterHandler(i);
        item.onmouseleave = mouseLeaveHandler(i);
      })(i);
      pointItems.push(item);
      pointWrapper.appendChild(item);
    }
    this.slider.appendChild(pointWrapper);
    pointItems[0].classList.add("active");
    return pointItems;
  };

  window.Slider = Slider;
})();
