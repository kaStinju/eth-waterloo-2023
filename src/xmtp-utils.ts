import { Client, Stream } from '@xmtp/xmtp-js';

export async function broadcast(xmtp: Client, channel: string, text: string) {
  const enc = new TextEncoder();
  await xmtp.publishEnvelopes([{ contentTopic: channel, message: enc.encode(text) }]);
}

export function listen(xmtp: Client, channel: string, callback: (text: string) => void): () => void {
  let cancelled = false;
  (async () => {
    const stream = await Stream.create(xmtp, [channel], async (e) => {
      return atob(e.message as unknown as string);
    });
    for await (const text of stream) {
      if (!cancelled) {
        callback(text);
      } else {
        return
      }
    }
  })();
  return () => {
    cancelled = true;
  }
}
