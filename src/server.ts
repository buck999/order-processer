import App from "./app";
import { OrderController } from "./orders/orders.controller";

const app = new App([new OrderController()]);
app.listen();
