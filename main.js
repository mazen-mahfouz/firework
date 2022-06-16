let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

let pI = Math.PI / 360;

var ctx = canvas.getContext('2d');

window.addEventListener('resize', resize, false);

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawBackground() {
    ctx.globalAlpha = .1;
    const background = ctx.createLinearGradient(0, 0, 0, canvas.height);
    background.addColorStop(0, '#000B27');
    background.addColorStop(1, '#6C2484');

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawForeground = () => {
    ctx.save()
    ctx.globalAlpha = .8;
    ctx.fillStyle = '#0C1D2D';
    ctx.fillRect(0, canvas.height * .95, canvas.width, canvas.height);

    ctx.fillStyle = '#182746';
    ctx.fillRect(0, canvas.height * .955, canvas.width, canvas.height);
    ctx.restore()
};


let x_stars = [];
let y_stars = [];
let size_stars = [];
let color_stars = [];

for (let i = 0; i < 60; i++) {
    x_stars[i] = Math.random() * (canvas.width - 10) + 10;
    y_stars[i] = Math.random() * (canvas.height / 2 - 10) + 10;
    size_stars[i] = Math.random() * (4 - 1.5) + 1.5;
    color_stars[i] = `hsl(${~~(Math.random() * 360)},100%,100%)`;
}

function stars() {
    for (let i = 0; i < 60; i++) {
        ctx.save()
        ctx.globalAlpha = .5;
        ctx.beginPath()
        ctx.fillStyle = color_stars[i];
        ctx.shadowColor = color_stars[i];
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 3;
        ctx.fillRect(x_stars[i], y_stars[i], size_stars[i], size_stars[i]);
        ctx.restore()
    }
}



///////////////////////////////////////////////////////////////////////////////
let true_flase = false;
let array = ["#34495e", "#e74c3c", '#2ecc71', '#9b59b6', '#f1c40f', '#1abc9c'];

const positions = {
    mouseX: 0,
    mouseY: 0,
};

canvas.onmousedown = function(e) {
    true_flase = true;
}
canvas.onmouseup = function(e) {
    true_flase = false;
}
let particles = []
let targets = [];
// let check = false;
let speed_run = 0.9;
let aitem = -1;
class target {
    constructor(x, y, dx, dy, color, dgree, mouseX, mouseY) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.color = color
        this.dgree = dgree
        this.mouseX = mouseX
        this.mouseY = mouseY
        this.opacity = 1;
    }

    draw() {
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(this.dgree - 1.5);
        ctx.globalAlpha = this.opacity
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 5;
        ctx.rect(0, 0, 2, 50)

        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update() {
        this.draw()
        this.dx += speed_run
        this.dy += speed_run
        this.x += Math.cos(this.dgree) * this.dx
        this.y += Math.sin(this.dgree) * this.dy

        if (this.y <= this.mouseY) {
            this.opacity = 0;
        }
    }
}




const gravity = 0.3
const friction = .99

class Particle {
    constructor(x, y, dx, dy, color, size) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.color = color
        this.size = size
        this.opacity = 1
        this.height_size = this.size
    }

    draw() {
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(this.dy, this.dx) + 2.4);
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        // ctx.shadowColor = this.color;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;
        // ctx.shadowBlur = 10;
        // ctx.arc(0, 0, this.size, 0, 360 * 2, false);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.lineJoin = 'round';
        ctx.moveTo(0, 0)
        ctx.lineTo(this.size, this.size)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update() {
        this.draw()
        this.height_size += this.size
        this.dx *= friction
        this.dy *= friction
        this.dy += gravity
        this.x += this.dx;
        this.y += this.dy;


        if (this.opacity == 0.009999999999999419) {
            this.opacity = 0;
        } else {
            this.opacity -= 0.018;
        }
    }
}



let point_trukX = canvas.width / 2;
let point_trukY = canvas.height - 10;
let mouseX = 0;
let mouseY = 0;
canvas.onmousemove = function(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
}

function draw() {
    var angle = Math.atan2(mouseY - point_trukY, mouseX - point_trukX);
    ctx.save()
    ctx.globalAlpha = .8;
    ctx.translate(point_trukX, point_trukY);
    ctx.rotate(angle - 1.5);
    ctx.beginPath()
    ctx.fillStyle = '#182746';
    ctx.rect(0, 0, 20, 100)
    ctx.fill();
    ctx.restore()
}


let check = [];
window.addEventListener('click', click, false);
window.addEventListener('touchstart', click, false);

function click(e) {
    positions.mouseX = e.pageX;
    positions.mouseY = e.pageY;
    aitem += 1;
    var angle = Math.atan2(mouseY - point_trukY, mouseX - point_trukX);
    targets.push(
        new target(
            point_trukX - 7,
            point_trukY, 5, 5,
            `hsl(${Math.random() * 360}, 50%, 50%)`,
            angle,
            positions.mouseX,
            positions.mouseY
        )
    )
}


function firework(t) {
    const particleCount = 200;
    const power = 7
    let radians = (Math.PI * 2) / particleCount;
    for (let i = 0; i < particleCount; i++) {
        particles.push(
            new Particle(
                targets[t].mouseX,
                targets[t].mouseY,
                Math.cos(radians * i) * (Math.random() * power),
                Math.sin(radians * i) * (Math.random() * power) - 4,
                `hsl(${Math.random() * 360}, 100%, 50%)`,
                (Math.random() * 5) + 3,
            )
        )
    }
}






function init() {
    // ctx.translate(0, 0);
    // ctx.clearRect(0, 0, innerWidth, innerHeight);
    drawBackground()
    drawForeground()
    stars()


    for (let i = 0; i < targets.length; i++) {
        if (targets[i].opacity > 0) {
            targets[i].update()
            check[i] = false;
        } else {
            firework(i)
            check[i] = true;
            targets[i].opacity = 0;
            targets.splice(i, 1);

        }
    }


    draw()

    // for (let ii = 0; ii < particles.length; ii++) {
    //     if (particles[ii].opacity > 0) {
    //         particles[ii].update();
    //     }
    // }
    //         particles[ii].opacity = 0;
    //         particles.splice(ii, 1);


    //     }
    //     if (ii >= particles.length) {

    //     }
    // }
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].opacity > 0) {
            particles[i].update();
        } else {
            particles[i].opacity = 0;
            particles.splice(i, 1);
        }
    }

    // if (targets !== undefined) {
    //     targets.draw()
    //     targets.update()
    // }

    requestAnimationFrame(init);
}
init()