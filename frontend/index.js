const BACKEND = "https://findpdf-c6cp.onrender.com";
const API = BACKEND + "/api/";

// ---------- PDF ----------
document.getElementById("pdfForm").onsubmit = async (f) => {
    f.preventDefault();
    const formData = new FormData(f.target);
    try {
        const res = await fetch(API + "pdfs/", { method: "POST", body: formData });
        if (res.ok) {
            f.target.reset();
            loadPDFs();
            alert("PDF uploaded successfully!");
        } else {
            alert("Error uploading PDF. Status: " + res.status);
        }
    } catch (error) {
        alert("Failed to upload PDF: " + error.message);
    }
};

let allPDFs = [];

async function loadPDFs() {
    try {
        const res = await fetch(API + "pdfs/");
        if (!res.ok) {
            console.error("Error loading PDFs:", res.status);
            return;
        }

        allPDFs = await res.json();   // store globally
        console.log("PDF DATA:", allPDFs);

        // SORT A → Z
        allPDFs = sortPDFsAlphabetically(allPDFs);
        

        renderPDFs(allPDFs);          // render all initially
    } catch (err) {
        console.error("PDF load failed:", err);
    }
}
function renderPDFs(pdfArray) {
    document.getElementById("pdfList").innerHTML = pdfArray.map(p => `
        <div class="item">
            <h3>${p.title}</h3>
            <img src="${p.image_url}" onclick="openImageInNewTab('${p.image_url}')">
            <a href="${p.file_url}" target="_blank">📥 Open PDF</a>
        </div>
    `).join("");
}
function filterPDFs() {
    const searchText = document
        .getElementById("pdfSearch")
        .value
        .toLowerCase();

    let filteredPDFs = allPDFs.filter(p =>
        p.title.toLowerCase().includes(searchText)
    );

    // SORT FILTERED RESULTS
    filteredPDFs = sortPDFsAlphabetically(filteredPDFs);

    renderPDFs(filteredPDFs);
}

function sortPDFsAlphabetically(pdfArray) {
    return pdfArray.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );
}


// ---------- ROADMAP ----------
// ---------- ROADMAP ----------
document.getElementById("roadmapForm").onsubmit = async (e) => {
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
            alert("Error uploading Roadmap. Status: " + res.status);
        }
    } catch (error) {
        alert("Failed to upload Roadmap: " + error.message);
    }
};

async function loadRoadmaps() {
    try {
        const res = await fetch(API + "roadmaps/");
        if (!res.ok) {
            console.error("Error loading roadmaps");
            return;
        }

        const data = await res.json();

        document.getElementById("roadmapList").innerHTML = data.map(r => `
            <div class="item">
                <h3>${r.title}</h3>
                <p>${r.description}</p>
                <img src="${r.image_url}" onclick="openImageInNewTab('${r.image_url}')">
            </div>
        `).join("");
    } catch (err) {
        console.error("Roadmap load failed:", err);
    }
}


// ---------- BACK TO TOP ----------
const backTop = document.getElementById("backTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) backTop.classList.add("show");
  else backTop.classList.remove("show");
});
backTop.onclick = () => window.scrollTo({ top:0, behavior:"smooth" });


function login(){
    window.location.href="login.html"
}
window.onload = () => {
    loadPDFs();
    loadRoadmaps();
};