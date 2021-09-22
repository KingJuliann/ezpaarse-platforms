#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Oxford Scholarship Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname.replace(/\$002f/g, '/');
  let match;

  if ((match = /^(?:\/mobile)?\/view\/(10\.[0-9]+)\/(((?:[a-z:]+\/)?[0-9]+)\.[0-9]+\.[0-9]+)\/[a-z]+-([0-9]+)(-chapter-[0-9]+)?$/i.exec(path)) !== null) {
    // http://www.oxfordscholarship.com/view/10.1093/0199242666.001.0001/acprof-9780199242665
    // http://www.oxfordscholarship.com/view/10.1093/0199242666.001.0001/acprof-9780199242665-chapter-1
    // http://www.oxfordscholarship.com/view/10.1093/acprof:oso/9780199575008.001.0001/acprof-9780199575008
    result.rtype            = match[5] ? 'BOOK_SECTION' : 'TOC';
    result.mime             = 'HTML';
    result.doi              = `${match[1]}/${match[2]}`;
    result.unitid           = match[2];
    result.title_id         = match[3];
    result.print_identifier = match[4];

    // if the size is less than 18ko, it's not the actual article
    if (result.rtype === 'BOOK_SECTION' && ec.size && ec.size < 18000) {
      result._granted = false;
    }
  } else if ((match = /^\/[a-z]+\/download[a-z.:]+\/\/?(10\.[0-9]+)\/(((?:[a-z:]+\/)?[0-9]+)\.[0-9]+\.[0-9]+)\/[a-z]+-([0-9]+)-chapter-[0-9]+\/.*/i.exec(path)) !== null) {
    /**
     * http://www.oxfordscholarship.com/oso/downloaddoclightbox.downloaddoc:download/$002f10.1093$002f0199242666.001.0001$002facprof-9780199242665-chapter-1/Introduction:$0020Abortion$002c$0020Women$0027s$0020Movements$002c$0020and
     * $0020Democratic$0020Politics?t:ac=$002f10.1093$002f0199242666.001.0001$002facprof-9780199242665-chapter-1/Introduction:$0020Abortion$002c$0020Women$0027s$0020Movements$002c$0020and$0020Democratic$0020Politics
     */
    result.rtype            = 'BOOK_SECTION';
    result.mime             = 'PDF';
    result.doi              = `${match[1]}/${match[2]}`;
    result.unitid           = match[2];
    result.title_id         = match[3];
    result.print_identifier = match[4];
  }

  return result;
});
