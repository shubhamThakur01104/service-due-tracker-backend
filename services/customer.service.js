import { Customer } from "../models/customer.model.js";
import APIError from "../utils/APIError.js";

/* ================================
   Create Customer
================================ */
export const createCustomer = async (data) => {
    if (!data.name || !data.phone) {
        throw new APIError(400, "Name and phone are required");
    }

    const customer = await Customer.create(data);
    return customer;
};

/* ================================
   Get All Customers
================================ */
export const getAllCustomers = async () => {
    return await Customer.find().sort({ createdAt: -1 });
};

/* ================================
   Get Customer By ID
================================ */
export const getCustomerById = async (id) => {
    const customer = await Customer.findById(id);

    if (!customer) {
        throw new APIError(404, "Customer not found");
    }

    return customer;
};

/* ================================
   Update Customer
================================ */
export const updateCustomer = async (id, data) => {
    const customer = await Customer.findByIdAndUpdate(id, data, {
        new: true
    });

    if (!customer) {
        throw new APIError(404, "Customer not found");
    }

    return customer;
};

/* ================================
   Delete Customer
================================ */
export const deleteCustomer = async (id) => {
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
        throw new APIError(404, "Customer not found");
    }

    return true;
};
