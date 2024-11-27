
const env = {
    GRAPHQL_ENDPOINT: Deno.env.get("GRAPHQL_ENDPOINT"),
    GRAPHQL_ADMIN_SECRET: Deno.env.get("GRAPHQL_ADMIN_SECRET"),
    SLACK_SIGNING_SECRET: Deno.env.get("SLACK_SIGNING_SECRET"),
    SLACK_BOT_TOKEN: Deno.env.get("SLACK_BOT_TOKEN"),
    SLACK_CHANEL: Deno.env.get("SLACK_CHANEL"),
};

export default env;
