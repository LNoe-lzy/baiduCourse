/**
 * Created by lizongyuan on 2017/3/7.
 */
(function () {

    var blockwise = document.querySelector("#blockDial .blockwise");
    var secondHand = document.querySelector("#blockDial .secondHand");
    var minuteHand = document.querySelector("#blockDial .minuteHand");
    var currentTime = document.querySelector("#currentTime");

    function formate(num) {
        return num>=10? num:"0"+num;
    }

    setInterval(function () {
        var time = new Date();

        var angleSeconds = time.getSeconds() * 6;
        rotateDiv(secondHand, angleSeconds);

        var angleHours = time.getHours() * 30;
        rotateDiv(blockwise, angleHours);

        var angleMinute = time.getMinutes() * 6;
        rotateDiv(minuteHand, angleMinute);
    }, 1000);

    function rotateDiv(target, angle) {
        target.style.transform = "rotate(" + angle + "deg) ";
        target.style.transformOrigin = "100% 100%";
    }

})();