import { Request, Response } from "express";

import { Controller } from "../interfaces/controller.interface";
import { OrderService } from "./orders.service";

export class OrderController extends Controller {
  private orderService = new OrderService();

  constructor() {
    super("/orders");
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(`${this.path}`, this.getOrders);
    this.router.get(`${this.path}/:id`, this.getOrderById);
    this.router.post(`${this.path}`, this.createOrder);
  }

  private getOrders = async (request: Request, response: Response) => {
    try {
      const page = parseInt(request.query.page as string) || 0;
      const pageSize = parseInt(request.query.pageSize as string) || 10;
      const orders = await this.orderService.getOrders({ page, pageSize });
      response.json(orders);
    } catch (error) {
      console.log(error);
      response.status(500).send("Internal server error.");
    }
  };

  private createOrder = async (request: Request, response: Response) => {
    try {
      const payload = request.body;
      if (!payload.task) {
        response.status(400).send("Missing required field: 'task' in the request body.");
        return;
      }
      if (typeof payload.task !== "string") {
        response.status(400).send("The 'task' field must be a string.");
        return;
      }
      if (payload.task.length > 255) {
        response.status(400).send("The 'task' field must not exceed 255 characters.");
        return;
      }
      const order = await this.orderService.createOrder(payload.task);
      response.status(201).json(order);
    } catch (error) {
      console.log(error);
      response.status(500).send("Internal server error.");
    }
  };

  private getOrderById = async (request: Request, response: Response) => {
    try {
      const id = parseInt(request.params.id, 10);
      const order = await this.orderService.getOrderById(id);
      if (isNaN(id)) {
        response.status(400).send("Invalid 'id' parameter. It must be a valid number.");
        return;
      }
      if (!order) {
        response.status(404).send("Order not found.");
        return;
      }
      response.json(order);
    } catch (error) {
      console.log(error);
      response.status(500).send("Internal server error.");
    }
  };
}
