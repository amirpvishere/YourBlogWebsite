import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './auth.service';


@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		SharedModule,
		RouterLink
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'INFO-6150-final-project';
	userName: string | null = null;

	constructor(private authService:AuthService, private router:Router) {
		this.userName = localStorage.getItem('name');
		}

	isLoggedIn(): boolean {
		const email = localStorage.getItem('email');
		return !!email || this.authService.isLoggedIn();
	}

	isAdmin(): boolean {
		const role = localStorage.getItem('role');
		return role?.toLowerCase() === 'admin'; // Return true if role is 'admin' (case insensitive)
	}
	
	onLogout(){
		this.authService.logout();
		localStorage.clear();

		this.router.navigate(['/']).then(() => {
			console.log('Navigation to home successful');
		}).catch(err => {
			console.error('Navigation error:', err);
		});	}
}
