import { getMinifiedRecords, storeTable } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  // get data from req.body

  if (req.method === "POST") {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    if (!id) {
      res.status(400).json({ status: false, message: "id missing!!!" });
      return;
    }

    try {
      // check record already exist or not
      const findCoffeeStores = await storeTable
        .select({
          filterByFormula: `id='${id}'`,
        })
        .firstPage();
      // console.log({ findCoffeeStores });
      // if exist then return else (create new record and return)
      if (findCoffeeStores.length !== 0) {
        res.status(403).json({
          status: false,
          data: getMinifiedRecords(findCoffeeStores),
          message: "Record already exist!",
        });
      } else {
        if (!name) {
          res.status(400).json({ status: false, message: "name missing!!!" });
          return;
        }

        const createRecords = await storeTable.create([
          {
            fields: {
              id: id.toString(),
              name,
              address,
              neighbourhood,
              voting: voting || 0,
              imgUrl,
            },
          },
        ]);
        res.status(201).json({
          status: true,
          data: getMinifiedRecords(createRecords),
          message: "Record created successfully",
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, message: "Something went wrong!", error });
    }
  }
};

export default createCoffeeStore;
