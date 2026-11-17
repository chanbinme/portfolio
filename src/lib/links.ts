/** 링크 주소를 사람이 읽는 모양으로: https://github.com/x/ → github.com/x, tel:010-… → 010-… */
export function readableHref(href: string) {
  return href
    .replace(/^(https?:\/\/|mailto:|tel:)/, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
}
