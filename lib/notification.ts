import type { FrameNotificationDetails } from "@farcaster/frame-sdk";
import { redis } from "./redis";

const notificationServiceKey =
  process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? "minikit";

function getUserNotificationDetailsKey(fid: number): string {
  return `${notificationServiceKey}:user:${fid}`;
}

export async function getUserNotificationDetails(
  fid: number,
): Promise<FrameNotificationDetails | null> {
  if (!redis) {
    console.warn("Redis not configured, returning null for notification details");
    return null;
  }

  try {
    return await redis.get<FrameNotificationDetails>(
      getUserNotificationDetailsKey(fid),
    );
  } catch (error) {
    console.error("Error getting notification details:", error);
    return null;
  }
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails,
): Promise<void> {
  if (!redis) {
    console.warn("Redis not configured, cannot set notification details");
    return;
  }

  try {
    await redis.set(getUserNotificationDetailsKey(fid), notificationDetails);
  } catch (error) {
    console.error("Error setting notification details:", error);
  }
}

export async function deleteUserNotificationDetails(
  fid: number,
): Promise<void> {
  if (!redis) {
    console.warn("Redis not configured, cannot delete notification details");
    return;
  }

  try {
    await redis.del(getUserNotificationDetailsKey(fid));
  } catch (error) {
    console.error("Error deleting notification details:", error);
  }
}
