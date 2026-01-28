import express from "express";
import {
    createUnitController,
    getAllUnitsController,
    getUnitsNeedingServiceController,
    getUnitsByCustomerController,
    updateUnitController,
    deleteUnitController,
    registerServiceCompletionController
} from "../controllers/unit.controller.js";

const router = express.Router();

/* ================================
   Create Unit
================================ */
router.post("/", createUnitController);

/* ================================
   Get All Units
================================ */
router.get("/", getAllUnitsController);

/* ================================
   Dashboard – Units Needing Service
   ?filter=today | week | month
================================ */
router.get("/due", getUnitsNeedingServiceController);

/* ================================
   Get Units By Customer
================================ */
router.get("/customer/:customerId", getUnitsByCustomerController);

/* ================================
   Update Unit
================================ */
router.put("/:id", updateUnitController);

/* ================================
   Register Service Completion
================================ */
router.post("/:id/service-completion", registerServiceCompletionController);

/* ================================
   Delete Unit
================================ */
router.delete("/:id", deleteUnitController);

export default router;
