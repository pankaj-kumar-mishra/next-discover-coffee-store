import {
  findCoffeeStores,
  getMinifiedRecords,
  storeTable,
} from "../../lib/airtable";

const updateUpvoteCoffeeStore = async (req, res) => {
  const { id } = req.body;

  if (req.method === "PUT") {
    if (!id) {
      res.status(400).json({
        status: false,
        message: "id missing!!! => getCoffeeStoreById",
      });
      return;
    }

    try {
      const records = await findCoffeeStores(id);
      if (records.length !== 0) {
        const record = records[0];
        const voting = parseInt(record.voting) + 1;
        const updatedRecords = await storeTable.update([
          {
            id: record.recordId,
            fields: {
              voting,
            },
          },
        ]);
        res.status(200).json({
          status: true,
          data: getMinifiedRecords(updatedRecords),
          message: "Record updated successfully",
        });
      } else {
        res.status(404).json({
          status: false,
          data: [],
          message: `Record not found: ${id}`,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "something went wrong", error });
    }
  }
};

export default updateUpvoteCoffeeStore;
