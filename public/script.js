// Fetch the directory structure and populate the UI
async function fetchDirectoryTree() {
  const res = await fetch("/directories");
  const tree = await res.json();
  const directoryTree = document.getElementById("directoryTree");
  const folderSelect = document.getElementById("folderSelect");

  directoryTree.innerHTML = "";
  folderSelect.innerHTML = '<option value="/">Root</option>';

  function createTree(parent, structure, path = "/") {
    Object.entries(structure).forEach(([key, value]) => {
      if (typeof value === "object") {
        // Folder
        const folderDiv = document.createElement("div");
        folderDiv.classList.add("folder");
        folderDiv.textContent = `📁 ${key}`;
        parent.appendChild(folderDiv);

        folderSelect.innerHTML += `<option value="${path + key}/">${
          path + key
        }</option>`;

        createTree(folderDiv, value, `${path + key}/`);
      } else {
        // File
        const fileDiv = document.createElement("div");
        fileDiv.classList.add("file");
        fileDiv.textContent = `🎵 ${value}`;
        fileDiv.onclick = () => playSong(`${path + value}`);
        parent.appendChild(fileDiv);
      }
    });
  }

  createTree(directoryTree, tree);
}

// Play a selected song
function playSong(filePath) {
  const audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.src = `/songs/${filePath}`;
  audioPlayer.play();
}

// Create a new folder
document
  .getElementById("directoryForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const folderName = document.getElementById("newFolderName").value.trim();
    if (!folderName) return alert("Please enter a folder name.");

    const res = await fetch("/directories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderName }),
    });

    if (res.ok) {
      alert("Folder created successfully!");
      fetchDirectoryTree();
    } else {
      alert("Failed to create folder.");
    }
  });

// Upload songs
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const folderPath = document.getElementById("folderSelect").value;
  const fileInput = document.getElementById("songUpload");
  const formData = new FormData();
  for (let file of fileInput.files) {
    formData.append("songs", file);
  }

  const res = await fetch(`/upload?folder=${encodeURIComponent(folderPath)}`, {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    alert("Songs uploaded successfully!");
    fetchDirectoryTree();
  } else {
    alert("Failed to upload songs.");
  }
});

// Initialize theme toggle button
document.getElementById("themeToggle").addEventListener("click", () => {
  const body = document.body;

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    document.getElementById("themeToggle").textContent = "☀️";
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    document.getElementById("themeToggle").textContent = "🌙";
  }
});

// Fetch directory tree on page load
fetchDirectoryTree();
