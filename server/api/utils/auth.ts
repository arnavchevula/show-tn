export function validateSecret(body: { secret?: string }) {
  const secretKey = useRuntimeConfig().taskSecret;

  if (!secretKey) {
    throw createError({ statusCode: 500, statusMessage: 'Secret must be set' });
  }

  if (body.secret !== secretKey) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
}
