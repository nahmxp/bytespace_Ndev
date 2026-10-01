import { connectDB } from "./db";
import { isDbConfigured } from "./env";
import { Enrollment } from "@/models/Enrollment";
import { Follow } from "@/models/Follow";

export interface EnrollmentState {
  enrolled: boolean;
  completed: number[];
}

/** Per-user state for the pages. Never throws: pages must still render if the DB hiccups. */
export async function getEnrollmentState(userId: string | undefined, courseSlug: string): Promise<EnrollmentState> {
  const none = { enrolled: false, completed: [] };
  if (!userId || !isDbConfigured()) return none;
  try {
    await connectDB();
    const e = await Enrollment.findOne({ userId, courseSlug }).lean();
    return e ? { enrolled: true, completed: e.completedModules ?? [] } : none;
  } catch (err) {
    console.error("[enrollment]", err);
    return none;
  }
}

export async function getFollowState(userId: string | undefined, creatorSlug: string): Promise<boolean> {
  if (!userId || !isDbConfigured()) return false;
  try {
    await connectDB();
    return !!(await Follow.exists({ userId, creatorSlug }));
  } catch (err) {
    console.error("[follow]", err);
    return false;
  }
}
