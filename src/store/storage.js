// localStorage-ის უსაფრთხო გარსი: პრივატულ რეჟიმში ან დაბლოკილ საცავზე შეცდომას არ აგდებს
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* საცავი მიუწვდომელია — მონაცემი მხოლოდ მეხსიერებაში დარჩება */
  }
}

export const progressKey = (user) => `tao-progress-${user?.email ?? 'guest'}`

// პაროლის ჰეშირება (SHA-256), რომ ბრაუზერში ღია ტექსტით არ შეინახოს
export async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
