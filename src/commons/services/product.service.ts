export const getRandomHex = (id: string, size: number) => {
  let result = [];
  let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  for (let n = 0; n < size; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  let idTmp: string[] = id.split("");
  for (let index = 0; index < idTmp.length; index++) {
    result[index] = idTmp[index];
  }
  return result.join('');
}

export const convertToArrayHex = (buf: any) => {
  return Array.from(buf, (byte: number) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  });
}

export const hex2a = (hexx: string) => {
  const hex = hexx.toString();//force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  if (str.length < 5) return null;
  return str.substring(1, str.length - 2);
}

export const getArraysECUKeys = (binary: any[]) => {
  const indexFirstId = [6, 7, 8, 29, 30, 31, 32, 33]
  let firstIds = [];
  indexFirstId.forEach(index => {
    firstIds.push(binary[index]);
  });
  return firstIds;
}