import asyncHandler from "../utils/asyncHandler.js";
import APIResponse from "../utils/APIResponse.js";
import * as unitService from "../services/unit.service.js";

/* ================================
   Create Unit
================================ */
export const createUnitController = asyncHandler(async (req, res) => {
    const unit = await unitService.createUnit(req.body);

    res.status(201).json(
        new APIResponse(201, unit, "Unit created successfully")
    );
});

/* ================================
   Get Units Needing Service
   (Today / Week / Month handled by query)
================================ */
export const getUnitsNeedingServiceController = asyncHandler(async (req, res) => {
    const units = await unitService.getUnitsNeedingService(req.query);

    res.status(200).json(
        new APIResponse(200, units, "Units fetched successfully")
    );
});

/* ================================
   Get Units By Customer
================================ */
export const getUnitsByCustomerController = asyncHandler(async (req, res) => {
    const units = await unitService.getUnitsByCustomer(req.params.customerId);

    res.status(200).json(
        new APIResponse(200, units, "Customer units fetched successfully")
    );
});

/* ================================
   Update Unit
================================ */
export const updateUnitController = asyncHandler(async (req, res) => {
    const unit = await unitService.updateUnit(req.params.id, req.body);

    res.status(200).json(
        new APIResponse(200, unit, "Unit updated successfully")
    );
});

/* ================================
   Register Service Completion
================================ */
export const registerServiceCompletionController = asyncHandler(async (req, res) => {
    const { serviceDate } = req.body;
    const unit = await unitService.registerServiceCompletion(req.params.id, serviceDate ? new Date(serviceDate) : undefined);

    res.status(200).json(
        new APIResponse(200, unit, "Service completion registered successfully")
    );
});

/* ================================
   Delete Unit
================================ */
export const deleteUnitController = asyncHandler(async (req, res) => {
    await unitService.deleteUnit(req.params.id);

    res.status(200).json(
        new APIResponse(200, null, "Unit deleted successfully")
    );
});

/* ================================
   Get All Units
================================ */
export const getAllUnitsController = asyncHandler(async (req, res) => {
  const units = await unitService.getAllUnits();

  res.status(200).json(
    new APIResponse(200, units, "Units fetched successfully")
  );
});
