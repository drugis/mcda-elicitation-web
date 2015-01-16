mcda-web unit tests
===================

To run tests, first make sure you have the karma node modules:

    npm install

And you should also have installed the bower_components from the root of the repository.

Then run using:

    ./node_modules/karma/bin/karma start

Also make sure that the bower_components are present in the root directory.
You can install these by running

    bower install

Or `npm install -g karma-cli` and then just `karma start`.
