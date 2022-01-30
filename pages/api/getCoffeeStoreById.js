import { findCoffeeStores } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res
      .status(400)
      .json({ status: false, message: "id missing!!! => getCoffeeStoreById" });
    return;
  }

  try {
    const records = await findCoffeeStores(id);
    if (records.length !== 0) {
      res.status(200).json({
        status: true,
        data: records,
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
};

export default getCoffeeStoreById;
