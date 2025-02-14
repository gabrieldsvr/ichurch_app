interface PeopleDTO {
    id: string;
    name: string;
    phone: string;
    instagram?: string;
    birthDate: Date;
    type: 'visitor' | 'regular_attendee' | 'member';
    parentName?: string;
    parentPhone?: string;
}
