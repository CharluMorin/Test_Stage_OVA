import express from "express";
import {
  getAllItems,
  addItem,
  modifyItem,
  removeItem,
  removeAllItems,
} from "../controllers/grocery.controller.mjs";
import {
  validateItem,
  validateItemId,
} from "../middlewares/grocery.middleware.mjs";

const router = express.Router();

router.get("/", getAllItems);

router.post("/", validateItem, addItem);

router.put("/:id", validateItemId, validateItem, modifyItem);

router.delete("/:id", validateItemId, removeItem);

router.delete("/", removeAllItems);

export default router;
