function setToken(token) {
  localStorage.setItem('user-token', token);
}

function getToken() {
  return localStorage.getItem('user-token');
}

function resetToken() {
  localStorage.removeItem('user-token');
}

export {setToken, getToken, resetToken}