export interface Course {
    id: number;
    title: string;
    instructor: string;
    level: string;
    rating: number;
    reviews: number;
    duration: string;
    lessons: number;
    price: number | 'Free';
    image: string;
    tags?: string[];
    category: string;
}

export interface FilterState {
    search: string;
    levels: string[];
    topics: string[];
    skills: string[];
    sort: 'popular' | 'newest' | 'price-low' | 'price-high';
}

export type ProficiencyLevel = 'A1 - Beginner' | 'A2 - Elementary' | 'B1 - Intermediate' | 'B2 - Upper Intermediate' | 'C1 - Advanced';

export type Topic = 'Business English' | 'Academic Preparation' | 'Travel & Culture' | 'Exam Prep (IELTS/TOEFL)';

export type SkillFocus = 'Grammar' | 'Speaking' | 'Listening' | 'Writing' | 'Vocabulary';
