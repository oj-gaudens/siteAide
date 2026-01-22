module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  const isProd = process.env.ELEVENTY_ENV === "production";
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    pathPrefix: isProd ? "/Site-Aide/" : "/"
  };
};
