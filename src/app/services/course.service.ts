import axios, { AxiosRequestConfig } from 'axios';

import { Res } from '@/app/types/service';
import { Course } from '@/app/types/blog'; // TODO: change

import { BaseService } from './base.service';

type CoursesDTO = {
    popular: Course[];
    featured: Course[];
    free: Course[];
    premium: Course[];
    library: Course[];
    next: Course[];
};

const CACHED_ARTICLE_COUNT = 5;
const COURSES: Course[] = [
    {
        series: 'BTMC',
        id: '98fg45r3s0j3----',
        thumbnail: '',
        title: 'Step-by-Step: How to Setup your Tern Account for 2FA',
        video: '',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        date: Date.now(),
        duration: '11:34',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'BTMC',
        id: '98254gf0j3----',
        thumbnail: '',
        date: Date.now(),
        title: 'The 5 biggest AI adoption challenges for 2025',
        video: '',
        description: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'G',
        id: '98f02f3fj3----',
        thumbnail: '',
        date: Date.now(),
        title: 'Here we discuss what benefits are enabled by switching from conventional computers to ours.',
        video: '',
        description: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'G',
        id: '98f0j53g34f324----',
        thumbnail: '',
        date: Date.now(),
        title: 'The World’s Most Efficient Computer',
        video: '',
        description: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'G',
        id: '98f0aasdasdergj3----',
        thumbnail: '',
        date: Date.now(),
        description: 'Soe useful thing6',
        title: 'The World’s Most Efficient Computer',
        video: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'Tidal',
        id: '98f0agasdasfdsj3----',
        thumbnail: '',
        date: Date.now(),
        description: 'Soe useful thing5',
        title: 'The World’s Most Efficient Computer',
        video: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'BTMC',
        id: '98asdaf0j3----',
        thumbnail: '',
        date: Date.now(),
        description: 'Soe useful thing4',
        title: 'Most Efficient Computer',
        video: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'Tidal',
        id: '98f0hgjs3----',
        thumbnail: '',
        date: Date.now(),
        description: 'Soe useful thing3',
        title: 'The 5 biggest AI adoption challenges for 2025',
        video: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'Tidal',
        id: '98f0js3f----',
        thumbnail: '',
        date: Date.now(),
        description: 'Soe useful thing2',
        title: 'The 5 biggest AI adoption challenges for 2025',
        video: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'BTMC',
        id: '98f0ja3---s-',
        thumbnail: '',
        date: Date.now(),
        description: 'Soe useful thing1',
        title: 'The 5 biggest AI adoption challenges for 2025',
        video: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'BTMC',
        id: '98f0ja3---s-',
        thumbnail: '',
        date: Date.now(),
        description: 'Soe useful thing1',
        title: 'The 5 biggest AI adoption challenges for 2025',
        video: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
    {
        series: 'BTMC',
        id: '98f0ja3---s-',
        thumbnail: null,
        date: Date.now(),
        description: 'Soe useful thing1',
        title: 'The 5 biggest AI adoption challenges for 2025',
        video: '',
        duration: '11:52',
        author: {
            name: 'Tern Support',
            image: null,
            position: 'Support Engineer',
        },
    },
];

const GENERATED: Course[] = Array.from({ length: 200 }).map((_, i) => ({
    series: 'BTMC',
    id: '98f0ja3---s-',
    thumbnail: null,
    date: Date.now(),
    description: 'Soe useful thing1',
    title: `Course ${i}`,
    video: '',
    duration: '11:52',
    author: {
        name: 'Tern Support',
        image: null,
        position: 'Support Engineer',
    },
}));

const COURSES_TEMPLATE = COURSES.concat(GENERATED);

const COURSES_DTO_TEMPLATE: CoursesDTO = {
    popular: COURSES_TEMPLATE.slice(0, 3),
    featured: COURSES_TEMPLATE.slice(0, 4),
    free: COURSES_TEMPLATE,
    premium: COURSES_TEMPLATE,
    library: [...GENERATED],
    next: COURSES_TEMPLATE,
};

interface ICourseService {
    getCourses(): Promise<Res<CoursesDTO, false>>;
    getTotalCourses(): Promise<number>;
}

class CourseServiceImpl extends BaseService implements ICourseService {
    constructor() {
        super(CourseServiceImpl.name);
    }

    // TODO count param
    async getCourses(): Promise<Res<CoursesDTO, false>> {
        // const config: AxiosRequestConfig = {
        //     method: 'GET',
        //     url: this._API + `get-courses`,
        //     withCredentials: true,
        // };
        // const { payload } = await this.req<CoursesDTO, false>(this.getCourses.name, config, (data) => [
        //     !data.library?.length || typeof data.library[0].id === 'string',
        // ]);

        // localStorage.setItem('course-cards', JSON.stringify(payload.library.slice(0, CACHED_ARTICLE_COUNT)));

        return { payload: COURSES_DTO_TEMPLATE };

        // return { payload };
    }

    async getTotalCourses(): Promise<number> {
        const { payload } = await this.getCourses();
        return payload.library.length;
    }
}

const CourseService = new CourseServiceImpl();

export type { CoursesDTO };
export { CourseService };
