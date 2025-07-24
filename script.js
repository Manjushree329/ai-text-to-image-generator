const key = "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"; 

const inputText = document.getElementById("input");
const image = document.getElementById("image");
const GenBtn = document.getElementById("btn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const ResetBtn = document.getElementById("reset");
const DownloadBtn = document.getElementById("download");

async function query(prompt) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("API Error:", error);
    alert("Failed to generate image. Please check your prompt, API key, or internet.");
    load.style.display = "none";
    svg.style.display = "block";
    return null;
  }
}

async function generate() {
  const prompt = inputText.value.trim();

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  svg.style.display = "none";
  image.style.display = "none";
  load.style.display = "block";

  const result = await query(prompt);

  if (result) {
    const objectUrl = URL.createObjectURL(result);
    image.src = objectUrl;
    image.style.display = "block";
    load.style.display = "none";

    DownloadBtn.onclick = () => {
      downloadImage(objectUrl);
    };
  }
}

function downloadImage(objectUrl) {
  fetch(objectUrl)
    .then(res => res.blob())
    .then(file => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = `image_${new Date().getTime()}.png`;
      a.click();
    })
    .catch(() => alert("Download failed. Please try again."));
}

// Event Listeners
GenBtn.addEventListener("click", generate);

inputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generate();
  }
});

ResetBtn.addEventListener("click", () => {
  inputText.value = "";
  image.src = "";
  image.style.display = "none";
  svg.style.display = "block";
});