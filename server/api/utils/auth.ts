import type { H3Event } from 'h3';

export function validateSecret(event: H3Event) {
  const secretKey = useRuntimeConfig().taskSecret;

  if (!secretKey) {
    throw createError({ statusCode: 500, statusMessage: 'Secret must be set' });
  }

  const authHeader = getHeader(event, 'authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== secretKey) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
}
