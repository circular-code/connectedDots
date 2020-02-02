'use strict';
function distance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function runAnimation(target, dotSize, strokeWidth, color, dotOpacity) {
    var canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    target.append(canvas);
    canvas.width = target.clientWidth;
    canvas.height = target.clientHeight;
    canvas.addEventListener("click", mouseClickHandler, false);

    function mouseClickHandler(e) {
        dots.push(new Dot(e.clientX, e.clientY));
    }

    window.addEventListener('resize', function() {
        canvas.width = target.clientWidth;
        canvas.height = target.clientHeight;
    });

    class Dot {
        constructor (x,y) {
            this.x = x;
            this.y = y;
            this.r = dotSize;
            this.angle = Math.random() * Math.PI * 2;
        }

        draw () {
            ctx.beginPath();
            ctx.globalAlpha = dotOpacity;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        move (timeDelta) {
            if ((this.x  > canvas.width - this.r) ||
                (this.x - this.r < 0) ||
                (this.y > canvas.height - this.r) ||
                (this.y - this.r) < 0)
                this.angle += Math.PI;
                // this.angle = Math.random() * Math.PI * 2;

            this.x += 30 * Math.cos(this.angle) * timeDelta;
            this.y += 30 * Math.sin(this.angle) * timeDelta;

            this.angle += Math.random() / 4 * timeDelta;
        }
    }

    var dots = [];
    for (let i = 0, length = canvas.width/100 + 5; i < length; i++)
        dots.push(new Dot(Math.random() * canvas.width, Math.random() * canvas.height));

    var time = Date.now();

    function renderLoop(now) {

        var timeDelta = (now - time) / 1000;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
            dot.move(timeDelta || 0);
            dot.draw();

            var collidedDots = dots.filter(function(target) {
                return dot !== target && distance(dot.x, dot.y, target.x, target.y) <= (dot.r + target.r + canvas.width/5);
            });

            if (collidedDots.length > 0) {
                collidedDots.forEach(target => {
                    ctx.beginPath();
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.closePath();

                    var dist = distance(dot.x, dot.y, target.x, target.y);
                    ctx.lineWidth = strokeWidth;
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = ((dist/(canvas.width/5 + dot.r + target.r) - 1) * -1);
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