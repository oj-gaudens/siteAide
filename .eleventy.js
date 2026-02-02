module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets"); // CSS, JS, images

  return {
    dir: {
      input: "src",          // dossier source
      includes: "_includes", // dossiers pour layouts
      output: "docs"
    }
  };
};
