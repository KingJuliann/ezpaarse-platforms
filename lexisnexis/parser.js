#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param = parsedUrl.query || {};
  var path  = parsedUrl.pathname;

  if (/\/droit\/results\/docview\/docview/.test(path)) {
    // http://www.lexisnexis.com/fr/droit/results/docview/docview.do?docLinkInd=true
    // &risb=21_T17183418923&format=GNBFULL&sort=DATE-PUBLICATION,D,H,$PSEUDOXAB,A,H,TYPE-ARTICLE,A,H
    // &startDocNo=1&resultsUrlKey=29_T17183418941&cisb=22_T17183418938&treeMax=true&treeWidth=0&csi=294776&docNo=3
    if (param['risb']) {
      result.title_id = param['risb'];
      result.unitid = param['risb'];
    }
    if (param['format']) {
      switch (param['format']) {
      case 'GNBFULL':
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
        break;
      case 'AUTRECAS':
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
        break;
      default:
        console.log('Unknown matching format : ' + param['format'] + '\n');
        break;
      }
    }
  } else if (/^\/[a-z]+\/[a-z]+\/results\/(enhdocview|tocBrowseNodeClick)\.do$/.test(path)) {
    // https://www.lexisnexis.com/uk/legal/results/enhdocview.do?docLinkInd=true&ersKey=23_T520044311&format=GNBFULL&startDocNo=0&resultsUrlKey=0_T520044313&backKey=20_T520044314&csi=274661&docNo=1&scrollToPosition=0
    // https://www.lexisnexis.com/uk/legal/results/tocBrowseNodeClick.do?rand=0.23421785867541522&tocCSI=281055&clickedNode=TAAD
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param.tocCSI;
  } else if (/^\/[a-z]+\/[a-z]+\/results\/renderTocBrowse\.do$/.test(path)) {
    //https://www.lexisnexis.com/uk/legal/results/renderTocBrowse.do?rand=0.9940351116863005&pap=quicklinks&formIdLawNow=GB00STLegHome&sourceId=Q_CAT6000003.T9929409
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.sourceId;
  } else if (/^\/[a-z]+\/[a-z]+\/search\/homesubmitForm\.do$/.test(path)) {
    //https://www.lexisnexis.com/uk/legal/search/homesubmitForm.do#0||RELEVANCE||||
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
