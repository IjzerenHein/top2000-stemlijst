# Top 2000 Stemlijst

Importeer jouw Top 2000 stemlijst eenvoudig naar Spotify, Apple Music of Deezer

https://top2000stemlijst.nl

> This project was bootstrapped with [Expo](https://expo.io)


## Local development

Start the web app:

```sh
expo start:web
```

Open it in the browser:

http://localhost:19006


### Running the cloud functions locally

https://firebase.google.com/docs/functions/local-emulator

Open a separate terminal and go to the `/functions` directory.

Use `firebase login` to login to the Firebase project.

Download the secrets to the `.runtimeconfig.json` file:

```sh
firebase functions:config:get
```

Start the development server:

```sh
firebase emulators:start --only functions
```


