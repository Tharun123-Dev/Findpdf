// ================= CONFIG =================
const BACKEND = "http://127.0.0.1:8000";
// const BACKEND = "https://findpdf-6-07u2.onrender.com";

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
const PAGE_SIZE = 12;

// PDFs
let pdfOffset = 0;

// Roadmaps
let roadmapOffset = 0;

// Interviews
let interviewOffset = 0;


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

    allPDFs.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );

    pdfOffset = PAGE_SIZE;
    renderPDFs(allPDFs.slice(0, pdfOffset));
}


function loadMorePDFs() {
    if (pdfOffset >= allPDFs.length) return;
    pdfOffset += PAGE_SIZE;
    renderPDFs(allPDFs.slice(0, pdfOffset));
}


document.getElementById("pdfScroll")?.addEventListener("scroll", e => {
    const box = e.target;
    if (box.scrollTop + box.clientHeight >= box.scrollHeight - 10) {
        loadMorePDFs();
    }
});



function renderPDFs(list) {
    const el = document.getElementById("pdfList");
    if (!el) return;

    el.innerHTML = list.map(p => `
        <div class="item">
            <h3>${p.title}</h3>

            <img src="${p.image_url}"
                 onclick="openPDF(${p.id}, '${p.file_url}')">

            <a onclick="openPDF(${p.id}, '${p.file_url}')">
                📖 Open PDF
            </a>

            <a onclick="downloadPDF(${p.id}, '${p.file_url}', '${p.title}')">
                📥 Download PDF
            </a>

            <div class="download-count">
                👁 ${p.view_count} views &nbsp;&nbsp;
                ⬇ ${p.download_count} downloads
            </div>
        </div>
    `).join("");
}

function openPDF(id, url) {
    secureFetch(API + `pdfs/${id}/view/`, { method: "POST" });
    openInNewTab(url);
}

function downloadPDF(id, url, title) {
    secureFetch(API + `pdfs/${id}/download/`, { method: "POST" });
    forceDownload(url, title + ".pdf");
}


function filterPDFs() {
    const text = document.getElementById("pdfSearch").value.toLowerCase().trim();

    let list = allPDFs;
    if (text) {
        list = allPDFs.filter(p => p.title.toLowerCase().includes(text));
    }

    list.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );

    pdfOffset = PAGE_SIZE;
    renderPDFs(list.slice(0, pdfOffset));
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

    allRoadmaps.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );

    roadmapOffset = PAGE_SIZE;
    renderRoadmaps(allRoadmaps.slice(0, roadmapOffset));
}

function loadMoreRoadmaps() {
    if (roadmapOffset >= allRoadmaps.length) return;
    roadmapOffset += PAGE_SIZE;
    renderRoadmaps(allRoadmaps.slice(0, roadmapOffset));
}

document.getElementById("roadmapScroll")?.addEventListener("scroll", e => {
    const box = e.target;
    if (box.scrollTop + box.clientHeight >= box.scrollHeight - 10) {
        loadMoreRoadmaps();
    }
});



function renderRoadmaps(list) {
    const el = document.getElementById("roadmapList");
    if (!el) return;

    el.innerHTML = list.map(r => `
        <div class="item">
            <h3>${r.title}</h3>

            <img src="${r.image_url}"
                 onclick="openRoadmap(${r.id}, '${r.image_url}')">

            <a onclick="openRoadmap(${r.id}, '${r.image_url}')">
                🗺 Open Roadmap
            </a>

            <a onclick="downloadRoadmap(${r.id}, '${r.image_url}', '${r.title}')">
                ⬇ Download Roadmap
            </a>

            <div class="download-count">
                👁 ${r.view_count} views &nbsp;&nbsp;
                ⬇ ${r.download_count} downloads
            </div>
        </div>
    `).join("");
}

function openRoadmap(id, url) {
    secureFetch(API + `roadmaps/${id}/view/`, { method: "POST" });
    openInNewTab(url);
}

function downloadRoadmap(id, url, title) {
    secureFetch(API + `roadmaps/${id}/download/`, { method: "POST" });
    forceDownload(url, title + ".png");
}

function filterRoadmaps() {
    const text = document.getElementById("roadmapSearch").value.toLowerCase().trim();

    let list = allRoadmaps;
    if (text) {
        list = allRoadmaps.filter(r =>
            r.title.toLowerCase().includes(text)
        );
    }

    roadmapOffset = PAGE_SIZE;
    renderRoadmaps(list.slice(0, roadmapOffset));
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

    allInterviews.sort((a, b) => {
        const c = a.company.localeCompare(b.company, undefined, { sensitivity: "base" });
        return c !== 0 ? c : a.role.localeCompare(b.role, undefined, { sensitivity: "base" });
    });

    interviewOffset = PAGE_SIZE;
    renderInterviews(allInterviews.slice(0, interviewOffset));
}

function loadMoreInterviews() {
    if (interviewOffset >= allInterviews.length) return;
    interviewOffset += PAGE_SIZE;
    renderInterviews(allInterviews.slice(0, interviewOffset));
}

document.getElementById("interviewScroll")?.addEventListener("scroll", e => {
    const box = e.target;
    if (box.scrollTop + box.clientHeight >= box.scrollHeight - 10) {
        loadMoreInterviews();
    }
});


function renderInterviews(list) {
    const el = document.getElementById("interviewList");
    if (!el) return;

    el.innerHTML = list.map(i => `
        <div class="item">
            <h3>${i.company}</h3>
            <p>${i.role}</p>

            <a onclick="openInterview(${i.id}, '${i.pdf_url}')">
                📖 Open PDF
            </a>

            <a onclick="downloadInterview(${i.id}, '${i.pdf_url}', '${i.company}_${i.role}')">
                ⬇ Download PDF
            </a>

            <div class="download-count">
                👁 ${i.view_count} views &nbsp;&nbsp;
                ⬇ ${i.download_count} downloads
            </div>
        </div>
    `).join("");
}


function openInterview(id, url) {
    secureFetch(API + `interviews/${id}/view/`, { method: "POST" });
    openInNewTab(url);
}

function downloadInterview(id, url, name) {
    secureFetch(API + `interviews/${id}/download/`, { method: "POST" });
    forceDownload(url, name + ".pdf");
}


function filterInterviews() {
    const text = document.getElementById("interviewSearch").value.toLowerCase().trim();

    let list = allInterviews;
    if (text) {
        list = allInterviews.filter(i =>
            i.company.toLowerCase().includes(text) ||
            i.role.toLowerCase().includes(text)
        );
    }

    interviewOffset = PAGE_SIZE;
    renderInterviews(list.slice(0, interviewOffset));
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
