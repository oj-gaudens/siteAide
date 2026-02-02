document.addEventListener("DOMContentLoaded", () => {

  marked.setOptions({ gfm: true, breaks: true });

  const textarea = document.getElementById("markdown-input");
  const preview = document.getElementById("preview");
  const templateSelector = document.getElementById("template-selector");
  const themeSelector = document.getElementById("theme-selector");

  let currentSlide = 0;

  function parseCustomBlocks(md) {
    let blocks = [];

    const regex = /(^|\n)[ \t]*\/\/\/[ \t]*alert[ \t]*\|[ \t]*(.+?)[ \t]*\n([\s\S]*?)[ \t]*\/\/\/(?=\n|$)/g;

    md = md.replace(regex, (match, start, title, content) => {
      const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

      const html = `
<div class="fr-alert fr-alert--info">
  <h5 class="fr-alert__title" id="${slug}">${title.trim()}</h5>
  ${marked.parse(content.trim())}
</div>`;

      blocks.push(html);
      return `${start}%%ALERT_BLOCK_${blocks.length - 1}%%`;
    });

    return { md, blocks };
  }

  function injectBlocks(html, blocks) {
    blocks.forEach((block, i) => {
      html = html.replaceAll(`%%ALERT_BLOCK_${i}%%`, block);
    });
    return html;
  }

  function updatePreview() {
    const parsed = parseCustomBlocks(textarea.value);
    let html = marked.parse(parsed.md);
    html = injectBlocks(html, parsed.blocks);
    preview.innerHTML = html;
  }

  textarea.addEventListener("input", updatePreview);
  updatePreview();
});
