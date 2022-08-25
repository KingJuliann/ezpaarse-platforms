#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Ovid
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  //var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  //console.error(path);
  //console.error(param);

  //var match;
  if (typeof param['Link Set'] != 'undefined' && param['Link Set'] !== '' && param['Counter5Data'] == null) {
    // http://ovidsp.tx.ovid.com/sp-3.15.0a/ovidweb.cgi?&S=NKDIFPLLDDDDHPEINCKKEDDCPAJLAA00&Link+Set=S.sh.29.30.34.48%7c1%7csl_10
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param['Link Set'];
  } else if (typeof param.pdf_index != 'undefined' && param.pdf_index !== '') {
    // http://ovidsp.tx.ovid.com/sp-3.15.0a/ovidweb.cgi?WebLinkFrameset=1&S=NKDIFPLLDDDDHPEINCKKEDDCPAJLAA00&returnUrl=ovidweb.cgi%3f%26Full%2bText%3dL%257cS.sh.29.30.34.48.54%257c0%257c00007890-200512270-00001%26S%3dNKDIFPLLDDDDHPEINCKKEDDCPAJLAA00&directlink=http%3a%2f%2fgraphics.tx.ovid.com%2fovftpdfs%2fFPDDNCDCEDEIDD00%2ffs047%2fovft%2flive%2fgv031%2f00007890%2f00007890-200512270-00001.pdf&filename=The+Role+of+Macrophages+in+Allograft+Rejection.&pdf_key=FPDDNCDCEDEIDD00&pdf_index=/fs047/ovft/live/gv031/00007890/00007890-200512270-00001&D=ovft
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.pdf_index;
  } else if (typeof param.Abstract !== 'undefined' &&  param.Abstract !== '') {
    // http://ovidsp.tx.ovid.com/sp-3.15.0a/ovidweb.cgi?&S=NKDIFPLLDDDDHPEINCKKEDDCPAJLAA00&WebLinkReturn=Full+Text%3dL%7cS.sh.29.30.34.48.54%7c0%7c00007890-200512270-00001&Abstract=S.sh.29.30.34.48%7c1%7c1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = param.Abstract;
  } else if (typeof param['Complete Reference'] !== 'undefined' && param['Complete Reference'] !== '') {
    // http://ovidsp.tx.ovid.com/sp-3.15.0a/ovidweb.cgi?&S=NKDIFPLLDDDDHPEINCKKEDDCPAJLAA00&Complete+Reference=S.sh.29.30.34.48%7c1%7c1
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = param['Complete Reference'];
  } else if ((typeof param['Book Reader'] !== 'undefined' && param['Book Reader'] !== '') || param['Counter5Data'].includes('books')) {
    // http://ovidsp.dc2.ovid.com/ovid-b/ovidweb.cgi?&S=KAPNFPIOAMEBOCHIJPAKBGHGICALAA00&Link+Set=S.sh.46%7c1%7csl_10&Counter5=SS_view_found_article%7c02191022%2f29th_Edition%2f4%7cbooks%7cbookdb%7cbooks1&Counter5Data=02191022%2f29th_Edition%2f4%7cbooks%7cbookdb%7cbooks1
    // http://ovidsp.dc2.ovid.com/ovid-b/ovidweb.cgi?&S=KKDIFPIOAMEBOCBGJPAKEGHGOEGIAA00&Book+Reader=1&FTS+Book+Reader+Content=S.sh.32104_1607538556_70.32104_1607538556_82.32104_1607538556_90%7c19%7c%2fbookdb%2f01838292%2f2nd_Edition%2f3%2fPG%280%29
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    if (param['FTS Book Reader Content']) {
      result.unitid   = param['FTS Book Reader Content'];
    } else {
      result.unitid   = param['Link Set'];
    }
  }

  return result;
});

