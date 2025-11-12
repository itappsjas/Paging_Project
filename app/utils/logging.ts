import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PagingData {
  belt_no: string;
  flight_no: string;
  name_passenger: string;
  handle_by: string;
  free_text: string;
  status: number;
}

export async function logPagingOperation(data: PagingData) {
  try {
    // Get current time in Indonesia timezone (WIB = UTC+7)
    const now = new Date();
    const indonesiaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // Add 7 hours for WIB
    
    // Use type assertion to ensure the model exists
    const logEntry = await (prisma as unknown as {
      tb_paging_log: {
        create: (args: { data: PagingData & { last_update: Date } }) => Promise<unknown>;
      };
    }).tb_paging_log.create({
      data: {
        belt_no: data.belt_no,
        flight_no: data.flight_no,
        name_passenger: data.name_passenger,
        handle_by: data.handle_by,
        free_text: data.free_text,
        status: data.status,
        last_update: indonesiaTime
      }
    });
    console.log("Log entry created:", logEntry);
  } catch (error) {
    console.error("Error logging paging operation:", error);
    // Don't throw error to prevent main operation from failing
  }
}
