const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clearBtn");

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#241b38";
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let isDrawing = false;

canvas.addEventListener("mousedown", function(event) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
});

canvas.addEventListener("mousemove", function(event) {
    if(!isDrawing) return;

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
});

canvas.addEventListener("mouseup", function() {
    isDrawing = false;
});

canvas.addEventListener("mouseleave", function() {
    isDrawing = false;
});

clearBtn.addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
