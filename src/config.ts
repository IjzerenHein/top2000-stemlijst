export const SPOTIFY_CLIENT_ID = "135a7f9372c94733be6beb4d0bde0711";

export const DEEZER_APP_ID =
  process.env.NODE_ENV === "development" ? "453242" : "453202";

export const FUNCTIONS_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/top2000-stemlijst/us-central1"
    : "https://us-central1-top2000-stemlijst.cloudfunctions.net";
