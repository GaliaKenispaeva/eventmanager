function isEmpty(value) {
  if (!!value) {
    return false;
  }
  return true;
}
function checkPassword (password, confirmPassword) {
  const arrErr = [];

  if (!password) {
    arrErr.push('Required field.');
  } else if (password.length < 6) {
    arrErr.push('Must be at least 6 characters long.');
  }

  if (password !== confirmPassword) {
    arrErr.push(`Passwords don't match.`);
  }

  return arrErr;
}

function validEmail(email) {
  // eslint-disable-next-line
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export {isEmpty, checkPassword, validEmail}