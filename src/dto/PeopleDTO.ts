interface PeopleDTO {
    id: string;
    name: string;
    phone: string;
    instagram?: string;
    birth_date: Date;
    community_id: string;
    type: 'visitor' | 'regular_attendee' | 'member';
    parentName?: string;
    parentPhone?: string;
    photo?: string;
}
