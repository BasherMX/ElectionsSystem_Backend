export function generateId(firstLastName, secondLastName, dateOfBirth, firstName) {
    let id = "";
    let randomChars = "";

    firstName = removeAccents(firstName);
    secondLastName = removeAccents(secondLastName);
    firstLastName = removeAccents(firstLastName);

    id += firstLastName.substring(0, 3);
    id += secondLastName.substring(0, 1);

    const birthDate = new Date(dateOfBirth);

    id += birthDate.getDate().toString().padStart(2, "0");
    id += birthDate.getFullYear().toString();
    id += firstName.substring(0, 2);

    for (let i = 0; i < 4; i++) {
      randomChars += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    id += randomChars;

    return id.toUpperCase();
}
  
export function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}