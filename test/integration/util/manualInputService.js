'use strict';

function addCriterion(browser, criterion) {
  browser
    .click('#add-criterion-button').pause(300)
    .setValue('#criterion-title', criterion.title)
    .setValue('#criterion-description', criterion.description)
    .click('#favorability-selector-' + criterion.favorability).pause(300)
    .click('#add-criterion-confirm-button').pause(300);
}

function addDataSource(browser, criterionTitle, dataSource) {
  browser
    .click('#add-data-source-for-' + criterionTitle + '-button').pause(300)
    .setValue('#data-source-reference', dataSource.reference)
    .setValue('#data-source-url', dataSource.url)
    .click('#add-data-source-button').pause(300);
}

function addAlternative(browser, alternative) {
  browser
    .click('#add-alternative-button').pause(300)
    .setValue('#alternative-title', alternative.title)
    .click('#add-alternative-confirm-button').pause(300);
}

module.exports = {
  addCriterion: addCriterion,
  addDataSource: addDataSource,
  addAlternative: addAlternative
};