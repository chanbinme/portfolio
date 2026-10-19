/** 연락 폼의 이름·용건으로 메일 앱을 여는 주소를 만듭니다 */
export function buildMailto(email: string, name: string, topic: string) {
  const subject = `[포트폴리오] ${topic.trim() || '연락드립니다'}`
  const body = `안녕하세요, ${name.trim() || '___'}입니다.\n\n`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
