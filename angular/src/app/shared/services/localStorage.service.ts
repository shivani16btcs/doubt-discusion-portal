import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}
  getUsername() {
    return localStorage.getItem('username');
  }
  setUsername( username: string ) {
    localStorage.setItem('username', username);
  }
  getRememberMe() {
    return localStorage.getItem('rememberMe');
  }
  saveAuthInfo(token: string, username: string, userId: string, expiresIn: Date, email: string, rememberMe: boolean,role:string ) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('expireDuration', expiresIn.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    localStorage.setItem('rememberMe', rememberMe + '');
    localStorage.setItem('role',role);
  }

  removeAuthInfo() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('expireDuration');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('role');
  }

  getAuthInfo() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const expireDuration = localStorage.getItem('expireDuration');
    const email = localStorage.getItem('email');
    const rememberMe = localStorage.getItem('rememberMe');
    const role = localStorage.getItem('role');
    if ( !token ) {
      return;
    }
    return {
      token: token,
      username: username,
      userId: userId,
      expireDuration: new Date(expireDuration),
      email: email,
      rememberMe: rememberMe,
      role:role
    };
  }

}
