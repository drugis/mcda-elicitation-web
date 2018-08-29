'use strict';
const testsContext = require.context('./unit', true, /Spec$/);
testsContext.keys().forEach(testsContext);
