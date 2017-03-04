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
        this.duration = null;
        this.delay = null;
        this.count = null;
        this.completed = false;
        this.rafHandler = 0;

    };

    Animate.prototype = {
        animate: function (obj, opt, complete) {
            opt = opt || {
                    'easing': 'linear',
                    'duration': 500,
                    'count': 1,
                    'delay': 0
                };
            complete = complete || function () {};
            this.easing = this.tween[opt.easing];
            this.duration = opt.duration;
            this.attr = obj;
            this.count = opt.count;
            this.delay = opt.delay;

            var that = this;

            for (var attr in obj) {
                // 过滤prototype
                if (!obj.hasOwnProperty(attr)) {
                    continue;
                }
                this.startPos[attr] = (attr === 'opacity') ? this.style(this.dom, attr) * 100 : parseInt(this.style(this.dom, attr));
                this.endPos[attr] = (attr === 'opacity') ? obj[attr] * 100 : obj[attr];
            }

            // 延迟执行
            setTimeout(function () {
                that.start(complete);
                // 如果动画完成，返回当前对象
                if (that.completed) {
                    console.log('123');
                    that.completed = false;
                    return new Animate(that.dom);
                }
            }, this.delay);

            return this;

        },
        // 开始执行
        start: function (complete) {
            this.startTime = +new Date;
            var that = this;
            var raf = function () {
                if (that.step() !== false) {
                    that.rafHandler = window.requestAnimationFrame(raf);
                } else {
                    // 判断重复执行的次数
                    that.count--;
                    if (that.count) {
                        that.repeat(complete);
                    } else {
                        that.completed = true;
                        complete(that);
                    }
                }
            };

            raf();

        },
        // 停止正在执行的动画
        stop: function () {
            cancelAnimationFrame(this.rafHandler);
        },
        // 撤销回初始状态
        undo: function () {
            for (var attr in this.attr) {
                if (!this.attr.hasOwnProperty(attr)) {
                    continue;
                }
                this.update(this.startPos[attr], attr);
            }
        },
        // 重复执行操作
        repeat: function (complete) {
            this.undo();
            this.start(complete);
        },
        // 每一次执行
        step: function () {
            var t = +new Date;
            // 结束判定
            for (var attr in this.attr) {
                if (!this.attr.hasOwnProperty(attr)) {
                    continue;
                }
                if (t > this.startTime + this.duration) {
                    this.update(this.endPos[attr], attr);
                    return false;
                }
                // 通过动画算法计算属性值
                var pos = this.easing(t - this.startTime, this.startPos[attr], this.endPos[attr] - this.startPos[attr], this.duration);
                this.update(pos, attr);
            }
        },
        // 更新属性值
        update: function (pos, attr) {
            this.style(this.dom, attr, pos);
        },
        // 获取或者设置dom节点的属性值
        style: function (elem, attr, value) {
            if (!value) {
                return elem.currentStyle ? elem.currentStyle[attr] : window.getComputedStyle(elem, null)[attr];
            } else {
                elem.style[attr] = (attr === 'opacity') ? value / 100 : value + 'px';
            }
        },
        // fadeOut()
        fadeOut: function () {
            var that = this;
            this.animate({
                'opacity': 0
            }, null, function () {
                that.dom.style['display'] = 'none';
            });
        },
        // fadeIn()
        fadeIn: function () {
            var that = this;
            this.dom.style['display'] = 'block';
            this.dom.style['opacity'] = 0;
            this.animate({
                'opacity': 1
            });
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
})(window);