import env from "./env.ts";

const GRAPHQL_ENDPOINT = `${env.GRAPHQL_ENDPOINT}/v1/graphql`;
const GRAPHQL_ADMIN_SECRET = env.GRAPHQL_ADMIN_SECRET;

export const getDailyReport = async () => {
  const query = `
    query GetBookingAndTransactionData($startOfDay: timestamp!, $endOfDay: timestamp!) {
      newOrders: bookings_aggregate(
        where: {
          machine_status: {_eq: "ORDER_COMPLETED"},
          start_time: {_gte: $startOfDay, _lte: $endOfDay}
        }
      ) {
        aggregate {
          count
        }
      }
      totalCredit: transactions_aggregate(
        where: {
          created_at: {_gte: $startOfDay, _lte: $endOfDay},
          is_debit: {_eq: false}
        }
      ) {
        aggregate {
          sum {
            amount
          }
        }
      }
      totalDebit: transactions_aggregate(
        where: {
          created_at: {_gte: $startOfDay, _lte: $endOfDay},
          is_debit: {_eq: true}
        }
      ) {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  `;

  const variables = {
    startOfDay:
      new Date(new Date().setDate(new Date().getDate() - 1))
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .replace(", ", "T")
        .split("T")[0] + "T00:00:00+05:30",
    endOfDay:
      new Date(new Date().setDate(new Date().getDate() - 1))
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .replace(", ", "T")
        .split("T")[0] + "T23:59:59+05:30",
  };

  try {
    const response = await fetch(GRAPHQL_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": GRAPHQL_ADMIN_SECRET!,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const [month, day, year] = new Date(
      new Date().setDate(new Date().getDate() - 1)
    )
      .toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })
      .split("/");

    return {
      date: `${day}-${month}-${year}`,
      newOrders: data.data.newOrders.aggregate.count as string,
      totalCredit: data.data.totalCredit.aggregate.sum.amount as string,
      totalDebit: data.data.totalDebit.aggregate.sum.amount as string,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getActiveOrders = async () => {
  const query = `
    query GetActiveBookings {
      activeBookings:bookings_aggregate(where: {machine_status: {_eq: "ORDER_COMPLETED"}, is_suspended: {_eq: false}}) {
    aggregate {
      count
    }
  }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": GRAPHQL_ADMIN_SECRET!,
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return {
      activeBookings: data.data.activeBookings.aggregate.count as string,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getUsersCount = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed, add 1 to get the correct month number
  const day = date.getDate();

  const formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
    day < 10 ? "0" : ""
  }${day}`;

  try {
    const response = await fetch(
      `https://form-collection.subscriptions-653.workers.dev/users/count/${formattedDate}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      count: data.count as string,
      date: data.date as string,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
