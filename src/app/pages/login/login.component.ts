import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isDarkMode = true;
  loginForm: FormGroup;
  loginError = '';
  submitted = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Injeta o PLATFORM_ID
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    // Só acessa localStorage se estiver no browser
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('isDarkMode');
      this.isDarkMode = savedTheme ? JSON.parse(savedTheme) : true;
      document.body.classList.toggle('dark-mode', this.isDarkMode);
    }
  }

  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const users = [
        { email: 'admin@cycleworks.com', password: 'admin123', role: 'admin' },
        { email: 'operador@cycleworks.com', password: 'op123', role: 'operator' }
      ];

      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('isAdmin', JSON.stringify(user.role === 'admin'));
        }
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError = 'E-mail ou senha inválidos.';
      }
    }
  }
}
