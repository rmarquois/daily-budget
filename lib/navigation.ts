import { router, type Href } from 'expo-router';

/** Closes a modal, falling back to a route when there's no history (e.g. web refresh). */
export function closeModal(fallback: Href = '/today') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
