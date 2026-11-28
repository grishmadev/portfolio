import { getColosData } from '@lib/utils';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const coloMap = await getColosData();
  return new Response(JSON.stringify(coloMap), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
