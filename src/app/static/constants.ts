import {Plan} from "@/app/static/types";

import SVG_DIAMOND_ACE from "@/assets/images/icons/diamond-ace.svg";
import SVG_DIAMOND from "@/assets/images/icons/diamond.svg";

const COUNTRIES: Record<string, string> = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom'
}
const STATES: Record<string, string> = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode',
    'SC': 'South',
    'SD': 'South',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
}


const PLAN: Plan = {
    standard: {
        icon: SVG_DIAMOND_ACE,
        priceUSD: {monthly: 10, annual: 8},
        benefits: [
            'Create and manage one AR code',
            '100 scans per month',
            'Detailed scan analytics',
            'Custom personalization features',
            'Data import and export',
        ]
    },
    pro: {
        icon: SVG_DIAMOND,
        priceUSD: {monthly: 50, annual: 40},
        benefits: [
            'Manage up to 5 AR codes',
            '1,000 scans per month',
            'AR code design customization',
            'Video support up to 30 seconds',
            'Access to dedicated support team'
        ]
    }
}

export {STATES, COUNTRIES, PLAN}