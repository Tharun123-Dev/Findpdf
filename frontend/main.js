// ================= CONFIG =================
const BACKEND = "http://127.0.0.1:8000";
// const BACKEND = " https://findpdf-5-z3yx.onrender.com";

const API = BACKEND + "/api/";

// ================= AUTH CHECK =================
function checkAuth() {
    const token = localStorage.getItem("access");
    if (!token) {
        alert("Please login first");
        window.location.href = "index.html";
    }
}

// ================= SECURE FETCH =================
async function secureFetch(url, options = {}) {
    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "index.html";
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
        window.location.href = "index.html";
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

    // ✅ A → Z sort
    allPDFs.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );

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
function filterPDFs() {
    const text = document.getElementById("pdfSearch").value.toLowerCase().trim();

    let list = allPDFs;

    if (text !== "") {
        list = allPDFs.filter(p =>
            p.title.toLowerCase().includes(text)
        );
    }

    // ✅ Keep alphabetical order
    list.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );

    renderPDFs(list.slice(0, PDF_LIMIT));
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

    // ✅ A → Z
    allRoadmaps.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );

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
function filterRoadmaps() {
    const text = document.getElementById("roadmapSearch").value.toLowerCase().trim();

    let list = allRoadmaps;

    if (text !== "") {
        list = allRoadmaps.filter(r =>
            r.title.toLowerCase().includes(text)
        );
    }

    // ✅ Alphabetical
    list.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );

    renderRoadmaps(list.slice(0, ROADMAP_LIMIT));
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

    // ✅ Sort by company, then role
    allInterviews.sort((a, b) => {
        const c = a.company.localeCompare(b.company, undefined, { sensitivity: "base" });
        return c !== 0 ? c : a.role.localeCompare(b.role, undefined, { sensitivity: "base" });
    });

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
function filterInterviews() {
    const text = document.getElementById("interviewSearch").value.toLowerCase().trim();

    let list = allInterviews;

    if (text !== "") {
        list = allInterviews.filter(i =>
            i.company.toLowerCase().includes(text) ||
            i.role.toLowerCase().includes(text)
        );
    }

    // ✅ Alphabetical (company → role)
    list.sort((a, b) => {
        const c = a.company.localeCompare(b.company, undefined, { sensitivity: "base" });
        return c !== 0 ? c : a.role.localeCompare(b.role, undefined, { sensitivity: "base" });
    });

    renderInterviews(list.slice(0, INTERVIEW_LIMIT));
}

// ================= LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ================= INIT =================
window.addEventListener("load", () => {
    checkAuth();
    loadPDFs();
    loadRoadmaps();
    loadInterviews();
});
