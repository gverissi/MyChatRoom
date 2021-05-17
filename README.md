# MyChatRoom

Demo project using angular for an [online chat app](https://greg-chat-room.netlify.app/home).  
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.11.

# Get Started Locally

## Dependencies
Clone the repo and run: `npm install`

## Firebase
Create a free account, and a project on [Firebase](https://firebase.google.com/).  
Then create a firestore database and use the following rule to secure your database:  
````text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if
          request.auth != null;
    }
  }
}
````

## Credentials
- For dev:  
Rename the file `.env.cred.example.ts` to `.env.cred.ts` and fil it with your firestore credentials.  
- For prod:  
Rename the file `.env.example` to `.env` and fil it with your firestore credentials.

## Development server
- For dev:  
  Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
- For prod:  
  Run `ng serve --configuration production` for a prod server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files, but it will be re-build, so it can take a few seconds.


# Get Started with Netlify

## Git
- Download the repo as a zip file.  
- Create a GitHub repo and commit / push your project.

## Netlify
Create a `New site from Git` and go to `Site setting` tab:
- Add all environment variables under `Build & Deploy > Environment > Environment variables`
- Add build settings under `Build & Deploy > Continuous deployement > Build settings`
  - Build command: `ng build --configuration production`
  - Publish directory: `dist/your_project_name`

Go to `Deploys` tab:
- Hit the `Trigger deploy` button

Under `Site overview` tab you will find the url of your app
