import "@std/dotenv/load";
import { getDailyReport } from "./daily_report.ts";
import { app } from "./slack.ts";
import env from "./env.ts";

Deno.cron("slack Daily notification", "30 3 * * *", async () => {
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

// Deno.cron("test", "*/2 * * * *", async () => {
//   const blocksTest = [
//     {
//       "type": "section",
//       "text": {
//         "type": "plain_text",
//         "text": "Hi :wave: This is a test",
//         "emoji": true,
//       },
//     },
//   ];
//   await app.client.chat.postMessage({
//     text: "Hi :wave:",
//     blocks: blocksTest,
//     channel: env.SLACK_CHANEL!,
//   });
// });
