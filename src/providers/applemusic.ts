import { FUNCTIONS_URL } from "../config";

export async function authorizeAppleMusic() {
  // Get developer token
  console.log("Getting token...");
  const response = await fetch(`${FUNCTIONS_URL}/token?provider=applemusic`);
  const json: any = await response.json();
  if (json.error) {
    throw new Error(json.error);
  }
  const { token } = json;
  console.log("Token", token);

  // Configure and authorize
  // @ts-ignore
  const music = MusicKit.configure({
    developerToken: token,
    app: {
      name: "Top 2000 Stemlijst",
      icon: require("../../assets/logo.png"),
      build: "1.0.0", // TODO?
      version: "1.0.0", // TODO?
    },
  });

  console.log("Authorizing...");
  const userToken = await music.authorize();

  console.log("Authorize succesful", userToken);
}
