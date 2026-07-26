// Canvas Cursor Effect - Vanilla JavaScript
(function () {
    'use strict';

    // Oscillator class for color animation
    function Oscillator(config) {
        this.init(config || {});
    }

    Oscillator.prototype = {
        init: function (config) {
            this.phase = config.phase || 0;
            this.offset = config.offset || 0;
            this.frequency = config.frequency || 0.001;
            this.amplitude = config.amplitude || 1;
            this.value = 0;
        },
        update: function () {
            this.phase += this.frequency;
            this.value = this.offset + Math.sin(this.phase) * this.amplitude;
            return this.value;
        },
        getValue: function () {
            return this.value;
        }
    };

    // Node class for line segments
    function Node() {
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.vx = 0;
    }

    // Line class for trailing effect
    function Line(config) {
        this.init(config || {});
    }

    Line.prototype = {
        init: function (config) {
            this.spring = config.spring + 0.1 * Math.random() - 0.02;
            this.friction = settings.friction + 0.01 * Math.random() - 0.002;
            this.nodes = [];

            for (var i = 0; i < settings.size; i++) {
                var node = new Node();
                node.x = mousePos.x;
                node.y = mousePos.y;
                this.nodes.push(node);
            }
        },
        update: function () {
            var spring = this.spring;
            var node = this.nodes[0];

            node.vx += (mousePos.x - node.x) * spring;
            node.vy += (mousePos.y - node.y) * spring;

            for (var i = 0, len = this.nodes.length; i < len; i++) {
                node = this.nodes[i];

                if (i > 0) {
                    var prevNode = this.nodes[i - 1];
                    node.vx += (prevNode.x - node.x) * spring;
                    node.vy += (prevNode.y - node.y) * spring;
                    node.vx += prevNode.vx * settings.dampening;
                    node.vy += prevNode.vy * settings.dampening;
                }

                node.vx *= this.friction;
                node.vy *= this.friction;
                node.x += node.vx;
                node.y += node.vy;
                spring *= settings.tension;
            }
        },
        draw: function () {
            var x = this.nodes[0].x;
            var y = this.nodes[0].y;

            ctx.beginPath();
            ctx.moveTo(x, y);

            for (var i = 1, len = this.nodes.length - 2; i < len; i++) {
                var node = this.nodes[i];
                var nextNode = this.nodes[i + 1];
                x = 0.5 * (node.x + nextNode.x);
                y = 0.5 * (node.y + nextNode.y);
                ctx.quadraticCurveTo(node.x, node.y, x, y);
            }

            var lastNode = this.nodes[i];
            var veryLastNode = this.nodes[i + 1];
            ctx.quadraticCurveTo(lastNode.x, lastNode.y, veryLastNode.x, veryLastNode.y);
            ctx.stroke();
            ctx.closePath();
        }
    };

    // Global variables
    var ctx;
    var colorOscillator;
    var mousePos = { x: 0, y: 0 };
    var lines = [];
    var settings = {
        debug: false,
        friction: 0.5,
        trails: 20,
        size: 50,
        dampening: 0.25,
        tension: 0.98
    };
    var isInitialized = false;

    // Initialize lines
    function initLines() {
        lines = [];
        for (var i = 0; i < settings.trails; i++) {
            lines.push(new Line({
                spring: 0.4 + (i / settings.trails) * 0.025
            }));
        }
    }

    // Handle mouse/touch movement
    function handleMove(e) {
        if (e.touches) {
            mousePos.x = e.touches[0].pageX;
            mousePos.y = e.touches[0].pageY;
        } else {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        }
        e.preventDefault();
    }

    // Handle touch start
    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            mousePos.x = e.touches[0].pageX;
            mousePos.y = e.touches[0].pageY;
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchstart', handleTouchStart);
    }

    // Render loop
    function render() {
        if (!ctx.running) return;

        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'hsla(' + Math.round(colorOscillator.update()) + ',50%,50%,0.2)';
        ctx.lineWidth = 1;

        for (var i = 0; i < settings.trails; i++) {
            lines[i].update();
            lines[i].draw();
        }

        ctx.frame++;
        window.requestAnimationFrame(render);
    }

    // Resize canvas
    function resizeCanvas() {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    // Initialize canvas
    function initCanvas() {
        // Disable on mobile/touch devices
        if (window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0) {
            var canvas = document.getElementById('canvas');
            if (canvas) canvas.style.display = 'none';
            return;
        }

        var canvas = document.getElementById('canvas');
        if (!canvas) {
            console.warn('Canvas element not found');
            return;
        }

        ctx = canvas.getContext('2d');
        ctx.running = true;
        ctx.frame = 1;

        colorOscillator = new Oscillator({
            phase: Math.random() * 2 * Math.PI,
            amplitude: 85,
            frequency: 0.0015,
            offset: 285
        });

        // Set initial mouse position to center
        mousePos.x = window.innerWidth / 2;
        mousePos.y = window.innerHeight / 2;

        setupEventListeners();
        initLines();
        resizeCanvas();

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('focus', function () {
            if (!ctx.running) {
                ctx.running = true;
                render();
            }
        });
        window.addEventListener('blur', function () {
            ctx.running = true; // Keep running even when blurred
        });

        render();
        isInitialized = true;
    }

    // Cleanup function
    function cleanup() {
        if (ctx) {
            ctx.running = false;
        }
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('resize', resizeCanvas);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCanvas);
    } else {
        initCanvas();
    }

    // Expose cleanup for potential use
    window.canvasCursorCleanup = cleanup;
})();
