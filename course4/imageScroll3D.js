/**
 * Created by lizongyuan on 2017/2/26.
 */
;(function (window) {
    window.ImageScroll3D = function (elem, nums) {
        return new ImageScroll3D(elem, nums);
    };

    // @param{Object} elem DOM元素
    // @param{Number} nums 图片的数量
    function ImageScroll3D(elem, nums) {
        this.elem = elem;
        this.nums = nums;
        this.x = 0;
        this.timer = null;
        this.animated = false;
        this.start();
    }

    ImageScroll3D.prototype.animate = function (direction) {
        var that = this;
        var deg = Math.floor(360 / this.nums);
        var elem = this.elem;
        if (!this.animated) {
            var timer = setInterval(function () {
                that.x = direction ? that.x + 10 : that.x - 10;
                elem.style.webkitTransform = 'rotateY(' + that.x + 'deg)';
                if (that.x % deg === 0) {
                    that.animated = false;
                    clearInterval(timer);
                    if (that.x === 360) {
                        that.x = 0;
                    }
                }
            }, 50);
        }
        this.animated = true;
    };

    ImageScroll3D.prototype.start = function () {
        var that = this;
        this.timer = setInterval(function () {
            that.animate(true);
        }, 1000);
    };

    ImageScroll3D.prototype.stop = function () {
        clearInterval(this.timer);
    }

})(window);