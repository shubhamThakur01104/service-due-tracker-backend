import { importCustomersAndUnits } from "../services/import.service.js";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";

export const importCSV = async (req, res) => {
    if (!req.file) {
        throw new APIError(400, "CSV file is required");
    }

    // Call service
    const summary = await importCustomersAndUnits(req.file.buffer);

    res.status(200).json(
        new APIResponse(200, summary, "File import completed successfully")
    );
};
