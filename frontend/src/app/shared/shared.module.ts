import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpService } from './services/http.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    HttpService,
    AuthService
  ]
})
export class SharedModule { }
