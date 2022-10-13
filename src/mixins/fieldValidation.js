import validURL from 'valid-url'

export function isValidURL(str) {
    return  validURL.isUri(str);
}
export function isDomain(str)
{
const regexp = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;
  
        if (regexp.test(str))
          {
            return true;
          }
        else
          {
            return false;
          }
}
export function isEmpty(str) {
    if (str == " ") {
        return true;
    }
    if (!str) {
        return true;
    }
    return false;
}

export function isDate(date) {
    if (!date) {
        return false;
    }
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
}
export function ifSpaceExists(str) {
  str= str.trim()
  str = str.split(' ')
  if (str.length > 1) {
     return true
  }
  else return false 
 }