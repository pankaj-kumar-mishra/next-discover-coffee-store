const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

export const storeTable = base("coffee-stores");

export const getMinifiedRecords = (records = []) => {
  return records.map((item) => ({
    ...item.fields,
  }));
};
