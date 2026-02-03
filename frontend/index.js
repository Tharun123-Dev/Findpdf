// ================= CONFIG =================
const BACKEND = "https://findpdf-3-z8us.onrender.com";
const API = BACKEND + "/api/";

// ================= AUTH CHECK =================
function checkAuth() {
    if (!localStorage.getItem("access")) {
        alert("Please login first");
        window.location.href = "login.html";
    }
}

// ================= SECURE FETCH =================
async function secureFetch(url, options = {}) {
    const token = localStorage.getItem("access");

    const headers = {
        ...(options.headers || {}),
        "Authorization": "Bearer " + token
    };

    let res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "login.html";
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
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        });
}

// ================= PDF =================
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
        alert("PDF uploaded. Waiting for admin approval.");
        e.target.reset();
    } else {
        alert(data.error || "Upload failed");
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
            <img src="${p.image_url}" onclick="openInNewTab('${p.file_url}')">
            <a href="${p.file_url}" target="_blank">Open PDF</a>
        </div>
    `).join("");
}

// ================= ROADMAP =================
let allRoadmaps = [];

document.getElementById("roadmapForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await secureFetch(API + "roadmaps/", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        alert("Roadmap uploaded. Waiting for admin approval.");
        e.target.reset();
    } else {
        alert(data.error || "Upload failed");
    }
});

async function loadRoadmaps() {
    const res = await secureFetch(API + "roadmaps/");
    if (!res.ok) return;

    allRoadmaps = await res.json();
    renderRoadmaps(allRoadmaps);
}

function renderRoadmaps(list) {
    document.getElementById("roadmapList").innerHTML = list.map(r => `
        <div class="item">
            <h3>${r.title}</h3>
            <img src="${r.image_url}" onclick="openInNewTab('${r.image_url}')">
        </div>
    `).join("");
}

// ================= INTERVIEW =================
let allInterviews = [];

document.getElementById("interviewForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await secureFetch(API + "interviews/", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        alert("Interview uploaded. Waiting for admin approval.");
        e.target.reset();
    } else {
        alert(data.error || "Upload failed");
    }
});

async function loadInterviews() {
    const res = await secureFetch(API + "interviews/");
    if (!res.ok) return;

    allInterviews = await res.json();
    renderInterviews(allInterviews);
}

function renderInterviews(list) {
    document.getElementById("interviewList").innerHTML = list.map(i => `
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
