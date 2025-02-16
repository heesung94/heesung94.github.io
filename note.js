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
    const noteTitle = document.getElementById("note-title");

    let isDrawing = false;
    let currentTool = "pen";

    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Tool selection
    function setTool(tool) {
        currentTool = tool;
        [penTool, textTool, eraserTool].forEach(btn => {
            btn.classList.remove("active");
        });
        document.getElementById(`${tool}-tool`).classList.add("active");
    }

    penTool.addEventListener("click", () => setTool("pen"));
    eraserTool.addEventListener("click", () => setTool("eraser"));
    textTool.addEventListener("click", () => setTool("text"));

    // Clear all functionality
    clearAllButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear everything?")) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveNote();
        }
    });

    eraserTool.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (confirm("Clear entire canvas?")) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveNote();
        }
    });

    // Drawing functionality
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    function startDrawing(e) {
        if (currentTool === "text") return;
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing || currentTool === "text") return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineWidth = penSize.value;
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

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
        ctx.globalCompositeOperation = "source-over";
    }

    // Text tool
    canvas.addEventListener("click", (e) => {
        if (currentTool === "text") {
            const input = document.createElement("input");
            input.type = "text";
            input.style.position = "fixed";
            input.style.left = e.clientX + "px";
            input.style.top = e.clientY + "px";
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
                    ctx.fillText(input.value, e.clientX - rect.left, e.clientY - rect.top);
                }
                input.remove();
                saveNote();
            });

            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    input.blur();
                }
            });
        }
    });

    // Save functionality
    const params = new URLSearchParams(window.location.search);
    const noteName = params.get("note");

    if (!noteName) {
        alert("Invalid note!");
        window.location.href = "library.html";
        return;
    }

    noteTitle.textContent = noteName;

    function saveNote() {
        const noteData = canvas.toDataURL();
        let notesData = JSON.parse(localStorage.getItem("notesData")) || {};
        notesData[noteName] = noteData;
        localStorage.setItem("notesData", JSON.stringify(notesData));
    }

    saveButton.addEventListener("click", () => {
        saveNote();
        alert("Note saved!");
    });

    backButton.addEventListener("click", () => {
        saveNote();
        window.location.href = "library.html";
    });

    // Load existing note
    let notesData = JSON.parse(localStorage.getItem("notesData")) || {};
    if (notesData[noteName]) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = notesData[noteName];
    }
});