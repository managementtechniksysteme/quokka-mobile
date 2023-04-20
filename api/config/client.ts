import { AuthContext, Tokens } from '../../context/auth';
import { API_BASE_URL, commonHeaders } from './config';
import { z } from 'zod';

const RefreshTokensSchema = z.object({
  token: z.string(),
  refresh_token: z.string(),
});

type RefreshTokens = z.infer<typeof RefreshTokensSchema>;

export const refreshTokens = async (
  refreshToken: string,
  auth?: AuthContext
): Promise<Tokens> => {
  /*if (!auth.tokens) {
    throw new Error('Error refreshing authentication token.');
  }*/

  const response = await fetch(`${API_BASE_URL}/token/refresh`, {
    method: 'POST',
    headers: {
      ...commonHeaders,
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    auth?.logout();
    throw new Error('Error refreshing authentication token.');
  }

  const data = await response.json();
  const tokens = RefreshTokensSchema.parse(data);

  await auth?.storeTokens(data.token, data.refresh_token);

  return { token: tokens.token, refreshToken: tokens.refresh_token };
};

export async function useApiClient<T extends z.Schema | void = void>(
  auth: AuthContext,
  url: RequestInfo,
  options?: {
    schema?: T;
    options?: RequestInit;
  }
): Promise<T extends z.Schema ? z.infer<T> : void> {
  if (!auth.tokens) {
    throw new Error('Trying to use API client without token.');
  }

  let response = await fetch(url, {
    ...options?.options,
    headers: {
      ...commonHeaders,
      Authorization: `Bearer ${auth.tokens.token}`,
    },
  });

  if (response.status === 401) {
    const refreshedTokens = await refreshTokens(auth.tokens.refreshToken, auth);

    response = await fetch(url, {
      ...options?.options,
      headers: {
        ...commonHeaders,
        Authorization: `Bearer ${refreshedTokens.refreshToken}`,
      },
    });
  }

  if (response.status === 422) {
    throw await response.json();
  }

  if (!response.ok) {
    throw new Error('Error using API client.');
  }

  const data = await response.json();

  return options?.schema ? options.schema.parse(data) : data;
}
