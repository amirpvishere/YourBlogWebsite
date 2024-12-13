import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule } from '@angular/router';

@Component({
	selector: "app-login",
    standalone: true,
    imports: [SharedModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})

export class LoginComponent{
	loginForm: FormGroup;
	errorMsg: string | null = null;
	isLoggedIn: boolean = false;

	constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
	    this.loginForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required]],
        });
	}

		async onSubmit() {
			const { email, password } = this.loginForm.value;
			try {
				const response = await fetch("https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users", {
						method: "GET",
						headers: {
							'Content-Type': 'application/json', 
							"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
						},
					})

			if (!response.ok) {
				throw new Error(`Failed to fetch users. Status: ${response.status}`);
			}

			const data = await response.json();
			const users = data.data

			const user = users.find(
				(user: { email: string; password: string }) => user.email === email && user.password === password
			);

			if (user) {
				localStorage.setItem('email', user.email);
				localStorage.setItem('role', user.role);
				localStorage.setItem('name', user.name);
				this.errorMsg = null;
				alert('Login Successful!');
				this.router.navigate(["/"]);
			} else {
				// Invalid credentials
				this.errorMsg = "Invalid credentials. Please try again.";
			}
		} catch (error) {
            this.errorMsg = "Failed to fetch users. Please try again later.";
		}
		}
	}

