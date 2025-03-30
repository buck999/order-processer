import { PaginatedRequestParams, PaginatedResponse } from "../interfaces/api.interface";
import { Order } from "./orders.model";
import { publishToQueue } from "../worker/rabbitmq.queue";
import postgresPool from "../config/database.postgres";

export class OrderService {
  public async getOrders(params: PaginatedRequestParams): Promise<PaginatedResponse<Order>> {
    const page = params.page ?? 0;
    const pageSize = params.pageSize ?? 10;
    const offset = page * pageSize;

    // Get the total count of orders
    const countRes = await postgresPool.query("SELECT COUNT(*) FROM orders");
    const totalElements = countRes.rows.length > 0 ? parseInt(countRes.rows[0].count, 10) : 0;

    // Get the paginated orders
    const queryPromise = postgresPool.query<Order>("SELECT * FROM orders LIMIT $1 OFFSET $2", [
      pageSize,
      offset
    ]);
    const result = await queryPromise;
    // Calculate total pages
    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      orders: result.rows,
      totalElements,
      totalPages
    };
  }

  public async getOrderById(id: number): Promise<Order | null> {
    const queryPromise = postgresPool.query<Order>("SELECT * FROM orders WHERE id = $1", [id]);
    const res = await queryPromise;
    return res.rows.length > 0 ? res.rows[0] : null;
  }

  public async createOrder(task: string): Promise<Order> {
    const result = await postgresPool.query<Order>(
      "INSERT INTO orders (status, task) VALUES ($1, $2) RETURNING *",
      ["pending", task]
    );
    const order = result.rows[0];
    await publishToQueue("order_processing", JSON.stringify({ orderId: order.id }));
    return order;
  }
}
