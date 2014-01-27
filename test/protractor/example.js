describe('drugis homepage', function() {
  it('should do something', function() {
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

    // do angular get
    //browser.get(url);

    driver.sleep(3000);

    expect(ptor.getCurrentUrl()).toEqual(url + '/#/choose-problem');
  });
});