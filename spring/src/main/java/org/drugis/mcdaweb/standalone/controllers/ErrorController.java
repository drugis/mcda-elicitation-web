package org.drugis.mcdaweb.standalone.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ErrorController {
	@RequestMapping(value="/error/{code}", method=RequestMethod.GET)
	public String notFoundError(@PathVariable int code) {
		return "error/" + code;
	}
}
