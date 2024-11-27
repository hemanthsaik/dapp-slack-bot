import Slack from "@slack/bolt";
import env from "./env.ts";

export const app = new Slack.App({
  signingSecret: env.SLACK_SIGNING_SECRET,
  token: env.SLACK_BOT_TOKEN,
});
