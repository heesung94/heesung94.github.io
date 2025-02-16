// library.js

document.addEventListener("DOMContentLoaded", () => {
    const noteList = document.getElementById("note-list");
    const searchBar = document.getElementById("search-bar");
    const newNoteBtn = document.getElementById("new-note-btn");
    const newNoteModal = document.getElementById("new-note-modal");
    const createNoteBtn = document.getElementById("create-note-btn");
    const newNoteName = document.getElementById("new-note-name");
    const closeModalBtn = document.getElementById("close-modal-btn"); // 추가된 닫기 버튼

    function loadNotes() {
        noteList.innerHTML = "";
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        if (notes.length === 0) {
            noteList.innerHTML = "<p class='empty-message'>Create a new note!</p>";
        } else {
            notes.forEach((note, index) => createNoteElement(note, index));
        }
    }

    function createNoteElement(note, index) {
        const noteItem = document.createElement("div");
        noteItem.classList.add("note-item");
        noteItem.draggable = true;
        noteItem.innerHTML = `
            <span class="note-title">${note}</span>
            <button class="delete-note" data-index="${index}">🗑️</button>
            `;
        noteList.appendChild(noteItem);

        // ✅ 노트 클릭 시 해당 노트 페이지로 이동하는 기능 추가
        noteItem.addEventListener("click", (e) => {
            window.location.href = `note.html?note=${encodeURIComponent(note)}`;
        });

        // 🗑️ 삭제 버튼 기능
        noteItem.querySelector(".delete-note").addEventListener("click", (e) => {
            e.stopPropagation(); // 부모 div의 클릭 이벤트 방지
            const index = e.target.dataset.index;
            if (confirm("Are you sure you want to delete this note?")) {
                deleteNote(index);
            }
        });
    }

    function deleteNote(index) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    }

    createNoteBtn.addEventListener("click", () => {
        const noteName = newNoteName.value.trim();
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        if (!noteName) return; // 빈 입력 방지
        if (notes.includes(noteName)) {
            alert("This note already exists!");
            return;
        }

        notes.push(noteName);
        localStorage.setItem("notes", JSON.stringify(notes));
        newNoteModal.style.display = "none";
        newNoteName.value = "";
        loadNotes();
    });

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        document.querySelectorAll(".note-item").forEach(note => {
            const title = note.querySelector(".note-title").textContent.toLowerCase();
            note.style.display = title.includes(query) ? "flex" : "none";
        });
    });

    newNoteBtn.addEventListener("click", () => {
        newNoteModal.style.display = "flex";
    });

    newNoteModal.addEventListener("click", (e) => {
        if (e.target === newNoteModal || e.target === closeModalBtn) {
            newNoteModal.style.display = "none";
        }
    });
    newNoteName.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            createNoteBtn.click();
        }
    });

    loadNotes();
});
