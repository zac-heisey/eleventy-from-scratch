const rssPlugin = require( '@11ty/eleventy-plugin-rss' );

// Filters
const dateFilter = require( './src/filters/date-filter.js' );
const w3DateFilter = require( './src/filters/w3-date-filter.js' );

// Transforms
const htmlMinTransform = require( './src/transforms/html-min-transform.js' );

// Create a helpful production flag
const isProduction = process.env.NODE_ENV === 'production';

// Eleventy config file
module.exports = config => {

  // Only minify HTML if we are in production because it slows builds _right_ down
  if ( isProduction ) {
    config.addTransform( 'htmlmin', htmlMinTransform );
  }

  // Add filters
  config.addFilter( 'dateFilter', dateFilter );

  config.addFilter( 'w3DateFilter', w3DateFilter );

  // Add plugins
  config.addPlugin( rssPlugin );

  // Require sort-by-display-order utility function
  const sortByDisplayOrder = require( './src/utils/sort-by-display-order.js' );

  // Work Collection (returns work items, sorted by display order)
  config.addCollection( 'work', collection => {

    return sortByDisplayOrder( collection.getFilteredByGlob( './src/work/*.md' ) );

  });

  // Featured Work Collection (returns work items, sorted by display order then filtered by featured)
  config.addCollection( 'featuredWork', collection => {

    return sortByDisplayOrder( collection.getFilteredByGlob( './src/work/*.md' ) ).filter(
      x => x.data.featured
    );

  });

  // Blog Post Collection (returns a list of blog posts in reverse date order)
  config.addCollection( 'blog', collection => {

    return [ ...collection.getFilteredByGlob( './src/posts/*.md' ) ].reverse();

  });

  // People Collection (returns a list of people ordered by filename)]
  config.addCollection( 'people', collection => {

    return collection.getFilteredByGlob( './src/people/*.md' ).sort( ( a, b ) => {
      return Number( a.fileSlug ) > Number( b.fileSlug ) ? 1 : -1;
    });

  });

  // Tell 11ty to use .eleventyignore instead of .gitignore
  config.setUseGitIgnore( false );

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
