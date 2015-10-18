#!/usr/bin/node
var path = require('path');
var fs = require('fs');
var https = require('https');

var WIKI_HOST = 'en.wiktionary.org';
var WIKI_PATH = '/wiki/';
var WIKIDIR = path.join(__dirname, 'Wiki');
var WORDFILE = path.join(__dirname, 'words-en');
var words = fs.readFileSync(WORDFILE).toString().split('\n');

function download(word) {
  var file = path.join(WIKIDIR, word + '.html');
  var req = https.request({
    hostname: WIKI_HOST,
    port: 443,
    path: WIKI_PATH + word,
    method: 'GET',
  }, function(res) {
    res.on('data', function(html) {
      var f = fs.openSync(file, 'a');
      fs.writeSync(f, '' + html);
      fs.closeSync(f);
    });
  });
  req.on('error', function(e) {
    console.error(e.stack);
  });
  req.end();
}

function main() {
  words.forEach(download);
}

main();
