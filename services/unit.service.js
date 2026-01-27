import { Unit } from "../models/unit.model.js";
import { Customer } from "../models/customer.model.js";
import APIError from "../utils/APIError.js";

/* ================================
   Create Unit
================================ */
export const createUnit = async (data) => {
    const { customerId, customerEmail, customerPhone, type, displayName, lastServiceDate, nextServiceDate, serviceIntervalDays } = data;


    // 1️⃣ Validate required fields
    if (!type || !nextServiceDate) {
        throw new APIError(400, "Type and nextServiceDate are required");
    }

    // 2️⃣ Determine customerId
    let customer;

    if (customerId) {
        customer = await Customer.findById(customerId);
    } else if (customerEmail || customerPhone) {
        const query = {};
        if (customerEmail) query.email = customerEmail;
        if (customerPhone) query.phone = customerPhone;

        customer = await Customer.findOne(query);
    }

    if (!customer) {
        throw new APIError(400, "Customer not found. Provide a valid customerId, email, or phone.");
    }

    // 3️⃣ Calculate service interval days automatically if not provided
    let calculatedServiceIntervalDays = serviceIntervalDays;
    if (!serviceIntervalDays && lastServiceDate && nextServiceDate) {
        try {
            const lastDate = new Date(lastServiceDate);
            const nextDate = new Date(nextServiceDate);
            if (!isNaN(lastDate.getTime()) && !isNaN(nextDate.getTime())) {
                const diffTime = nextDate.getTime() - lastDate.getTime();
                calculatedServiceIntervalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
        } catch (error) {
            // If date parsing fails, leave serviceIntervalDays as null/undefined
        }
    }

    // 3️⃣ Create the unit linked to the customer
    const unitData = {
        customerId: customer._id,
        type,
        displayName,
        lastServiceDate,
        nextServiceDate,
        serviceIntervalDays: calculatedServiceIntervalDays
    };

    const unit = await Unit.create(unitData);
    return unit;
};

/* ================================
   Get Units Needing Service
   filter = today | week | month
================================ */
export const getUnitsNeedingService = async (query) => {
    const filter = query.filter || "today";

    const start = new Date();
    const end = new Date();

    if (filter === "week") {
        end.setDate(end.getDate() + 7);
    } else if (filter === "month") {
        end.setMonth(end.getMonth() + 1);
    }

    return await Unit.find({
        nextServiceDate: { $gte: start, $lte: end }
    })
        .populate("customerId", "name phone address")
        .sort({ nextServiceDate: 1 });
};

/* ================================
   Get Units By Customer
================================ */
export const getUnitsByCustomer = async (customerId) => {
    if (!customerId) {
        throw new APIError(400, "Customer ID is required");
    }

    return await Unit.find({ customerId }).sort({ nextServiceDate: 1 });
};

/* ================================
   Update Unit
================================ */
export const updateUnit = async (id, data) => {
    const unit = await Unit.findByIdAndUpdate(id, data, {
        new: true
    });

    if (!unit) {
        throw new APIError(404, "Unit not found");
    }

    return unit;
};

/* ================================
   Delete Unit
================================ */
export const deleteUnit = async (id) => {
    const unit = await Unit.findByIdAndDelete(id);

    if (!unit) {
        throw new APIError(404, "Unit not found");
    }

    return true;
};

/* ================================
   Get All Units
================================ */
export const getAllUnits = async () => {
    return await Unit.find()
        .populate("customerId", "name phone address")
        .sort({ createdAt: -1 });
};
