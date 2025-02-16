document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("drawing-canvas");
    const ctx = canvas.getContext("2d");
    const penTool = document.getElementById("pen-tool");
    const textTool = document.getElementById("text-tool");
    const eraserTool = document.getElementById("eraser-tool");
    const colorPicker = document.getElementById("color-picker");
    const penSize = document.getElementById("pen-size");
    const backButton = document.getElementById("back-button");
    const saveButton = document.getElementById("save-note");
    const clearAllButton = document.getElementById("clear-all");

    let isDrawing = false;
    let currentTool = "pen";
    
    let undoStack = [];
    let redoStack = [];
    
    let scale = 1;
    let offsetX = 0, offsetY = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;

    // 캔버스 크기 설정
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        redrawCanvas();
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function saveState() {
        undoStack.push(canvas.toDataURL());
        redoStack = []; // 새 작업을 하면 redoStack 초기화
    }

    function redrawCanvas() {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
            ctx.drawImage(img, 0, 0);
        };
        if (undoStack.length > 0) {
            img.src = undoStack[undoStack.length - 1];
        }
    }

    function undo() {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            redrawCanvas();
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            undoStack.push(redoStack.pop());
            redrawCanvas();
        }
    }

    function setTool(tool) {
        currentTool = tool;
        [penTool, textTool, eraserTool].forEach(btn => btn.classList.remove("active"));
        document.getElementById(`${tool}-tool`).classList.add("active");
    }

    penTool.addEventListener("click", () => setTool("pen"));
    eraserTool.addEventListener("click", () => setTool("eraser"));
    textTool.addEventListener("click", () => setTool("text"));

    clearAllButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear everything?")) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
    });

    canvas.addEventListener("mousedown", (e) => {
        if (e.button === 1) {
            isDragging = true;
            dragStartX = e.clientX - offsetX;
            dragStartY = e.clientY - offsetY;
            return;
        }
        if (currentTool === "text") return;
        isDrawing = true;
        saveState();
        draw(e);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            offsetX = e.clientX - dragStartX;
            offsetY = e.clientY - dragStartY;
            redrawCanvas();
            return;
        }
        draw(e);
    });

    canvas.addEventListener("mouseup", () => {
        isDrawing = false;
        isDragging = false;
        ctx.beginPath();
    });

    function draw(e) {
        if (!isDrawing || currentTool === "text") return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - offsetX) / scale;
        const y = (e.clientY - rect.top - offsetY) / scale;

        ctx.lineWidth = penSize.value / scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (currentTool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = colorPicker.value;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        const zoomFactor = e.deltaY < 0 ? (1 + zoomIntensity) : (1 - zoomIntensity);

        scale *= zoomFactor;
        offsetX = mouseX - (mouseX - offsetX) * zoomFactor;
        offsetY = mouseY - (mouseY - offsetY) * zoomFactor;

        redrawCanvas();
    });

    canvas.addEventListener("click", (e) => {
        if (currentTool === "text") {
            const input = document.createElement("input");
            input.type = "text";
            input.style.position = "absolute";
            input.style.left = `${e.clientX}px`;
            input.style.top = `${e.clientY}px`;
            input.style.font = `${penSize.value * 2}px Arial`;
            input.style.color = colorPicker.value;
            input.style.background = "transparent";
            input.style.border = "none";
            input.style.outline = "none";

            document.body.appendChild(input);
            input.focus();

            input.addEventListener("blur", () => {
                if (input.value) {
                    ctx.font = `${penSize.value * 2}px Arial`;
                    ctx.fillStyle = colorPicker.value;
                    const rect = canvas.getBoundingClientRect();
                    ctx.fillText(input.value, (e.clientX - rect.left - offsetX) / scale, (e.clientY - rect.top - offsetY) / scale);
                }
                input.remove();
                saveState();
            });

            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    input.blur();
                }
            });
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "z") {
            undo();
        } else if (e.ctrlKey && e.key === "y") {
            redo();
        }
    });

    saveButton.addEventListener("click", () => {
        saveState();
        alert("Note saved!");
    });

    backButton.addEventListener("click", () => {
        saveState();
        window.location.href = "library.html";
    });
});
