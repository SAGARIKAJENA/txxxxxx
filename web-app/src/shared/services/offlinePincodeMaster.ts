import { POSTAL_CIRCLE_PREFIX_MAP } from './postalCirclePrefixes'

export interface OfflinePincodeEntry {
  pincode: string
  city: string
  district: string
  state: string
  areaLocality: string
  postOffices: string[]
}

export const CANONICAL_INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const

export type CanonicalIndianState = (typeof CANONICAL_INDIAN_STATES_AND_UTS)[number]

/**
 * Curated offline master dictionary of representative PIN codes across all Indian States, UTs,
 * major metros, IT corridors, and tier-2/3 hubs for offline resilience and zero-latency lookups.
 */
export const OFFLINE_PINCODE_MASTER: Record<string, OfflinePincodeEntry> = {
  // Metros & Major Tech Hubs
  '411001': {
    pincode: '411001',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    areaLocality: 'Shivajinagar / Camp',
    postOffices: ['Pune H.O', 'Shivajinagar S.O', 'Camp S.O', 'Deccan Gymkhana S.O'],
  },
  '411057': {
    pincode: '411057',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    areaLocality: 'Hinjawadi',
    postOffices: ['Hinjawadi S.O', 'Wakad B.O', 'Maan B.O'],
  },
  '400001': {
    pincode: '400001',
    city: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    areaLocality: 'Fort / Nariman Point',
    postOffices: ['Mumbai G.P.O', 'Fort S.O', 'Stock Exchange S.O'],
  },
  '400051': {
    pincode: '400051',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    areaLocality: 'Bandra Kurla Complex',
    postOffices: ['BKC S.O', 'Bandra East S.O'],
  },
  '110001': {
    pincode: '110001',
    city: 'New Delhi',
    district: 'Central Delhi',
    state: 'Delhi',
    areaLocality: 'Connaught Place',
    postOffices: ['New Delhi G.P.O', 'Connaught Place S.O', 'Baroda House S.O'],
  },
  '110016': {
    pincode: '110016',
    city: 'New Delhi',
    district: 'South Delhi',
    state: 'Delhi',
    areaLocality: 'Hauz Khas',
    postOffices: ['Hauz Khas S.O', 'IIT S.O', 'Green Park S.O'],
  },
  '560001': {
    pincode: '560001',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    areaLocality: 'MG Road / Cubbon Park',
    postOffices: ['Bengaluru G.P.O', 'Cubbon Road S.O', 'Raj Bhavan S.O'],
  },
  '560100': {
    pincode: '560100',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    areaLocality: 'Electronic City',
    postOffices: ['Electronic City S.O', 'Konappana Agrahara B.O'],
  },
  '500001': {
    pincode: '500001',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    areaLocality: 'Abids / Koti',
    postOffices: ['Hyderabad G.P.O', 'State Bank of India S.O'],
  },
  '500081': {
    pincode: '500081',
    city: 'Hyderabad',
    district: 'K.V.Rangareddy',
    state: 'Telangana',
    areaLocality: 'Madhapur / Hitec City',
    postOffices: ['Madhapur S.O', 'Cyberabad S.O'],
  },
  '600001': {
    pincode: '600001',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    areaLocality: 'George Town / Parrys',
    postOffices: ['Chennai G.P.O', 'Sowcarpet S.O', 'Mannady S.O'],
  },
  '600096': {
    pincode: '600096',
    city: 'Chennai',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    areaLocality: 'Perungudi / OMR',
    postOffices: ['Perungudi S.O', 'Kandanchavadi B.O'],
  },
  '700001': {
    pincode: '700001',
    city: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    areaLocality: 'BBD Bagh / Dalhousie',
    postOffices: ['Kolkata G.P.O', 'Lalbazar S.O', 'Reserve Bank S.O'],
  },
  '380001': {
    pincode: '380001',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    areaLocality: 'Bhadra / Lal Darwaja',
    postOffices: ['Ahmedabad G.P.O', 'Bhadra S.O'],
  },
  '302001': {
    pincode: '302001',
    city: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    areaLocality: 'Pink City / M.I Road',
    postOffices: ['Jaipur G.P.O', 'Ashok Nagar S.O'],
  },
  // All other States & Union Territories
  '744101': {
    pincode: '744101',
    city: 'Port Blair',
    district: 'South Andaman',
    state: 'Andaman and Nicobar Islands',
    areaLocality: 'Aberdeen Bazaar',
    postOffices: ['Port Blair H.O', 'Aberdeen Bazaar S.O', 'Dollygunj S.O'],
  },
  '520001': {
    pincode: '520001',
    city: 'Vijayawada',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    areaLocality: 'Governorpet',
    postOffices: ['Vijayawada H.O', 'Governorpet S.O'],
  },
  '791111': {
    pincode: '791111',
    city: 'Itanagar',
    district: 'Papum Pare',
    state: 'Arunachal Pradesh',
    areaLocality: 'Ganga Market',
    postOffices: ['Itanagar H.O', 'Naharlagun S.O'],
  },
  '781001': {
    pincode: '781001',
    city: 'Guwahati',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    areaLocality: 'Paltan Bazaar',
    postOffices: ['Guwahati G.P.O', 'Panbazar S.O'],
  },
  '800001': {
    pincode: '800001',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    areaLocality: 'Fraser Road',
    postOffices: ['Patna G.P.O', 'Bankipore S.O'],
  },
  '160017': {
    pincode: '160017',
    city: 'Chandigarh',
    district: 'Chandigarh',
    state: 'Chandigarh',
    areaLocality: 'Sector 17',
    postOffices: ['Sector 17 H.O', 'Sector 22 S.O'],
  },
  '492001': {
    pincode: '492001',
    city: 'Raipur',
    district: 'Raipur',
    state: 'Chhattisgarh',
    areaLocality: 'Jaistambh Chowk',
    postOffices: ['Raipur H.O', 'Pandri S.O'],
  },
  '396210': {
    pincode: '396210',
    city: 'Daman',
    district: 'Daman',
    state: 'Dadra and Nagar Haveli and Daman and Diu',
    areaLocality: 'Moti Daman',
    postOffices: ['Daman S.O', 'Nani Daman S.O'],
  },
  '403001': {
    pincode: '403001',
    city: 'Panaji',
    district: 'North Goa',
    state: 'Goa',
    areaLocality: 'Fontainhas',
    postOffices: ['Panaji H.O', 'Altinho S.O'],
  },
  '122001': {
    pincode: '122001',
    city: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    areaLocality: 'DLF Cyber City',
    postOffices: ['Gurgaon H.O', 'DLF QE S.O'],
  },
  '171001': {
    pincode: '171001',
    city: 'Shimla',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    areaLocality: 'The Mall',
    postOffices: ['Shimla G.P.O', 'Summer Hill S.O'],
  },
  '190001': {
    pincode: '190001',
    city: 'Srinagar',
    district: 'Srinagar',
    state: 'Jammu and Kashmir',
    areaLocality: 'Lal Chowk',
    postOffices: ['Srinagar G.P.O', 'Karan Nagar S.O'],
  },
  '834001': {
    pincode: '834001',
    city: 'Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    areaLocality: 'Main Road',
    postOffices: ['Ranchi G.P.O', 'Doranda S.O'],
  },
  '695001': {
    pincode: '695001',
    city: 'Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    areaLocality: 'Statue Junction',
    postOffices: ['Thiruvananthapuram G.P.O', 'Palayam S.O'],
  },
  '194101': {
    pincode: '194101',
    city: 'Leh',
    district: 'Leh',
    state: 'Ladakh',
    areaLocality: 'Main Market',
    postOffices: ['Leh H.O', 'Choglamsar B.O'],
  },
  '682555': {
    pincode: '682555',
    city: 'Kavaratti',
    district: 'Lakshadweep',
    state: 'Lakshadweep',
    areaLocality: 'Kavaratti Island',
    postOffices: ['Kavaratti S.O'],
  },
  '462001': {
    pincode: '462001',
    city: 'Bhopal',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    areaLocality: 'New Market / MP Nagar',
    postOffices: ['Bhopal G.P.O', 'T.T. Nagar S.O'],
  },
  '795001': {
    pincode: '795001',
    city: 'Imphal',
    district: 'Imphal West',
    state: 'Manipur',
    areaLocality: 'Thangal Bazar',
    postOffices: ['Imphal H.O'],
  },
  '793001': {
    pincode: '793001',
    city: 'Shillong',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    areaLocality: 'Police Bazar',
    postOffices: ['Shillong G.P.O', 'Laban S.O'],
  },
  '796001': {
    pincode: '796001',
    city: 'Aizawl',
    district: 'Aizawl',
    state: 'Mizoram',
    areaLocality: 'Zarkawt',
    postOffices: ['Aizawl H.O'],
  },
  '797001': {
    pincode: '797001',
    city: 'Kohima',
    district: 'Kohima',
    state: 'Nagaland',
    areaLocality: 'BOC',
    postOffices: ['Kohima H.O'],
  },
  '751001': {
    pincode: '751001',
    city: 'Bhubaneswar',
    district: 'Khordha',
    state: 'Odisha',
    areaLocality: 'Master Canteen / Saheed Nagar',
    postOffices: ['Bhubaneswar G.P.O', 'Saheed Nagar S.O'],
  },
  '605001': {
    pincode: '605001',
    city: 'Puducherry',
    district: 'Puducherry',
    state: 'Puducherry',
    areaLocality: 'White Town',
    postOffices: ['Pondicherry H.O'],
  },
  '141001': {
    pincode: '141001',
    city: 'Ludhiana',
    district: 'Ludhiana',
    state: 'Punjab',
    areaLocality: 'Clock Tower',
    postOffices: ['Ludhiana H.O'],
  },
  '737101': {
    pincode: '737101',
    city: 'Gangtok',
    district: 'East Sikkim',
    state: 'Sikkim',
    areaLocality: 'MG Marg',
    postOffices: ['Gangtok H.O'],
  },
  '799001': {
    pincode: '799001',
    city: 'Agartala',
    district: 'West Tripura',
    state: 'Tripura',
    areaLocality: 'Post Office Chowmuhani',
    postOffices: ['Agartala H.O'],
  },
  '226001': {
    pincode: '226001',
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    areaLocality: 'Hazratganj',
    postOffices: ['Lucknow G.P.O', 'Hazratganj S.O'],
  },
  '248001': {
    pincode: '248001',
    city: 'Dehradun',
    district: 'Dehradun',
    state: 'Uttarakhand',
    areaLocality: 'Rajpur Road',
    postOffices: ['Dehradun G.P.O'],
  },
  '201301': {
    pincode: '201301',
    city: 'Noida',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    areaLocality: 'Sector 16 / Film City',
    postOffices: ['Noida H.O', 'Sector 12 S.O'],
  },
  '508001': {
    pincode: '508001',
    city: 'Nalgonda',
    district: 'Nalgonda',
    state: 'Telangana',
    areaLocality: 'Clock Tower / Chityal Zone',
    postOffices: ['Nalgonda H.O', 'Clock Tower S.O'],
  },
}

/**
 * Functional lookup from offline master.
 * Rule 2: NO LOOPS. Pure functional lookup.
 */
export const lookupOfflinePincode = (pincode: string): OfflinePincodeEntry | null => {
  const digitsOnly = pincode.replace(/\D/g, '')
  if (digitsOnly.length !== 6) return null

  // 1. Direct exact match in master dictionary
  const directMatch = OFFLINE_PINCODE_MASTER[digitsOnly]
  if (directMatch) {
    return directMatch
  }

  // 2. Functional prefix lookup using 2-digit postal circle
  const prefix2 = digitsOnly.slice(0, 2)
  const circleMatch = POSTAL_CIRCLE_PREFIX_MAP[prefix2]
  if (circleMatch) {
    return {
      pincode: digitsOnly,
      city: circleMatch.defaultCity,
      district: circleMatch.defaultDistrict,
      state: circleMatch.state,
      areaLocality: '',
      postOffices: [circleMatch.defaultCity],
    }
  }

  return null
}

