import { DEFAULT_FETCH_TIMEOUT_MS } from '@config/constants';

/**
 * fetch with timeout support using AbortController
 */
export async function fetchWithTimeout(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS
): Promise<Response> {
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), timeoutMs);
  
  try {
    return await fetch(input, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(timeout);
  }
}