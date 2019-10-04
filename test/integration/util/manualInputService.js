'use strict';

function addCriterion(browser, criterion) {
  browser
    .click('#add-criterion-button')
    .setValue('#criterion-title', criterion.title)
    .setValue('#criterion-description', criterion.description)
    .click('#favorability-selector-' + criterion.favorability)
    .click('#add-criterion-confirm-button');
}

function addDataSource(browser, path, dataSource) {
  browser
    .useXpath()
    .click(path)
    .useCss()
    .setValue('#data-source-reference', dataSource.reference)
    .setValue('#data-source-url', dataSource.url)
    .click('#add-data-source-button');
}

function addAlternative(browser, alternative) {
  browser
    .click('#add-alternative-button')
    .setValue('#alternative-title', alternative.title)
    .click('#add-alternative-confirm-button')
    ;
}

module.exports = {
  addCriterion: addCriterion,
  addDataSource: addDataSource,
  addAlternative: addAlternative
};