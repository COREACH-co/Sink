/**
 * Resolve destination URL via a Shlink (or compatible) short domain without following redirects.
 * Expects redirect responses with a Location header (3xx).
 */
export async function fetchShlinkLongUrl(
  baseUrl: string,
  shortSlug: string,
  init: Pick<RequestInit, 'headers'>,
): Promise<string | null> {
  const trimmed = baseUrl.trim()
  if (!trimmed)
    return null

  const normalizedBase = trimmed.replace(/\/$/, '')
  const requestUrl = `${normalizedBase}/${shortSlug}`

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      redirect: 'manual',
      headers: init.headers,
    })

    if (response.status < 300 || response.status >= 400)
      return null

    const rawLocation = response.headers.get('location')
    if (!rawLocation)
      return null

    return new URL(rawLocation, requestUrl).href
  }
  catch (error) {
    console.error('Shlink fallback request failed:', error)
    return null
  }
}
