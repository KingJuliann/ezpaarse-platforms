#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform PressReader
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/[a-z-]+\/(([^/]+)\/([0-9]{4})([0-9]{2})([0-9]{2}))(?:\/page\/[0-9]+)?(?:\/textview)?$/i.exec(path)) !== null) {
    // /usa/the-washington-post/20180906
    // /france/la-recherche/20171123/textview
    // /usa/forbes/20201001/page/56/textview
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];

    result.publication_date = `${match[3]}-${match[4]}-${match[5]}`;
  }

  return result;
});
