const content = document.getElementById("content");

function loadContent(file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(raw => {
      // Process custom blocks before rendering
      let formatted = raw;

      // Wrap EXAMPLE blocks
      formatted = formatted.replace(/### EXAMPLE ###\n([\s\S]*?)### END EXAMPLE ###/g, (_, exampleText) => {
        const inner = marked.parse(exampleText);
        return `<div class="example"><strong>💡 Example</strong>${inner}</div>`;
      });

      // Wrap WARNING blocks
      formatted = formatted.replace(/### WARNING ###\n([\s\S]*?)### END WARNING ###/g, (_, warningText) => {
        const inner = marked.parse(warningText);
        return `<div class="warning"><strong>⚠️ Common Pitfalls to Avoid</strong>${inner}</div>`;
      });

      // Final Markdown parse
        if (file.endsWith(".html")) {
         content.innerHTML = formatted; // already HTML
        } else {
         content.innerHTML = marked.parse(formatted); // parse Markdown
        }
        bindCritiqueIfNeeded(file);
  })
    .catch(error => {
    content.innerText = "Error loading content.";
    console.error("Fetch error:", error);
  });
  }

// Global navigation handler — works for all nav and subnav elements
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-file]");
  if (target) {
    const file = target.getAttribute("data-file");
    if (file) {
      loadContent(`content/${file}`);
    }
  }
});
// Automatically load the welcome page on first load
loadContent("content/welcome.txt");

function toggleCorrection(id) {
  const element = document.getElementById(id);
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

// Append this inside your `loadContent()` function, after content is inserted
function bindCritiqueIfNeeded(file) {
  if (file.includes("Participants")) {
    const feedback = [
      {
        issue: "Unclear and unnecessarily repetitive",
        explanation: "The sentence repeats 'first year psychology' unnecessarily and doesn't state the initial sample size (180) or mention compensation (course credit).",
        correction: "We recruited 180 first-year undergraduate students through the University of Queensland's SONA participant pool. Participants received course credit for taking part in the study."
      },
      {
        issue: "Poor ordering of information and grammatical errors",
        explanation: "The sentence prematurely details excluded participants before the nature of the sample has been adequately described. It also contains grammatical errors ('answer' should be 'answering') and includes unnecessary details about specific attention check instructions.",
        correction: "Twenty-seven participants were excluded from analyses for failing one or more of the three embedded attention checks."
      },
      {
        issue: "Excessive detail about recruitment planning",
        explanation: "Details about initial recruitment targets and anticipated attrition belong in a pre-registration document, not the methods section of a final report. Mentioning specific attrition concerns distracts from the actual study design.",
        correction: "Note: This information can be removed entirely."
      },
      {
        issue: "Awkward phrasing and unnecessary detail",
        explanation: "The phrase 'final sample resulted in' is awkward. Additionally, reporting detailed breakdowns of gender categories with zero participants is unnecessarily verbose—simply reporting the predominant gender composition is sufficient.",
        correction: "The final sample consisted of 153 participants (77.1% female), with ages ranging from 18 to 24 years (M = 18.96, SD = 1.29)."
      },
      {
        issue: "Redundant as a standalone sentence",
        explanation: "This information is better combined with the previous demographic information rather than presented as a separate sentence, as it creates unnecessary fragmentation of related information.",
        correction: "Combine with the previous sentence."
      },
      {
        issue: "Poor justification and excessive citation",
        explanation: "While it's good to justify inclusion criteria, the explanation here presents no meaningful reason for why this age range was fit for purpose.",
        correction: "Given our interest in career decision-making, eligible participants were young adults aged 18–25 years, for whom career choices are most critical."
      }
    ];

    const critiqueBox = document.getElementById("critique-box");
    const sentences = document.querySelectorAll(".critique-sentence");

    sentences.forEach(sentence => {
      sentence.addEventListener("click", () => {
        const i = sentence.getAttribute("data-index");
        const fb = feedback[i];
        critiqueBox.innerHTML = `
          <strong>Issue:</strong> ${fb.issue}<br>
          <strong>Explanation:</strong> ${fb.explanation}<br>
          <strong>Suggested Correction:</strong> ${fb.correction}
        `;
        critiqueBox.style.display = "block";
      });
    });
  }
}
function showCorrectedVersion() {
  const box = document.getElementById("corrected-paragraph");
  if (box) {
    box.style.display = "block";
    box.scrollIntoView({ behavior: "smooth" });
  }
}