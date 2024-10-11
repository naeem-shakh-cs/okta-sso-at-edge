import { GraphQLClient } from "graphql-request"

export const contentstackGraphQLClient = new GraphQLClient(
    process.env.CONTENTSTACK_API_KEY as string
);

