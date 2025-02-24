import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isDarkMode = true;
  loginForm: FormGroup;
  loginError = '';
  submitted = false;

  constructor(private router: Router) {
    // Inicializa o formulário com validações
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    // Carrega o tema do localStorage
    const savedTheme = localStorage.getItem('isDarkMode');
    this.isDarkMode = savedTheme ? JSON.parse(savedTheme) : true;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Simulação de autenticação com dados fictícios
      const users = [
        { email: 'admin@cycleworks.com', password: 'admin123', role: 'admin' },
        { email: 'operador@cycleworks.com', password: 'op123', role: 'operator' }
      ];

      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('isAdmin', JSON.stringify(user.role === 'admin'));
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError = 'E-mail ou senha inválidos.';
      }
    }
  }
}
