/**
 * Retorna se o obj2 contém todos os valores de obj1 e ambos são iguais
 *
 * EX:
 *
 * `obj1 = {
 *  'a':1,
 *  'b':2,
 *  'c':3
 * }`
 *
 * `obj2 = {
 *  'a':1,
 *  'b':2,
 *  'c':3,
 *  'd':4
 * }`
 *
 * `obj3 = {
 *  'a':2,
 *  'b':2,
 *  'c':3
 * }`
 *
 * `obj4 = {
 *  'a':1,
 *  'b':2
 * }`
 *
 * deepEqual(obj1, obj2) -> `true`, obj2 contém todos os parâmetros de obj1 e eles são iguais
 *
 * deepEqual(obj1, obj3) -> `false`, obj3 contém todos os parâmetros de obj1 poréme eles não são iguais
 *
 * deepEqual(obj1, obj4) -> `false`, obj4 não contém todos os parâmetros de obj1
 *
 * @param obj1 - object
 * @param obj2 - object
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepEqual(obj1: any, obj2: any): boolean {
    // Comparação directa (incluindo null/undefined)
    if (obj1 === obj2) return true;

    // Tipos diferentes
    if (typeof obj1 !== typeof obj2) return false;

    // Tratamento de datas
    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }

    if (Array.isArray(obj1) && Array.isArray(obj2) && obj1.length != obj2.length)
        return false;

    // Objetos/Arrays
    if (
        typeof obj1 === "object" &&
        obj1 !== null &&
        typeof obj2 === "object" &&
        obj2 !== null
    ) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length > keys2.length) return false;

        for (const key of keys1) {
            if (!deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }

    // Outros casos
    return false;
}