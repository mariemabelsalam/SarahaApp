import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email.js";
export const emailEvent = new EventEmitter();
emailEvent.on("confirmEmail", async (data) => {
  await sendEmail({ to: data.to, subject: data.otp }).catch((error) => {
    console.log(`fail to send email`, error.message);
  });
});
