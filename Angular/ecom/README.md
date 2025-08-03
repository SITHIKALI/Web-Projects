# Ecom

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.13.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## E-commerce Application using Angular and Firebase
install necessary packages
```bash
npm install @angular/fire firebase
```
## Firebase Configuration
1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a web app to your Firebase project.
3. Copy the Firebase configuration object from the Firebase Console.
4. Add a variable 'firebase' in `src/environments/environment.ts` and `src/environments/environment.prod.ts` files with the Firebase configuration object.
5. Import the Firebase configuration in `src/app/app.module.ts` and initialize Firebase using `AngularFireModule.initializeApp(environment.firebase)`.
6. Import `AngularFireDatabaseModule` and `AngularFireAuthModule` in `src/app/app.module.ts`.
7. Use `AngularFireDatabase` to interact with the Firebase Realtime Database in your components or services.
8. Use `AngularFireAuth` for authentication features in your application.
```typescript
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
``` 
## Real-time Database
1. Use `AngularFireDatabase` to read and write data to the Firebase Realtime Database
2. Create a real-time database in the Firebase Console.
3. Add data to the database 
4. Copy the database URL from the Firebase Console and add it to your environment files. In the new variable 'databaseURL' in `src/environments/environment.ts`

## Angular Material
1. Install Angular Material by running `ng add @angular/material`.
2. Choose a theme and set up global typography and animations.
3. Verify that the Angular Material modules are imported in your `app.module.ts` file.
```typescript
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
```
4. Create a separate ts file 'material-ui-module.ts' in the 'app' folder to export all the Angular Material modules you want to use in your application.

```typescript
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';  
import { MatSelectModule } from '@angular/material/select';
import { CdkTableModule } from '@angular/cdk/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
// Add other Material modules as needed
```
## Separate Module 
create a separate folder for each module in the 'app' folder. For example, if you want to create a module for products, create a folder named 'products' and add the necessary files like `products.module.ts`, `products.component.ts`, etc.
```bash
ng generate module modules_name 
```
2. Created module  for E-commerce learning application
```bash
ng g m admin
ng g m authen
ng g m common
ng g m courses
ng g m menu

3. Creating a navigation menu
