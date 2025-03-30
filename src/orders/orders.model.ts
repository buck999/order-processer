export interface Order {
  id: number;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: Date;
  updated_at: Date;
  task: string;
  result?: string;
}
