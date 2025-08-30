export class UserDto {
    public constructor(
        public id: number = 0,
        public imePrezime: string = '',
        public username: string = '',
        public role: string = 'stanar',
    ) { }
}