/*
 * Copyright 2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.drugis.mcdaweb.standalone.signup;

import javax.inject.Inject;

import org.drugis.mcdaweb.standalone.account.Account;
import org.drugis.mcdaweb.standalone.account.AccountRepository;
import org.drugis.mcdaweb.standalone.account.UsernameAlreadyInUseException;
import org.drugis.mcdaweb.standalone.signin.SignInUtils;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.UserProfile;
import org.springframework.social.connect.web.ProviderSignInUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.WebRequest;

@Controller
public class SignupController {

	private final AccountRepository accountRepository;

	@Inject
	public SignupController(AccountRepository accountRepository) {
		this.accountRepository = accountRepository;
	}

	@RequestMapping(value="/signup", method=RequestMethod.GET)
	public String signupForm(WebRequest request) {
		Connection<?> connection = ProviderSignInUtils.getConnection(request);
		if (connection != null) {
			UserProfile profile = connection.fetchUserProfile();
			Account account = createAccount(profile);
			if (account != null) {
				SignInUtils.signin(account.getUsername());
				ProviderSignInUtils.handlePostSignUp(account.getUsername(), request);
				return "redirect:/";
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
	
	private Account createAccount(UserProfile profile) {
		try {
			Account account = new Account(profile.getUsername(), profile.getFirstName(), profile.getLastName());
			accountRepository.createAccount(account);
			return account;
		} catch (UsernameAlreadyInUseException e) {
			return null;
		}
	}
}
