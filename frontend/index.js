// ================= CONFIG =================
const BACKEND =  " http://127.0.0.1:8000/";
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

        const data = await res.json();

        if (res.ok) {
            e.target.reset();
            alert("✅ PDF uploaded successfully.\n⏳ Waiting for admin approval.");
        } else {
            alert(data.error || "PDF upload failed");
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
                 onclick="incrementView('${API}pdfs/${p.id}/view/'); window.open('${p.file_url}','_blank')">

            <a href="${p.file_url}" target="_blank"
               onclick="incrementView('${API}pdfs/${p.id}/view/')">
                📖 Open PDF
            </a>

            <a href="${p.file_url}" download>
                ⬇️ Download PDF
            </a>

            <p class="views">👁️ ${p.view_count} views</p>
            <p class="downloads">⬇️ ${p.download_count} downloads</p>
        </div>
    `).join("");
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

        const data = await res.json();

        if (res.ok) {
            e.target.reset();
            alert("✅ Roadmap uploaded.\n⏳ Waiting for admin approval.");
        } else {
            alert(data.error || "Roadmap upload failed");
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
                 onclick="incrementView('${API}roadmaps/${r.id}/view/'); window.open('${r.image_url}','_blank')">

            <a href="${r.image_url}" target="_blank"
               onclick="incrementView('${API}roadmaps/${r.id}/view/')">
                🗺️ Open Roadmap
            </a>

            <a href="${r.image_url}" download>
                ⬇️ Download Roadmap
            </a>

            <p class="views">👁️ ${r.view_count} views</p>
            <p class="downloads">⬇️ ${r.download_count} downloads</p>
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

// Roadmap download with count

async function downloadRoadmap(id, title) {
    const res = await fetch(API + `roadmaps/${id}/download/`, { method: "POST" });
    if (!res.ok) return alert("Download failed");

    const data = await res.json();
    forceDownload(data.url, `${title}.png`);

    loadRoadmaps(); // refresh count
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
        alert("Interview PDF uploaded successfully! and wait for admin approval");
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

            <a href="${i.pdf_url}" target="_blank"
               onclick="incrementView('${API}interviews/${i.id}/view/')">
                📖 Open PDF
            </a>

            <a href="${i.pdf_url}" download>
                ⬇️ Download PDF
            </a>

            <p class="views">👁️ ${i.view_count} views</p>
            <p class="downloads">⬇️ ${i.download_count} downloads</p>
        </div>
    `).join("");
}



// Interview PDF download with count

async function downloadInterview(id, company, role) {
    const res = await fetch(API + `interviews/${id}/download/`, { method: "POST" });
    if (!res.ok) return alert("Download failed");

    const data = await res.json();
    forceDownload(data.url, `${company}-${role}.pdf`);

    loadInterviews(); // refresh count
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


async function incrementView(url) {
    try {
        await fetch(url, { method: "POST" });
    } catch (e) {
        console.error("View count error", e);
    }
}
