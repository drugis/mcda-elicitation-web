describe('drugis login story', function() {

  var ptor;
  var LoginPage= require('./loginPage.js');

  beforeEach(function() {
     ptor = protractor.getInstance();
  });

  it('should go to chooseproblemPage after login', function() {
    var url = ptor.params.url || 'http://localhost:3002';
    var loginPage = new LoginPage(ptor, url);
    var chooseProblemPage = loginPage.login();
    expect(chooseProblemPage.getCurrentUrl()).toEqual(url + '/#/choose-problem');
  });
});
