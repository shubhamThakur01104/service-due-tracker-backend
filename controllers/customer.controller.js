import asyncHandler from "../utils/asyncHandler.js";
import APIResponse from "../utils/APIResponse.js";
import * as customerService from "../services/customer.service.js";

/* ================================
   Create Customer
================================ */
export const createCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.createCustomer(req.body);

    res
        .status(201)
        .json(new APIResponse(201, customer, "Customer created successfully"));
});

/* ================================
   Get All Customers
================================ */
export const getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await customerService.getAllCustomers();

    res
        .status(200)
        .json(new APIResponse(200, customers, "Customers fetched successfully"));
});

/* ================================
   Get Customer By ID
================================ */
export const getCustomerById = asyncHandler(async (req, res) => {
    const customer = await customerService.getCustomerById(req.params.id);

    res
        .status(200)
        .json(new APIResponse(200, customer, "Customer fetched successfully"));
});

/* ================================
   Update Customer
================================ */
export const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.updateCustomer(
        req.params.id,
        req.body
    );

    res
        .status(200)
        .json(new APIResponse(200, customer, "Customer updated successfully"));
});

/* ================================
   Delete Customer
================================ */
export const deleteCustomer = asyncHandler(async (req, res) => {
    await customerService.deleteCustomer(req.params.id);

    res
        .status(200)
        .json(new APIResponse(200, null, "Customer deleted successfully"));
});
