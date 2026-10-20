import { registerRootComponent } from 'expo';
import { API_URL } from '@env';
import App from './App';

function postClientError(payload) {
  try {
    fetch(`${API_URL}/api/ClientError`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, platform: "mobile" }),
    }).catch(() => {});
  } catch (_) {}
}

const originalHandler = global.ErrorUtils?.getGlobalHandler?.();
global.ErrorUtils?.setGlobalHandler?.((error, isFatal) => {
  postClientError({ message: error?.message, stack: error?.stack, source: isFatal ? "fatal" : "non-fatal" });
  if (originalHandler) originalHandler(error, isFatal);
});

registerRootComponent(App);
