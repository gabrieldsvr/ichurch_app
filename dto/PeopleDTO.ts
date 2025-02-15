interface PeopleDTO {
    id: string;
    name: string;
    phone: string;
    instagram?: string;
    birth_date: Date;
    type: 'visitor' | 'regular_attendee' | 'member';
    parentName?: string;
    parentPhone?: string;
}
