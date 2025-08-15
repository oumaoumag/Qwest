// Note: @farcaster/frame-sdk is deprecated, using types directly
type FrameNotificationDetails = {
  url: string;
  token: string;
};

type SendNotificationRequest = {
  notificationId: string;
  title: string;
  body: string;
  targetUrl: string;
  tokens: string[];
};

// Define proper types for the notification response
type NotificationResponseData = {
  result: {
    rateLimitedTokens: string[];
  };
};

// Simple response schema validation
const sendNotificationResponseSchema = {
  parse: (data: unknown): NotificationResponseData => data as NotificationResponseData,
  safeParse: (data: unknown): { success: boolean; data?: NotificationResponseData; error?: { errors: unknown[] } } => {
    try {
      // Basic validation - in a real app you'd want more robust validation
      const parsed = data as NotificationResponseData;
      if (parsed && typeof parsed === 'object' && 'result' in parsed) {
        return { success: true, data: parsed };
      }
      return { success: false, error: { errors: ['Invalid response format'] } };
    } catch {
      return { success: false, error: { errors: ['Failed to parse response'] } };
    }
  }
};
import { getUserNotificationDetails } from "@/lib/notification";

const appUrl = process.env.NEXT_PUBLIC_URL || "";

type SendFrameNotificationResult =
  | {
      state: "error";
      error: unknown;
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

export async function sendFrameNotification({
  fid,
  title,
  body,
  notificationDetails,
}: {
  fid: number;
  title: string;
  body: string;
  notificationDetails?: FrameNotificationDetails | null;
}): Promise<SendFrameNotificationResult> {
  if (!notificationDetails) {
    notificationDetails = await getUserNotificationDetails(fid);
  }
  if (!notificationDetails) {
    return { state: "no_token" };
  }

  const response = await fetch(notificationDetails.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notificationId: crypto.randomUUID(),
      title,
      body,
      targetUrl: appUrl,
      tokens: [notificationDetails.token],
    } satisfies SendNotificationRequest),
  });

  const responseJson = await response.json();

  if (response.status === 200) {
    const responseBody = sendNotificationResponseSchema.safeParse(responseJson);
    if (responseBody.success === false) {
      return { state: "error", error: responseBody.error?.errors || ['Unknown error'] };
    }

    if (responseBody.data && responseBody.data.result.rateLimitedTokens.length) {
      return { state: "rate_limit" };
    }

    return { state: "success" };
  }

  return { state: "error", error: responseJson };
}
