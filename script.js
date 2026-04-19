const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const controls = {
    brushToggle: document.getElementById("brushToggle"),
    clearBtn: document.getElementById("clearBtn"),
    colorPicker: document.getElementById("colorPicker"),
    brushSize: document.getElementById("brushSize"),
    eraserSize: document.getElementById("eraserSize"),
    eraserToggle: document.getElementById("eraserToggle"),
    saveBtn: document.getElementById("saveBtn"),
    recentColorsContainer: document.getElementById("recentColors"),
};
const DEFAULT_STROKE = "#241b38";
const CANVAS_FILL = "#ffffff";
const MAX_RECENT_COLORS = 3;
let recentColors = [];
let isDrawing = false;
let activeTool = "brush";

function getSelectedColor() {
    return controls.colorPicker.value || DEFAULT_STROKE;
}

function configureBrush() {
    const isEraser = activeTool === "eraser";
    ctx.lineWidth = Number(isEraser ? controls.eraserSize.value : controls.brushSize.value);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isEraser ? CANVAS_FILL : getSelectedColor();
    ctx.globalCompositeOperation = "source-over";
}

function fillCanvasBackground() {
    ctx.save();
    ctx.fillStyle = CANVAS_FILL;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function setActiveTool(tool) {
    activeTool = tool;
    controls.brushToggle.classList.toggle("is-active", tool === "brush");
    controls.eraserToggle.classList.toggle("is-active", tool === "eraser");
    configureBrush();
}

function resizeCanvas() {
    let snapshot = null;

    if (canvas.width > 0 && canvas.height > 0) {
        snapshot = document.createElement("canvas");
        snapshot.width = canvas.width;
        snapshot.height = canvas.height;
        snapshot.getContext("2d").drawImage(canvas, 0, 0);
    }

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    fillCanvasBackground();

    if (snapshot) {
        ctx.drawImage(snapshot, 0, 0, canvas.width, canvas.height);
    }

    configureBrush();
}

function beginStroke(event) {
    isDrawing = true;
    configureBrush();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);

    if (activeTool === "brush") {
        addRecentColor(getSelectedColor());
    }
}

function drawStroke(event) {
    if (!isDrawing) {
        return;
    }

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

function endStroke() {
    isDrawing = false;
    ctx.beginPath();
}

function refreshBrush() {
    configureBrush();
}

function activateBrush() {
    setActiveTool("brush");
}

function toggleEraser() {
    const nextTool = activeTool === "eraser" ? "brush" : "eraser";
    setActiveTool(nextTool);
}

function addRecentColor(color) {
    recentColors = recentColors.filter(recentColor => recentColor !== color);
    recentColors.unshift(color);

    if (recentColors.length > MAX_RECENT_COLORS) {
        recentColors.length = MAX_RECENT_COLORS;
    }

    updateRecentColors();
}

function clearCanvas() {
    fillCanvasBackground();
    ctx.beginPath();
}

function saveDrawing() {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "my_drawing.png";
    link.click();
}

function updateRecentColors() {
    controls.recentColorsContainer.innerHTML = "";

    recentColors.forEach(color => {
        const box = document.createElement("button");
        box.classList.add("color-box");
        box.style.backgroundColor = color;
        box.type = "button";
        box.title = `Use ${color}`;

        box.addEventListener("click", function() {
            controls.colorPicker.value = color;
            setActiveTool("brush");
        });

        controls.recentColorsContainer.appendChild(box);
    });
}

function bindEvents() {
    window.addEventListener("resize", resizeCanvas);
    controls.brushSize.addEventListener("input", function() {
        activateBrush();
        refreshBrush();
    });
    controls.brushToggle.addEventListener("click", activateBrush);
    controls.colorPicker.addEventListener("input", activateBrush);
    controls.eraserSize.addEventListener("input", function() {
        setActiveTool("eraser");
    });
    controls.eraserToggle.addEventListener("click", toggleEraser);
    canvas.addEventListener("pointerdown", beginStroke);
    canvas.addEventListener("pointermove", drawStroke);
    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointerleave", endStroke);
    controls.clearBtn.addEventListener("click", clearCanvas);
    controls.saveBtn.addEventListener("click", saveDrawing);
}

function initializeApp() {
    setActiveTool("brush");
    resizeCanvas();
    refreshBrush();
    updateRecentColors();
    bindEvents();
}

initializeApp();
