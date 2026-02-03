// ================= CONFIG =================
const BACKEND = "http://127.0.0.1:8000";
const API = BACKEND + "/api/";

// ================= AUTH CHECK =================
function checkAuth() {
    const token = localStorage.getItem("access");
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
    }
}

// ================= SECURE FETCH =================
async function secureFetch(url, options = {}) {
    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const headers = {
        ...(options.headers || {}),
        "Authorization": "Bearer " + token
    };

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    return res;
}

// ================= HELPERS =================
function openInNewTab(url) {
    window.open(url, "_blank");
}

function forceDownload(url, filename) {
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename || "download";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        });
}

// ================= LIMITS =================
const PDF_LIMIT = 12;
const ROADMAP_LIMIT = 12;
const INTERVIEW_LIMIT = 12;

// ================= PDF =================
let allPDFs = [];

const pdfForm = document.getElementById("pdfForm");
if (pdfForm) {
    pdfForm.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(pdfForm);

        const res = await secureFetch(API + "pdfs/", {
            method: "POST",
            body: formData
        });

        if (!res) return;

        const data = await res.json();

        if (res.ok) {
            alert("PDF uploaded. Waiting for admin approval.");
            pdfForm.reset();
            loadPDFs();
        } else {
            alert(data.error || "Upload failed");
        }
    });
}

async function loadPDFs() {
    const res = await secureFetch(API + "pdfs/");
    if (!res) return;

    allPDFs = await res.json();
    renderPDFs(allPDFs.slice(0, PDF_LIMIT));
}

function renderPDFs(list) {
    const el = document.getElementById("pdfList");
    if (!el) return;

    el.innerHTML = list.map(p => `
        <div class="item">
            <h3>${p.title}</h3>
            <img src="${p.image_url}" onclick="openInNewTab('${p.file_url}')">
            <a href="${p.file_url}" target="_blank">Open PDF</a>
        </div>
    `).join("");
}

// ================= ROADMAP =================
let allRoadmaps = [];

const roadmapForm = document.getElementById("roadmapForm");
if (roadmapForm) {
    roadmapForm.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(roadmapForm);

        const res = await secureFetch(API + "roadmaps/", {
            method: "POST",
            body: formData
        });

        if (!res) return;

        const data = await res.json();

        if (res.ok) {
            alert("Roadmap uploaded. Waiting for admin approval.");
            roadmapForm.reset();
            loadRoadmaps();
        } else {
            alert(data.error || "Upload failed");
        }
    });
}

async function loadRoadmaps() {
    const res = await secureFetch(API + "roadmaps/");
    if (!res) return;

    allRoadmaps = await res.json();
    renderRoadmaps(allRoadmaps.slice(0, ROADMAP_LIMIT));
}

function renderRoadmaps(list) {
    const el = document.getElementById("roadmapList");
    if (!el) return;

    el.innerHTML = list.map(r => `
        <div class="item">
            <h3>${r.title}</h3>
            <img src="${r.image_url}" onclick="openInNewTab('${r.image_url}')">
        </div>
    `).join("");
}

// ================= INTERVIEW =================
let allInterviews = [];

const interviewForm = document.getElementById("interviewForm");
if (interviewForm) {
    interviewForm.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(interviewForm);

        const res = await secureFetch(API + "interviews/", {
            method: "POST",
            body: formData
        });

        if (!res) return;

        const data = await res.json();

        if (res.ok) {
            alert("Interview uploaded. Waiting for admin approval.");
            interviewForm.reset();
            loadInterviews();
        } else {
            alert(data.error || "Upload failed");
        }
    });
}

async function loadInterviews() {
    const res = await secureFetch(API + "interviews/");
    if (!res) return;

    allInterviews = await res.json();
    renderInterviews(allInterviews.slice(0, INTERVIEW_LIMIT));
}

function renderInterviews(list) {
    const el = document.getElementById("interviewList");
    if (!el) return;

    el.innerHTML = list.map(i => `
        <div class="item">
            <h3>${i.company}</h3>
            <p>${i.role}</p>
            <a href="${i.pdf_url}" target="_blank">Open</a>
        </div>
    `).join("");
}

// ================= LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// ================= INIT =================
window.addEventListener("load", () => {
    checkAuth();
    loadPDFs();
    loadRoadmaps();
    loadInterviews();
});
