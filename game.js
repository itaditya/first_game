var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');
var color_array = ["#3498DB", "#73C6B6", "#8E44AD", "#F1C40F", "#ECF0F1", "#ECF0F1", "#F39C12", "red"];

function distance(x1, x2, y1, y2) {
    var x_dis = x2 - x1;
    var y_dis = y2 - y1;
    return Math.sqrt(Math.pow(x_dis, 2) + Math.pow(y_dis, 2));
}
var mouse = {
    x: canvas.width / 2,
    y: canvas.height - (20)
};

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
}
/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */
function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;
    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;
        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);
        // Velocity after 1d collision equation
        const v1 = {
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y
        };
        const v2 = {
            x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
            y: u2.y
        };
        // Final velocity after rotating axis back to original location
    }
}

function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.velocity = {
        x: 0,
        y: 0
    };
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    }
}

function Ball(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.velocity = {
        x: Math.random() * 3,
        y: Math.random() * 3
    };
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color;
        c.stroke();
    }
    this.update = function(circle_array) {
        for (var i = 0; i < circle_array.length; i++) {
            if (distance(this.x, circle_array[i].x, this.y, circle_array[i].y) - (this.radius + circle_array[i].radius) < 0) {
                resolveCollision(this, circle_array[i]);
                circle_array[i].radius -= 5;
                this.dx = -this.dx;
                this.dy = -this.dy;
            }
        }
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}
var circle_array = [];

function init() {
    var radius = 20;
    for (var i = 0; i < 30; i++) {
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var y = Math.random() * (500 - radius * 2) + radius;
        var color = color_array[Math.floor(Math.random() * color_array.length)];
        if (i != 0) {
            for (j = 0; j < circle_array.length; j++) {
                if (distance(x, circle_array[j].x, y, circle_array[j].y) - radius * 2 < 0) {
                    x = Math.random() * (innerWidth - radius * 2) + radius;
                    y = Math.random() * (500 - radius * 2) + radius;
                    j = -1;
                }
            }
        }
        circle_array.push(new Circle(x, y, radius, color));
    }
    for (var k = 0; k < circle_array.length; k++) {
        circle_array[k].draw();
    }
}
var strike_ball;

function init2() {
    var radius = 8;
    var dx = ((Math.random() - 0.5) * 5);
    var dy = ((Math.random() - 0.5) * 5);
    strike_ball = (new Ball(mouse.x, mouse.y, radius, "red"));
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "#1e1e1e";
    c.fillRect(0, 0, canvas.width, canvas.height);
    strike_ball.update(circle_array);
    for (var k = 0; k < circle_array.length; k++) {
        circle_array[k].draw();
    }
}
init();
init2();
animate();