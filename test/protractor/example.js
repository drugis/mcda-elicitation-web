describe('drugis login', function() {
  it('should go to "/choose-problem" after login', function() {
  	var url = 'http://localhost:8080';
    //browser.get('https://mcda.drugis.org');

    var ptor = protractor.getInstance();
    var driver = ptor.driver;

    var findByXPath = function(pathString) {
      return driver.findElement(protractor.By.xpath(pathString));
    };

    var findByName = function(name) {
      return driver.findElement(protractor.By.name(name));
    };

    driver.get(url);
    // make hidden form visible, so it can be used by selenium
    driver.executeScript('document.getElementById("hiddenSignInForm").style.display = "block";');
    findByName('username').sendKeys(ptor.params.login.user);
    findByName('password').sendKeys(ptor.params.login.password);
    findByName('submit').click();

    expect(ptor.getCurrentUrl()).toEqual(url + '/#/choose-problem');

    var elem = ptor.findElement(protractor.By.id('create-workspace-btn'));
    elem.click().then(console.log('oke'));

    var example =  element(by.repeater('option in examplesList').row(1));
    example.click();
    driver.sleep(3000);
  });
});