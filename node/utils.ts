export function atob(b64Encoded?: string) {
  if (!b64Encoded) {
    return ''
  }
  return Buffer.from(b64Encoded, 'base64').toString()
}

export const formatSalesChannel = (segment?: any): string => {
  if (!segment) {
    return ''
  }

  const franchise = segment.regionId
    ? `${atob(segment.regionId).replace('SW#', '')}-`
    : ''
  return `${franchise}${segment.channel}`
}
