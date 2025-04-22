type ObjectiveSection = {
    title: string;
    completion: number;
    content: string[];
};

type Credential = {
    overview: string;
    skills: string[];
    requirements: string;
    objectives: {
        questions: {
            amount: number;
            threshold: number;
        };
        timeMs: number;
        status: string;
        sections: ObjectiveSection[];
    };
    resources: {
        description: string;
        paths: string[];
    };
    info: {
        href: string;
        title: string;
        badge: string;
        general: {
            group: string;
            certificationStatus: string;
            code: string;
            replacesCode: string;
            replacedByCode: string;
        };
        languages: string[];
        priceUSD: number;
    };
};

export type { Credential };
