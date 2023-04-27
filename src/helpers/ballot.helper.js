export function generateId(stateAcronym, charge_id){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = 9 - (stateAcronym.length);
    for (let i = 0; i < charactersLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return (stateAcronym+charge_id+result).toString();
}


export function hasDuplicateNumbers(arr) {
  return new Set(arr).size !== arr.length;
}