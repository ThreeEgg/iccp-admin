export function getAuthorityToken() {
  return localStorage.getItem('adminAccessToken');
}

export function setAuthorityToken(token) {
  return localStorage.setItem('adminAccessToken', token);
}
