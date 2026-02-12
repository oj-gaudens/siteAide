module.exports = function(eleventyConfig) {
  // Copier les assets statiques
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/js");
  
  // Ajouter un filtre pour le markdown
  eleventyConfig.addFilter("markdown", function(content) {
    const markdownIt = require("markdown-it")();
    return markdownIt.render(content);
  });
  
  return {
    // pathPrefix TOUJOURS /siteAide/ (en local ET sur GitHub)
    pathPrefix: "/siteAide/",
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};