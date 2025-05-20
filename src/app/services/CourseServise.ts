export type Course = {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    slug: string;
    date: string;
  };
  
  export type CoursesDTO = {
    payload: Course[];
  };
  
  export const CourseService = {
    getAll: async (): Promise<CoursesDTO> => {
      return {
        payload: [
          {
            id: '1',
            title: 'TernKey version 1.0.0 – beta Tutorial',
            thumbnail: '/images/courses/ternkey1.png',
            duration: '07:41',
            slug: 'ternkey-beta-tutorial',
            date: 'Mar 22, 2025',
          },
          {
            id: '2',
            title: 'Advanced TernKey Usage',
            thumbnail: '/images/courses/ternkey-advanced.png',
            duration: '10:20',
            slug: 'ternkey-advanced',
            date: 'Apr 5, 2025',
          },
        ],
      };
    },
  };