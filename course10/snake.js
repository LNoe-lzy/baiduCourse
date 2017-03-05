/**
 * Created by lizongyuan on 2017/3/4.
 */
;(function () {
    /**
     * 导出snake对象
     * @param dom
     * @returns {Snake}
     * @constructor
     */
    window.Snake = function (dom) {
        return new Snake(dom);
    };

    /**
     * 构造器
     * @param dom 传入舞台的dom节点
     * @constructor
     */
    function Snake(dom) {
        this.dom = dom;
        // 存储蛇身的位置
        this.body = [];
        this.food = [];
        // 每一步的宽和高
        this.width = 0;
        this.height = 0;
        this.startPos = 0;
        // 声明定时器
        this.timer = 0;
        this.direction = 'right';

        this.row = 0;
        this.col = 0;
        this.speed = 0;

        this.current = {
            left: 0,
            top: 0
        };

        // 初始化
        this.init(10, 10, 500);
    }
    Snake.prototype = {
        /**
         * 初始化函数
         */
        init: function (row, col, speed) {
            this.row = row;
            this.col = col;
            this.speed = speed;
            this.create(row, col);
            this.keyEvent();

            this.foodInit(Math.floor(this.row / 2));
            this.eat();
            this.move(speed);
        },
        /**
         * 创建基本环境
         * @param row 行数
         * @param col 列数
         */
        create: function (row, col) {
            // 获取舞台的宽和高
            var sw = parseInt(this.style(this.dom, 'width'));
            var sh = parseInt(this.style(this.dom, 'height'));
            this.width = Math.floor(sw / row);
            this.height = Math.floor(sh / row);
            // 初始化第一个元素
            this.add(Math.floor(row / 2) * this.width, Math.floor(col / 2) * this.height);
        },
        /**
         * 判断是否进入下一关
         */
        next: function () {
            if (this.food.length === 1) {
                clearInterval(this.timer);
                this.flash();
                this.food = [];
                this.body = [];
                this.init(this.row * 2, this.col * 2, this.speed / 2);

            }
        },
        /**
         * 刷新页面节点
         */
        flash: function () {
            console.log('123');
            for (var i = 0, snake; snake = this.body[i++];) {
                this.dom.removeChild(snake);
            }
        },
        /**
         * 开始移动的函数
         * @param speed 速度
         */
        move: function (speed) {
            var that = this;
            this.timer = setInterval(function () {
                that.next();
                if (that.step() === false) {
                    alert('游戏结束');
                    clearInterval(that.timer);
                }
            }, speed);
        },
        /**
         * 移动的每一步
         * @returns {boolean} 返回是否结束的布尔值
         */
        step: function () {
            var that = this;
            // 对第一个元素的操作
            var ce = this.body[0];
            var cl = parseInt(this.style(ce, 'left'));
            var ct = parseInt(this.style(ce, 'top'));
            if (cl > this.width * this.row - this.width) {
                return false;
            } else if (cl < 0) {
                return false;
            } else if (ct < 0) {
                return false;
            } else if (ct > this.width * this.row ) {
                return false;
            }
            this.current.left = cl;
            this.current.top = ct;
            if (this.direction === 'left') {
                ce.style['left'] = cl - this.width + 'px';
            } else if (this.direction === 'right') {
                ce.style['left'] = cl + this.width + 'px';
            } else if (this.direction === 'up') {
                ce.style['top'] = ct - this.height + 'px';
            } else if (this.direction === 'down') {
                ce.style['top'] = ct + this.height + 'px';
            }
            // 除去第一个元素，其余的每一个元素的新位置都是前一个元素的旧位置
            for (var i = 1; i < this.body.length; i++) {
                var elem = this.body[i];
                var l = parseInt(this.style(elem, 'left'));
                var t = parseInt(this.style(elem, 'top'));
                elem.style['left'] = this.current.left + 'px';
                elem.style['top'] = this.current.top + 'px';
                this.current.left = l;
                this.current.top = t;
            }
            // 此时的current为最后一个元素的位置
            cl = parseInt(ce.style.left);
            ct = parseInt(ce.style.top);
            this.eat(cl, ct, this.current.left, this.current.top);
            this.over(cl, ct);
        },
        /**
         * 判断是否碰到自身
         * @param left 第一个元素的left
         * @param top 第一个元素的top
         */
        over: function (left, top) {
            // 遍历snake数组
            for (var i = 0, snake; snake = this.body[++i];) {
                var sl = parseInt(snake.style.left);
                var st = parseInt(snake.style.top);
                if (sl === left && st === top) {
                    alert('游戏结束');
                    clearInterval(this.timer);
                    break;
                }
            }
        },
        /**
         * 为snake数组添加子节点
         * @param left 节点的left
         * @param top 节点的top
         */
        add: function (left, top) {
            var cube = document.createElement('div');
            cube.className = 'snake';
            this.dom.appendChild(cube);
            this.style(cube, 'width', this.width);
            this.style(cube, 'height', this.height);
            cube.style['left'] = left + 'px';
            cube.style['top'] = top + 'px';
            // 添加倒数组中
            this.body.push(cube);
        },
        /**
         * 生成随机食物
         * @param n 要生成的食物的数量
         */
        foodInit: function (n) {
            // todo: bug 第一个元素吃不到，暂时解决办法，用一个空节点占位
            var seat = document.createElement('div');
            this.dom.appendChild(seat);
            seat.style['left'] = 0 + 'px';
            seat.style['top'] = 0 + 'px';
            this.food.push(seat);
            for (var i = 0; i < n; i++) {
                var node = document.createElement('div');
                this.dom.appendChild(node);
                node.className = 'food';
                this.style(node, 'width', this.width);
                this.style(node, 'height', this.height);
                node.style['left'] = this.rand(0, this.row - 1) * this.width + 'px';
                node.style['top'] = this.rand(0, this.col - 1) * this.height + 'px';
                this.food.push(node);
            }
        },
        /**
         * 判断是否吃到食物
         * @param left 第一个元素的left
         * @param top 第一个元素的top
         * @param lastLeft 最后一个元素的left
         * @param lastTop 最后一个元素的top
         */
        eat: function (left, top, lastLeft, lastTop) {
            // 遍历食物数组
            for (var i = 0, food; food = this.food[++i];) {
                // 获取当前食物的left and top
                var fl = parseInt(food.style.left);
                var ft = parseInt(food.style.top);
                if (left === fl && top === ft) {
                    this.food.splice(i, 1);
                    this.dom.removeChild(food);
                    this.add(lastLeft, lastTop);
                    break;
                }
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
                }
                if (e && e.keyCode == 68) {
                    that.direction = 'right';
                }
                if (e && e.keyCode == 87) {
                    that.direction = 'up';
                }
                if (e && e.keyCode == 83) {
                    that.direction = 'down';
                }
            });
        },
        /**
         * 设置或者获取元素的样式
         * @param elem 元素
         * @param attr 属性
         * @param value 属性值
         * @returns {*} 返回获取到的属性值或者设置样式
         */
        style: function (elem, attr, value) {
            if (!value) {
                return elem.currentStyle ? elem.currentStyle[attr] : window.getComputedStyle(elem, null)[attr];
            } else {
                elem.style[attr] = value + 'px';
            }
        },
        /**
         * 生成随机数
         * @param min 范围最小值
         * @param max 范围最大值
         * @returns {*}
         */
        rand: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
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
        }
    }
})(window);