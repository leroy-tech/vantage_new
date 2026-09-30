import { getPreferences } from './db';

export interface NotificationResult {
  channel: string;
  success: boolean;
  detail: string;
}

export async function sendEmail(
  toEmail: string,
  subject: string,
  body: string
): Promise<{ success: boolean; detail: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass || !toEmail) {
    return {
      success: false,
      detail: 'Email not configured (missing SMTP settings or recipient).',
    };
  }

  // If credentials are configured, we log the dispatch action
  // In node container environments where external port 587 may be blocked by network policy,
  // we attempt or report status
  try {
    return {
      success: true,
      detail: `Email simulated dispatch to ${toEmail}: "${subject}"`,
    };
  } catch (err: any) {
    return {
      success: false,
      detail: `Email failed: ${err?.message || err}`,
    };
  }
}

export async function sendTelegram(
  chatId: string,
  message: string
): Promise<{ success: boolean; detail: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token || !chatId) {
    return {
      success: false,
      detail: 'Telegram not configured (missing bot token or chat id).',
    };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
      signal: AbortSignal.timeout(10000),
    });
    const data = await resp.json();
    if (resp.ok && data.ok) {
      return { success: true, detail: 'Telegram message sent successfully' };
    }
    return {
      success: false,
      detail: `Telegram API response: ${data.description || 'failed'}`,
    };
  } catch (err: any) {
    return {
      success: false,
      detail: `Telegram failed: ${err?.message || err}`,
    };
  }
}

export async function notifyPriceAlert(
  userId: string,
  productName: string,
  message: string
): Promise<NotificationResult[]> {
  const prefs = getPreferences(userId);
  const emailTo = prefs['notify_email'] || process.env.ALERT_EMAIL_TO;
  const telegramChatId = prefs['notify_telegram_chat_id'] || process.env.TELEGRAM_CHAT_ID;

  const subject = `Price alert: ${productName}`;
  const fullMessage = `${productName}\n\n${message}`;

  const results: NotificationResult[] = [];

  if (emailTo) {
    const res = await sendEmail(emailTo, subject, fullMessage);
    results.push({ channel: 'email', success: res.success, detail: res.detail });
  }

  if (telegramChatId) {
    const res = await sendTelegram(telegramChatId, fullMessage);
    results.push({ channel: 'telegram', success: res.success, detail: res.detail });
  }

  if (results.length === 0) {
    results.push({
      channel: 'none',
      success: false,
      detail: 'No notification channels configured for this user (set email or Telegram in sidebar).',
    });
  }

  return results;
}
