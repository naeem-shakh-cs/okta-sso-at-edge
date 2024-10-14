import contentstack from "@contentstack/delivery-sdk";
import { Entry } from "./interface";

const stack = contentstack.stack({
  apiKey: process.env.CONTENTSTACK_API_KEY as string,
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.CONTENTSTACK_ENVIRONMENT as string,
});

export async function fetchEntries(): Promise<Entry> {
  const result: Entry = await stack
    .contentType(process.env.CONTENTSTACK_CONTENT_TYPE as string)
    .entry(process.env.CONTENTSTACK_ENTRY_UID as string)
    .fetch();
  return result;
}
