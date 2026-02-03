// ================= CONFIG =================
const BACKEND = "https://findpdf-3-z8us.onrender.com";
const API = BACKEND + "/api/";

// ================= AUTH CHECK =================
async function checkAuth() {
    const res = await fetch(API + "pdfs/", {
        credentials: "include"
    });

    if (res.status === 401) {
        alert("Please login first");
        window.location.href = "login.html";
    }
}

// ================= HELPERS =================
function openInNewTab(url) {
    window.open(url, "_blank");
}

function forceDownload(url, filename) {
    fetch(url, { credentials: "include" })
        .then(res => res.blob())
        .then(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        })
        .catch(err => console.error("Download failed:", err));
}

// ================= SECURE FETCH =================
async function secureFetch(url, options = {}) {
    return fetch(url, {
        ...options,
        credentials: "include"
    });
}

// ================= PDF SECTION =================
let allPDFs = [];
const PDF_LIMIT = 12;

document.getElementById("pdfForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await secureFetch(API + "pdfs/", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        e.target.reset();
        alert("✅ PDF uploaded. Waiting for admin approval.");
    } else {
        alert(data.error || "PDF upload failed");
    }
});

async function loadPDFs() {
    const res = await secureFetch(API + "pdfs/");
    if (!res.ok) return;

    allPDFs = await res.json();
    renderPDFs(allPDFs.slice(0, PDF_LIMIT));
}

function renderPDFs(list) {
    document.getElementById("pdfList").innerHTML = list.map(p => `
        <div class="item">
            <h3>${p.title}</h3>
            <img src="${p.image_url}" onclick="window.open('${p.file_url}')">
            <a href="${p.file_url}" target="_blank">📖 Open PDF</a>
            <a href="${p.file_url}" download>⬇️ Download</a>
        </div>
    `).join("");
}

// ================= ROADMAP =================
let allRoadmaps = [];
const ROADMAP_LIMIT = 12;

document.getElementById("roadmapForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await secureFetch(API + "roadmaps/", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        e.target.reset();
        alert("✅ Roadmap uploaded. Waiting for admin approval.");
    } else {
        alert(data.error || "Upload failed");
    }
});

async function loadRoadmaps() {
    const res = await secureFetch(API + "roadmaps/");
    if (!res.ok) return;

    allRoadmaps = await res.json();
    renderRoadmaps(allRoadmaps.slice(0, ROADMAP_LIMIT));
}

function renderRoadmaps(list) {
    document.getElementById("roadmapList").innerHTML = list.map(r => `
        <div class="item">
            <h3>${r.title}</h3>
            <img src="${r.image_url}" onclick="window.open('${r.image_url}')">
            <a href="${r.image_url}" target="_blank">🗺️ Open</a>
        </div>
    `).join("");
}

// ================= INTERVIEW =================
let allInterviews = [];
const INTERVIEW_LIMIT = 12;

document.getElementById("interviewForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await secureFetch(API + "interviews/", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        e.target.reset();
        alert("Interview uploaded. Waiting for admin approval.");
    } else {
        alert(data.error || "Upload failed");
    }
});

async function loadInterviews() {
    const res = await secureFetch(API + "interviews/");
    if (!res.ok) return;

    allInterviews = await res.json();
    renderInterviews(allInterviews.slice(0, INTERVIEW_LIMIT));
}

function renderInterviews(list) {
    document.getElementById("interviewList").innerHTML = list.map(i => `
        <div class="item">
            <h3>${i.company}</h3>
            <p>${i.role}</p>
            <a href="${i.pdf_url}" target="_blank">📖 Open</a>
        </div>
    `).join("");
}

// ================= LOGOUT =================
async function logout() {
    await fetch(API + "logout/", { credentials: "include" });
    window.location.href = "login.html";
}

// ================= INIT =================
window.addEventListener("load", async () => {
    await checkAuth();
    loadPDFs();
    loadRoadmaps();
    loadInterviews();
});
