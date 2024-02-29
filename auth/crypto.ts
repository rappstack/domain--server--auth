import { alphabet, generateRandomString } from 'oslo/crypto'
export function id__generate(length:number):string {
	return generateRandomString(length, alphabet('0-9', 'a-z'))
}
