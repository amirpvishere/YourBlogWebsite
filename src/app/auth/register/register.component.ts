import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [SharedModule],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})

export class RegisterComponent {
	registerForm: FormGroup;
	errorMsg: string | null = null;

	constructor(private fb: FormBuilder, private router: Router){
		this.registerForm = this.fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(8)]],
			gender: ['', [Validators.required]],
			age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
			phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],			
		})
	}

	async onSubmit(): Promise<void> {
		if (this.registerForm.valid){
			const {name, email, password, gender, age, phone, role} = this.registerForm.value;
			const payload = {name, email, password, gender, age, phone, role: null}

			try {
				const response = await fetch("https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/users", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
					},
					body: JSON.stringify(payload),
				})

				if (response.ok) {
					alert('You have registered successfully');
					localStorage.setItem('email', email);
					localStorage.setItem('role', role);
					localStorage.setItem('name', name);
					this.router.navigate(['/']);
				} else {
					const error = await response.json();
					this.errorMsg = error.message || 'Registration failed. Please try again!';
			}} catch (error){
				console.error('Error during Registration', error);
				this.errorMsg = 'An error occured while registering. Please try again!'
			}} else {
				this.errorMsg = 'Please fill in all fields correctly.'
			}
		}
	}