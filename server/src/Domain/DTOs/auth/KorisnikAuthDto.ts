export class KorisnikAuthDto {
    public constructor(
        public id: number = 0,
        public username: string = '',
        public role: string = 'stanar'
    ) { }
}