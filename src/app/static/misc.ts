import {Invoice} from "@/app/types/billing";

// Misc
const LANGUAGE = {
    'EN': 'English',
    'FR': 'French',
}

const SALUTATION = {
    'MR': 'Mr.',
    'MS': 'Ms.',
}

// Address
const COUNTRY = {
    'US': 'United States of America',
    'CA': 'Canada',
    'GB': 'United Kingdom'
}

const STATE = {
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

type StateKey = keyof typeof STATE;

// Temp
const INVOICE_TEMPLATE: Invoice = {
    id: 111111111111,
    date: Date.now(),
    to: 'John Doe',
    from: 'Tern Systems, LLC',
    card: {cardNumber: '1111222233334444', type: 'visa', nickName: 'john doe'},
    item: {name: 'ARCH Standard Subscription', priceUSD: 10},
    subtotalUSD: 10,
    totalDue: 10.60,
    taxPercent: 0.06,
    paidUSD: 10.6,
    state: 'PA',
    type: 'monthly',
    status: 'paid'
}

export type {StateKey}
export {STATE, COUNTRY, INVOICE_TEMPLATE, LANGUAGE, SALUTATION}