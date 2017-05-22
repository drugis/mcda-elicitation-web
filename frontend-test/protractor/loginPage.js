var LoginPage = function(ptor, url) {

	var ChooseProblemPage = require('./chooseProblemPage.js');

	this.login = function() {
		
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
    ptor.sleep(2000) // wait for angular reload
    return new ChooseProblemPage(ptor);
  };
};


module.exports = LoginPage;