'use strict';
function distance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function runAnimation(target, dotSize, strokeWidth, color, dotOpacity, newDotColor) {
    var canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    target.append(canvas);
    canvas.width = target.clientWidth;
    canvas.height = target.clientHeight;
    let size = (target.clientWidth + target.clientHeight) / 2;
    canvas.addEventListener("click", mouseClickHandler, false);
    canvas.addEventListener("touchstart", mouseClickHandler, false);

    function mouseClickHandler(e) {
        if (dots.length > 50)
            dots.shift();

        dots.push(new Dot(e.pageX, e.pageY, newDotColor));
    }

    window.addEventListener('resize', function() {
        canvas.width = target.clientWidth;
        canvas.height = target.clientHeight;
    });

    class Dot {
        constructor (x,y, color) {
            var angle = Math.random() * Math.PI * 2;
            this.x = x;
            this.xDir = angle > Math.PI ? -1 : 1;
            this.y = y;
            this.yDir = (angle > Math.PI/2) || (angle < (Math.PI + Math.PI/2)) ? -1 : 1;
            this.r = dotSize;
            this.angle = angle;
            this.color = color;
        }

        draw () {
            ctx.beginPath();
            ctx.globalAlpha = dotOpacity;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = this.color || color;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        move (timeDelta) {

            // adjust to vertical scrollbar
            var width = window.document.body.clientWidth < canvas.width ? window.document.body.clientWidth : canvas.width;

            if (this.x >= (width - this.r) || (this.x - this.r) <= 0)
                this.xDir *= -1;

            else if (this.y > (canvas.height - this.r) || (this.y - this.r) <= 0)
                this.yDir *= -1;

            this.x += 30 * this.xDir * Math.cos(this.angle) * timeDelta;
            this.y += 30 * this.yDir * Math.sin(this.angle) * timeDelta;
        }
    }

    var dots = [];
    for (let i = 0, length = size/70 + 5; i < length; i++)
        dots.push(new Dot(Math.random() * (canvas.width - 5) + 5, (Math.random() * (canvas.height - 5) + 5)));

    var time = Date.now();

    function renderLoop(now) {

        var timeDelta = (now - time) / 1000;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //prevent huge jumps of dot movement when leaving site
        if (timeDelta >= 0.05)
            timeDelta = 0.01;

        dots.forEach(dot => {
            dot.move(timeDelta || 0);
            dot.draw();

            var collidedDots = dots.filter(target => dot !== target && distance(dot.x, dot.y, target.x, target.y) <= (dot.r + target.r + size/5));

            if (collidedDots.length > 0) {
                collidedDots.forEach(target => {
                    ctx.beginPath();
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.closePath();

                    var dist = distance(dot.x, dot.y, target.x, target.y);
                    ctx.lineWidth = strokeWidth;
                    ctx.strokeStyle = dot.color || color;
                    ctx.globalAlpha = ((dist/(size/5 + dot.r + target.r) - 1) * -1);
                    ctx.stroke();
                    ctx.globalAlpha = 1;

                    dot.draw();
                    target.draw();
                });
            }
        });

        time = now;

        requestAnimationFrame(renderLoop);
    }

    renderLoop();
}