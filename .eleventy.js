// Filters
const dateFilter = require( './src/filters/date-filter.js' );
const w3DateFilter = require( './src/filters/w3-date-filter.js' );

// Eleventy config file
module.exports = config => {

  // Set directories to pass through to the /dist folder
  config.addPassthroughCopy( './src/images/' );

  // Add filters
  config.addFilter('dateFilter', dateFilter);

  config.addFilter('w3DateFilter', w3DateFilter);

  // Require sort-by-display-order utility function
  const sortByDisplayOrder = require( './src/utils/sort-by-display-order.js' );

  // Returns work items, sorted by display order
  config.addCollection( 'work', collection => {

    return sortByDisplayOrder( collection.getFilteredByGlob( './src/work/*.md' ) );

  });

  // Returns work items, sorted by display order then filtered by featured
  config.addCollection( 'featuredWork', collection => {

    return sortByDisplayOrder( collection.getFilteredByGlob( './src/work/*.md' ) ).filter(
      x => x.data.featured
    );

  });

  // Returns a collection of blog posts in reverse date order
  config.addCollection( 'blog', collection => {

    return [ ...collection.getFilteredByGlob( './src/posts/*.md' ) ].reverse();

  });

  return {

    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }

  };

};
