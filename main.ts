import "@std/dotenv/load";
import { getDailyReport } from "./daily_report.ts";
import Slack from "@slack/bolt";
import env from "./env.ts";

const blocksTest = [
  {
    "type": "section",
    "text": {
      "type": "plain_text",
      "text": "Hi :wave: This is a test",
      "emoji": true,
    },
  },
];

const app = new Slack.App({
  signingSecret: env.SLACK_SIGNING_SECRET,
  token: env.SLACK_BOT_TOKEN,
});

Deno.cron("slack notification", "30 3 * * *", async () => {
  const { newOrders, totalCredit, totalDebit, date } = await getDailyReport();
  const blocks = [
    {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Hi :wave:",
        "emoji": true,
      },
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `here is dapp's notification for date: \`${date}\``,
      },
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `New orders: \`${
          newOrders ? newOrders : "0"
        }\` \n Total credits user's added: \`${
          totalCredit ? totalCredit : "0"
        }\` \n Total bookings credit usage: \`${
          totalDebit ? totalDebit : "0"
        }\``,
      },
    },
  ];
  await app.client.chat.postMessage({
    text: "Hi :wave:",
    blocks,
    channel: env.SLACK_CHANEL!,
  });
});

Deno.cron("test", "*/2 * * * *", async () => {
  await app.client.chat.postMessage({
    text: "Hi :wave:",
    blocks: blocksTest,
    channel: env.SLACK_CHANEL!,
  });
});
