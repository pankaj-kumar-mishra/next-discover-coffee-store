const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const storeTable = base("coffee-stores");

const getMinifiedRecords = (records = []) => {
  return records.map((item) => ({
    recordId: item.id,
    ...item.fields,
  }));
};

const findCoffeeStores = async (id) => {
  const records = await storeTable
    .select({
      filterByFormula: `id='${id}'`,
    })
    .firstPage();

  return getMinifiedRecords(records);
};

export { storeTable, getMinifiedRecords, findCoffeeStores };
