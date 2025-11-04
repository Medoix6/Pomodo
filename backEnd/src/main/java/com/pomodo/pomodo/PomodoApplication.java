package com.pomodo.pomodo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

/**
 * Main application class for the Pomodo API.
 */
@SpringBootApplication
public class PomodoApplication {

	public static void main(String[] args) {
		SpringApplication.run(PomodoApplication.class, args);
	}

}
