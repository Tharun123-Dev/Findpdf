// ================= CONFIG =================
const BACKEND = "https://findpdf-c6cp.onrender.com";
const API = BACKEND + "/api/";

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
        })
        .catch(err => console.error("Download failed:", err));
}

// ================= PDF SECTION =================
let allPDFs = [];
const PDF_LIMIT = 12;

// Upload PDF
document.getElementById("pdfForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const res = await fetch(API + "pdfs/", {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            e.target.reset();
            loadPDFs();
            alert("PDF uploaded successfully!");
        } else {
            alert("PDF upload failed");
        }
    } catch (err) {
        alert("Upload error: " + err.message);
    }
});

// Load PDFs
async function loadPDFs() {
    try {
        const res = await fetch(API + "pdfs/");
        if (!res.ok) return;

        allPDFs = await res.json();

        // Sort A → Z
        allPDFs.sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );

        renderPDFs(allPDFs.slice(0, PDF_LIMIT));
    } catch (err) {
        console.error("PDF load failed:", err);
    }
}

// Render PDFs
function renderPDFs(list) {
    document.getElementById("pdfList").innerHTML = list.map(p => `
        <div class="item">
            <h3>${p.title}</h3>

            <img src="${p.image_url}"
                 onclick="openInNewTab('${p.image_url}')">

            <a href="${p.file_url}" target="_blank">📖 Open PDF</a>

            <a onclick="forceDownload('${p.file_url}', '${p.title}.pdf')">
                📥 Download PDF
            </a>
        </div>
    `).join("");
}

// Search PDFs
function filterPDFs() {
    const text = document.getElementById("pdfSearch").value.toLowerCase().trim();

    if (text === "") {
        renderPDFs(allPDFs.slice(0, PDF_LIMIT));
        return;
    }

    const filtered = allPDFs.filter(p =>
        p.title.toLowerCase().includes(text)
    );

    renderPDFs(filtered);
}

// ================= ROADMAP SECTION =================
let allRoadmaps = [];
const ROADMAP_LIMIT = 12;

// Upload Roadmap
document.getElementById("roadmapForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const res = await fetch(API + "roadmaps/", {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            e.target.reset();
            loadRoadmaps();
            alert("Roadmap uploaded successfully!");
        } else {
            alert("Roadmap upload failed");
        }
    } catch (err) {
        alert("Upload error: " + err.message);
    }
});

// Load Roadmaps
async function loadRoadmaps() {
    try {
        const res = await fetch(API + "roadmaps/");
        if (!res.ok) return;

        allRoadmaps = await res.json();

        // Sort A → Z
        allRoadmaps.sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );

        renderRoadmaps(allRoadmaps.slice(0, ROADMAP_LIMIT));
    } catch (err) {
        console.error("Roadmap load failed:", err);
    }
}

// Render Roadmaps
function renderRoadmaps(list) {
    document.getElementById("roadmapList").innerHTML = list.map(r => `
        <div class="item">
            <h3>${r.title}</h3>
            <p>${r.description}</p>

            <img src="${r.image_url}"
                 onclick="openInNewTab('${r.image_url}')">

            <a onclick="forceDownload('${r.image_url}', '${r.title}.png')">
                📥 Download Roadmap
            </a>
        </div>
    `).join("");
}

// Search Roadmaps
function filterRoadmaps() {
    const text = document.getElementById("roadmapSearch").value.toLowerCase().trim();

    if (text === "") {
        renderRoadmaps(allRoadmaps.slice(0, ROADMAP_LIMIT));
        return;
    }

    const filtered = allRoadmaps.filter(r =>
        r.title.toLowerCase().includes(text)
    );

    renderRoadmaps(filtered);
}

// ================= INTERVIEW =================
let allInterviews = [];
const INTERVIEW_LIMIT = 12;

document.getElementById("interviewForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const res = await fetch(API + "interviews/", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            console.error("Upload error:", err);
            alert("Interview upload failed");
            return;
        }

        e.target.reset();
        loadInterviews();
        alert("Interview PDF uploaded successfully!");
    } catch (err) {
        console.error(err);
        alert("Network error");
    }
});

async function loadInterviews() {
    const res = await fetch(API + "interviews/");
    if (!res.ok) return;

    allInterviews = await res.json();

    renderInterviews(allInterviews.slice(0, INTERVIEW_LIMIT));
}

function renderInterviews(list) {
    document.getElementById("interviewList").innerHTML = list.map(i => `
        <div class="item">
            <h3>${i.company}</h3>
            <p>${i.role}</p>
            <a href="${i.pdf_url}" target="_blank">📖 Open PDF</a>
        </div>
    `).join("");
}




// ================= BACK TO TOP =================
const backTop = document.getElementById("backTop");
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) backTop?.classList.add("show");
    else backTop?.classList.remove("show");
});
backTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
);

// ================= AUTH =================
function login() {
    window.location.href = "login.html";
}
function logout() {
    window.location.href = "login.html";
}

// ================= INIT =================
window.addEventListener("load", () => {
    loadPDFs();
    loadRoadmaps();
    loadInterviews();
});
