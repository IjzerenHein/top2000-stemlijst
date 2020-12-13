import * as functions from "firebase-functions";
import * as cors from "cors";

const corsMiddleware = cors({ origin: true });

export default function (
  request: functions.https.Request,
  response: functions.Response<any>
) {
  corsMiddleware(request, response, () => {
    /* nop */
  });
}
