module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets"); // Copie CSS et JS
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "templates",
    }
  };
};
