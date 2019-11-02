import { Transform } from 'class-transformer';

export function ToBoolean(): (target: any, key: string) => void {
    return Transform((value: any) => value === 'true' || value === true || value === 1 || value === '1');
}
