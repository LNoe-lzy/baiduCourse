/**
 * Created by lizongyuan on 2017/3/1.
 */

;(function (window) {
    // requestAnimationFrame兼容性
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    window.Animate = function (dom) {
        return new Animate(dom);
    };

    var Animate = function (dom) {
        this.dom = dom;
        this.startTime = 0;
        this.startPos = {};
        this.endPos = {};
        this.attr = null;
        this.easing = null;
        this.duration = null
    };

    Animate.prototype = {
        animate: function (attr, endPos, duration, easing) {
            this.startTime = +new Date;
            this.startPos = parseInt(this.style(this.dom, attr));
            this.endPos = endPos;
            this.attr = attr;
            this.easing = this.tween[easing];
            this.duration = duration;

            var that = this;

            var ref = function () {
                if (that.step() !== false) {
                    window.requestAnimationFrame(ref);
                }
            };

            window.requestAnimationFrame(ref);

        },
        // 每一次执行
        step: function () {
            var t = +new Date;
            // 结束判定
            if (t > this.startTime + this.duration) {
                this.update(this.endPos);
                return false;
            }
            // 通过动画算法计算位置
            var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
            this.update(pos);
        },
        // 更新属性值
        update: function (pos) {
            this.style(this.dom, this.attr, pos);
        },

        style: function (elem, attr, value) {
            if (!value) {
                return elem.currentStyle ? elem.currentStyle[attr] : window.getComputedStyle(elem, null)[attr];
            } else {
                elem.style[attr] = value + 'px';
            }
        },
        tween: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },
            linear: function (t, b, c, d) {
                return c * t / d + b;
            }
        }
    }
    ;
})(window);/**
 * Created by lizongyuan on 2017/3/1.
 */
