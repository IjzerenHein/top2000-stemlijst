export function capitalize(value: string): string {
  if (!value) return value;
  return value.substring(0, 1).toUpperCase() + value.substring(1);
}

export function uncapitalize(value: string): string {
  if (!value) return value;
  return value.substring(0, 1).toLowerCase() + value.substring(1);
}

const nl: any = {};
const en: any = {}; // TODO
const translation = nl;

/**
 * Fills-in components of the string with the given
 * arguments.
 *
 * Rules:
 * $1..99 is replaces with the exact string
 * $a..z is replaced with the first character being lowercase
 * %A..Z is replaced with the first character begin uppercase
 *
 */
function __t(arg: string, ...args: string[]): string {
  let result = translation[arg] || arg;
  for (let i = 0; i < args.length; i++) {
    let searchStr = `$${i + 1}`;
    while (result.indexOf(searchStr) >= 0) {
      result = result.replace(searchStr, args[i]);
    }
    searchStr = `$${String.fromCharCode(97 + i)}`;
    while (result.indexOf(searchStr) >= 0) {
      result = result.replace(searchStr, uncapitalize(args[i]));
    }
    searchStr = `$${String.fromCharCode(65 + i)}`;
    while (result.indexOf(searchStr) >= 0) {
      result = result.replace(searchStr, capitalize(args[i]));
    }
  }
  return result;
}

function __tDEBUG(arg: string, ...args: string[]) {
  return __t(arg, ...args);
}

export const t = __DEV__ ? __tDEBUG : __t;
