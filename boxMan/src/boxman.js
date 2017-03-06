/**
 * Created by lizongyuan on 2017/3/5.
 */
;(function (window) {
    window.Boxman = function (stage, config) {
        return new Boxman(stage, config);
    };

    function Boxman(stage, config) {
        this.stage = stage;
        this.config = config;
        this.wall = [];
        this.box = [];
        this.end = [];
        this.man = null;

        // 不同方向对应的图片索引
        this.rightIndex = 2;
        this.leftIndex = 1;
        this.downIndex = 4;
        this.upIndex = 7;
        // 存储当前移动的箱子的div，用于判断箱子是否到达目标点
        this.currentBox = null;

        this.direction = 'right';
        this.status = [];

        this.init();
    }

    Boxman.prototype = {
        /**
         * 初始化函数
         */
        init: function () {
            this.wallInit(this.config['wallArr']);
            this.boxInit(this.config['boxArr']);
            this.manInit(this.config['manArr']);
            this.endInit(this.config['endArr']);
            this.keyEvent();
        },
        /**
         * 初始化箱子
         * @param wall
         */
        wallInit: function (wall) {
            for (var i = 0; i < wall.length; i++) {
                this.add('wall', wall[i]);
            }
        },
        /**
         * 初始化箱子
         * @param box
         */
        boxInit: function (box) {
            for (var i = 0; i < box.length; i++) {
                this.add('box', box[i]);
            }
        },
        /**
         * 初始化终点
         * @param end
         */
        endInit: function (end) {
            for (var i = 0; i < end.length; i++) {
                this.add('end', end[i]);
                this.status.push({s: false, t: null});
            }
        },
        /**
         * 初始化人
         * @param man
         */
        manInit: function (man) {
            this.add('man', man);
        },
        /**
         * 人移动的函数
         * @param index
         */
        manWalk: function (index) {
            var that = this;
            var currentLeft = parseInt(this.man.style.left);
            var currentTop = parseInt(this.man.style.top);
            this.man.style.backgroundImage = 'url("../boxMan/src/img/Character' + index + '.png")';
            if (that.direction === 'right') {
                if (this.obstacle(currentLeft + 50, currentTop, 'wall') === true || this.boxMove(currentLeft + 50, currentTop) === false) {
                    this.man.style.left = currentLeft + 'px';
                } else {
                    this.man.style.left = currentLeft + 50 + 'px';
                }
            }
            if (that.direction === 'left') {
                if (this.obstacle(currentLeft - 50, currentTop, 'wall') === true || this.boxMove(currentLeft - 50, currentTop) === false) {
                    this.man.style.left = currentLeft + 'px';
                } else {
                    this.man.style.left = currentLeft - 50 + 'px';
                }

            }
            if (that.direction === 'up') {
                if (this.obstacle(currentLeft, currentTop - 50, 'wall') === true || this.boxMove(currentLeft, currentTop - 50) === false) {
                    this.man.style.top = currentTop + 'px';
                } else {
                    this.man.style.top = currentTop - 50 + 'px';
                }

            }
            if (that.direction === 'down') {
                if (this.obstacle(currentLeft, currentTop + 50, 'wall') === true || this.boxMove(currentLeft, currentTop + 50) === false) {
                    this.man.style.top = currentTop + 'px';
                } else {
                    this.man.style.top = currentTop + 50 + 'px';
                }
            }
        },
        /**
         * 判断是否因为碰到障碍物而停止
         * @param left
         * @param top
         * @param type
         */
        obstacle: function (left, top, type) {
            for (var i = 0, tmp; tmp = this[type][i++];) {
                var l = parseInt(tmp.style.left);
                var t = parseInt(tmp.style.top);
                if (left === l && t === top) {
                    return true;
                }
            }
        },
        /**
         * 箱子移动函数
         * @param left
         * @param top
         * @returns {boolean}
         */
        boxMove: function (left, top) {
            for (var i = 0, box; box = this.box[i++];) {
                var l = parseInt(box.style.left);
                var t = parseInt(box.style.top);
                if (left === l && t === top) {
                    this.currentBox = box;
                    if (this.direction === 'left') {
                        if (this.obstacle(l - 50, t, 'wall') || this.obstacle(l - 50, t, 'box')) {
                            box.style.left = l + 'px';
                            return false;
                        }
                        box.style.left = l - 50 + 'px';
                    }
                    if (this.direction === 'right') {
                        if (this.obstacle(l + 50, t, 'wall') || this.obstacle(l + 50, t, 'box')) {
                            box.style.left = l + 'px';
                            return false;
                        }
                        box.style.left = l + 50 + 'px';
                    }
                    if (this.direction === 'up') {
                        if (this.obstacle(l, t - 50, 'wall') || this.obstacle(l, t - 50, 'box')) {
                            box.style.top = t - 'px';
                            return false;
                        }
                        box.style.top = t - 50 + 'px';
                    }
                    if (this.direction === 'down') {
                        if (this.obstacle(l, t + 50, 'wall') || this.obstacle(l, t + 50, 'box')) {
                            box.style.top = t + 'px';
                            return false;
                        }
                        box.style.top = t + 50 + 'px';
                    }
                }
            }
            this.win();
        },
        /**
         * 判断目标位置是否全部被占据
         */
        win: function () {
            if (this.currentBox === null) {
                return;
            }
            for (var i = 0; i < this.end.length; i++) {
                if (this.status[i].t !== this.currentBox && this.status[i].t !== null) {
                    continue;
                }
                var l = parseInt(this.end[i].style.left);
                var t = parseInt(this.end[i].style.top);
                if (parseInt(this.currentBox.style.left) === l && parseInt(this.currentBox.style.top) === t) {
                    this.status[i].s = true;
                    this.status[i].t = this.currentBox;
                } else {
                    this.status[i].s = false;
                    this.status[i].t = null;
                }
            }
        },
        /**
         * 判断是否胜利
         * @returns {boolean}
         */
        isWin: function () {
            var tmp = 0;
            for (var i = 0, s; s = this.status[i++];) {
                if (s.s) {
                    tmp++;
                }
            }
            return tmp === this.status.length;
        },
        /**
         * 为舞台添加指定的元素类型
         * @param type
         * @param posArr
         */
        add: function (type, posArr) {
            var node = document.createElement('div');
            this.stage.appendChild(node);
            node.className = type;
            node.style['left'] = posArr[0] + 'px';
            node.style['top'] = posArr[1] + 'px';
            if (type === 'man') {
                this.man = node;
            } else {
                this[type].push(node);
            }
        },
        /**
         * 定义键盘事件
         */
        keyEvent: function () {
            var that = this;
            this.addEvent(document, 'keydown', function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 65) {
                    that.direction = 'left';
                    if (that.leftIndex > 1) {
                        that.leftIndex = 0;
                    }
                    that.manWalk(that.leftIndex);
                    that.leftIndex++;
                    if (that.isWin()) {
                        setTimeout(function () {
                            alert('you win');
                        }, 100);
                    }
                }
                if (e && e.keyCode == 68) {
                    that.direction = 'right';
                    if (that.rightIndex > 3) {
                        that.rightIndex = 2;
                    }
                    that.manWalk(that.rightIndex);
                    that.rightIndex++;
                    if (that.isWin()) {
                        setTimeout(function () {
                            alert('you win');
                        }, 100);
                    }
                }
                if (e && e.keyCode == 87) {
                    that.direction = 'up';
                    if (that.upIndex > 9) {
                        that.upIndex = 7;
                    }
                    that.manWalk(that.upIndex);
                    that.upIndex++;
                    if (that.isWin()) {
                        setTimeout(function () {
                            alert('you win');
                        }, 100);
                    }
                }
                if (e && e.keyCode == 83) {
                    that.direction = 'down';
                    if (that.downIndex > 6) {
                        that.downIndex = 4;
                    }
                    that.manWalk(that.downIndex);
                    that.downIndex++;
                    if (that.isWin()) {
                        setTimeout(function () {
                            alert('you win');
                        }, 100);
                    }
                }
            });
        },
        /**
         * 惰性加载的事件处理函数
         * @param elem 元素对象
         * @param type 事件类型
         * @param handler 事件处理的回调函数
         */
        addEvent: function (elem, type, handler) {
            if (window.addEventListener) {
                this.addEvent = function (elem, type, handler) {
                    elem.addEventListener(type, handler);
                }
            } else if (window.attachEvent) {
                this.addEvent = function (elem, type, handler) {
                    elem.attachEvent('on' + type, handler);
                }
            }
            this.addEvent(elem, type, handler);
        },
        /**
         * 获取元素的属性值
         * @param elem 元素
         * @param attr 元素属性
         * @returns {Number} 返回属性值
         */
        getStyle: function (elem, attr) {
            return elem.currentStyle ? parseInt(elem.currentStyle[attr]) : parseInt(window.getComputedStyle(elem, null)[attr]);
        }
    }

})(window);