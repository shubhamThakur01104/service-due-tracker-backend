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
    
    // 4️⃣ If lastServiceDate is provided but nextServiceDate is not, and serviceIntervalDays is provided, automatically calculate nextServiceDate
    let finalNextServiceDate = nextServiceDate;
    if (lastServiceDate && serviceIntervalDays && !nextServiceDate) {
        try {
            const lastDate = new Date(lastServiceDate);
            const intervalDays = parseInt(serviceIntervalDays);
            
            if (!isNaN(lastDate.getTime()) && intervalDays > 0) {
                const calculatedNextDate = new Date(lastDate);
                calculatedNextDate.setDate(calculatedNextDate.getDate() + intervalDays);
                finalNextServiceDate = calculatedNextDate;
            }
        } catch (error) {
            // If date parsing fails, leave nextServiceDate as provided
        }
    }

    // 5️⃣ Create the unit linked to the customer
    const unitData = {
        customerId: customer._id,
        type,
        displayName,
        lastServiceDate,
        nextServiceDate: finalNextServiceDate,
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
    // If lastServiceDate and serviceIntervalDays are provided, automatically calculate nextServiceDate
    if (data.lastServiceDate && data.serviceIntervalDays) {
        try {
            const lastDate = new Date(data.lastServiceDate);
            const intervalDays = parseInt(data.serviceIntervalDays);
            
            if (!isNaN(lastDate.getTime()) && intervalDays > 0) {
                const nextDate = new Date(lastDate);
                nextDate.setDate(nextDate.getDate() + intervalDays);
                data.nextServiceDate = nextDate;
            }
        } catch (error) {
            // If date parsing fails, leave nextServiceDate as is
        }
    }
    
    const unit = await Unit.findByIdAndUpdate(id, data, {
        new: true
    });

    if (!unit) {
        throw new APIError(404, "Unit not found");
    }

    return unit;
};

/* ================================
   Register Service Completion
================================ */
export const registerServiceCompletion = async (id, serviceDate = new Date()) => {
    const unit = await Unit.findById(id);
    
    if (!unit) {
        throw new APIError(404, "Unit not found");
    }
    
    // If serviceIntervalDays is set, calculate next service date based on it
    if (unit.serviceIntervalDays) {
        const nextDate = new Date(serviceDate);
        nextDate.setDate(nextDate.getDate() + unit.serviceIntervalDays);
        
        const updatedUnit = await Unit.findByIdAndUpdate(
            id,
            {
                lastServiceDate: serviceDate,
                nextServiceDate: nextDate
            },
            { new: true }
        );
        
        return updatedUnit;
    } else {
        // If no interval is set, just update the last service date
        const updatedUnit = await Unit.findByIdAndUpdate(
            id,
            { lastServiceDate: serviceDate },
            { new: true }
        );
        
        return updatedUnit;
    }
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
