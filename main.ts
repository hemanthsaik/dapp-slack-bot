import "@std/dotenv/load";
import { getActiveOrders, getDailyReport } from "./report.ts";
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

// Deno.cron("every 6 hours notification", "0 */6 * * *", async () => {
//   const { activeBookings } = await getActiveOrders();
//   const blocksTest = [
//     {
//       "type": "section",
//       "text": {
//         "type": "plain_text",
//         "text": "Hi :wave:",
//         "emoji": true,
//       },
//     },
//     {
//       "type": "section",
//       "text": {
//         "type": "mrkdwn",
//         "text": `here is dapp's notification`,
//       },
//     },
//     {
//       "type": "section",
//       "text": {
//         "type": "mrkdwn",
//         "text": `Active bookings: \`${activeBookings ? activeBookings : "0"}\``,
//       },
//     },
//   ];
//   await app.client.chat.postMessage({
//     text: "Hi :wave:",
//     blocks: blocksTest,
//     channel: env.SLACK_CHANEL!,
//   });
// });
