// ---------- Footer year ----------
const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---------- Toggle password visibility ----------
const toggleButtons = document.querySelectorAll(".toggle-password");

function handleTogglePassword(event) {
  const button = event.currentTarget;
  const targetId = button.getAttribute("data-target");
  const input = document.getElementById(targetId);

  if (input.type === "password") {
    input.type = "text";
    button.setAttribute("aria-label", "Hide password");
  } else {
    input.type = "password";
    button.setAttribute("aria-label", "Show password");
  }
}

toggleButtons.forEach((button) => {
  button.addEventListener("click", handleTogglePassword);
});

// ---------- Nav link hover highlight ----------
const navLinks = document.querySelectorAll(".nav-links a");

function highlightLink(event) {
  event.currentTarget.style.color = "#f4f4f5";
}

function resetLink(event) {
  event.currentTarget.style.color = "";
}

navLinks.forEach((link) => {
  link.addEventListener("mouseover", highlightLink);
  link.addEventListener("mouseout", resetLink);
});

// ---------- Theme toggle (Local Storage) ----------
const themeToggle = document.querySelector("#themeToggle");

const applyTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
};

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

// ---------- Session draft for register form ----------
const registerForm = document.querySelector("#registerForm");
const draftFields = ["name", "email"];

if (registerForm) {
  draftFields.forEach((fieldId) => {
    const savedValue = sessionStorage.getItem(`draft_${fieldId}`);
    const input = document.getElementById(fieldId);
    if (savedValue && input) {
      input.value = savedValue;
    }
  });

  draftFields.forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener("input", (e) => {
        sessionStorage.setItem(`draft_${fieldId}`, e.target.value);
      });
    }
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    draftFields.forEach((fieldId) => {
      sessionStorage.removeItem(`draft_${fieldId}`);
    });
    // actual register API call goes here
  });
}

// ---------- IndexedDB demo ----------
const DB_NAME = "ResumeFlowDB";
const DB_VERSION = 1;
const STORE_NAME = "notes";

let db;

const openDatabase = () => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log("IndexedDB opened successfully");
  };

  request.onerror = (event) => {
    console.log("IndexedDB error:", event.target.error);
  };
};

const addNote = (note) => {
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.add({ id: Date.now(), ...note });
};

const getAllNotes = (callback) => {
  const transaction = db.transaction([STORE_NAME], "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();
  request.onsuccess = () => callback(request.result);
};

const deleteNote = (id) => {
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.delete(id);
};

openDatabase();

// ---------- Notes UI wired to IndexedDB ----------
const noteForm = document.querySelector("#noteForm");
const noteInput = document.querySelector("#noteInput");
const notesList = document.querySelector("#notesList");

const renderNotes = () => {
  getAllNotes((notes) => {
    notesList.innerHTML = "";
    notes.forEach((note) => {
      const li = document.createElement("li");
      li.textContent = note.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        deleteNote(note.id);
        setTimeout(renderNotes, 100);
      });

      li.appendChild(deleteBtn);
      notesList.appendChild(li);
    });
  });
};

if (noteForm) {
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNote({ title: noteInput.value });
    noteInput.value = "";
    setTimeout(renderNotes, 100);
  });

  setTimeout(renderNotes, 300);
}