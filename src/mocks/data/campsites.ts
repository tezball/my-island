import type { Campsite, Extra } from '@/types'

const handCraftedCampsites: Campsite[] = [
  // CONNEMARA & GALWAY
  {
    id: '1',
    name: 'Eagle Point Camping',
    location: 'Ballyconneely, Co. Galway',
    coordinates: { lat: 53.4556, lng: -9.8986 },
    pricePerNight: 28,
    rating: 4.9,
    reviewCount: 347,
    description: 'Award-winning campsite on the shores of Mannin Bay with panoramic views of the Twelve Bens. Direct beach access, stunning sunsets, and the warmest hospitality in the West. Featured in Irish Times "Best Campsites 2024".',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
      'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'pets', name: 'Pet Friendly', icon: 'pets' },
      { id: 'power', name: 'Electric Hookup', icon: 'bolt' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
      { id: 'parking', name: 'Free Parking', icon: 'local_parking' },
      { id: 'shop', name: 'Camp Shop', icon: 'store' },
      { id: 'laundry', name: 'Laundry', icon: 'local_laundry_service' },
    ],
    lots: [
      { id: 'lot1', name: 'Oceanfront Premium', type: 'tent', maxGuests: 4, size: '8m x 8m', pricePerNight: 38 },
      { id: 'lot2', name: 'Bay View Standard', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 28 },
      { id: 'lot3', name: 'Family Pitch XL', type: 'tent', maxGuests: 8, size: '10m x 10m', pricePerNight: 45 },
      { id: 'lot4', name: 'Campervan Bay', type: 'rv', maxGuests: 4, size: '10m x 4m', pricePerNight: 35 },
    ],
    suppliers: [
      { id: 's1', name: "O'Malley's Farm Shop", category: 'food', distance: '1.2 km', alertsEnabled: true },
      { id: 's2', name: 'Connemara Wild Escapes', category: 'activity', distance: '0.3 km', alertsEnabled: true },
      { id: 's3', name: 'Atlantic Kayaks', category: 'activity', distance: '0.5 km', alertsEnabled: false },
    ],
    isSuperhost: true,
    type: 'tent',
  },
  {
    id: '2',
    name: 'Clifden Eco Beach Camping',
    location: 'Clifden, Co. Galway',
    coordinates: { lat: 53.4879, lng: -10.0200 },
    pricePerNight: 32,
    rating: 4.8,
    reviewCount: 218,
    description: 'Sustainable camping at its finest. Solar-powered facilities, composting toilets, and wild swimming in crystal-clear Atlantic waters. Perfect base for the Sky Road drive.',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Solar Showers', icon: 'shower' },
      { id: 'eco', name: 'Eco Certified', icon: 'eco' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
      { id: 'swim', name: 'Wild Swimming', icon: 'pool' },
    ],
    lots: [
      { id: 'lot1', name: 'Eco Pod', type: 'glamping', maxGuests: 2, size: '4m diameter', pricePerNight: 65 },
      { id: 'lot2', name: 'Wild Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 32 },
      { id: 'lot3', name: 'Dune Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 28 },
    ],
    suppliers: [
      { id: 's4', name: 'Clifden Farmers Market', category: 'food', distance: '2.1 km', alertsEnabled: false },
    ],
    isSuperhost: true,
    type: 'glamping',
  },
  {
    id: '3',
    name: "Paddy's Point RV Park",
    location: 'Roundstone, Co. Galway',
    coordinates: { lat: 53.3942, lng: -9.9208 },
    pricePerNight: 38,
    rating: 4.7,
    reviewCount: 156,
    description: 'Purpose-built RV park with full hookups and stunning views of Roundstone Harbour. Walking distance to award-winning seafood restaurants and traditional pubs with live music.',
    imageUrl: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
    images: [
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'High-Speed WiFi', icon: 'wifi' },
      { id: 'power', name: 'Full Hookups', icon: 'bolt' },
      { id: 'dump', name: 'Dump Station', icon: 'delete' },
      { id: 'laundry', name: 'Laundry Room', icon: 'local_laundry_service' },
      { id: 'tv', name: 'TV Lounge', icon: 'tv' },
      { id: 'parking', name: 'Large Bays', icon: 'local_parking' },
    ],
    lots: [
      { id: 'lot1', name: 'Harbour View Premium', type: 'rv', maxGuests: 6, size: '12m x 5m', pricePerNight: 48 },
      { id: 'lot2', name: 'Standard RV Bay', type: 'rv', maxGuests: 4, size: '10m x 4m', pricePerNight: 38 },
      { id: 'lot3', name: 'Budget Bay', type: 'rv', maxGuests: 4, size: '8m x 4m', pricePerNight: 28 },
    ],
    suppliers: [
      { id: 's5', name: "O'Dowd's Seafood Bar", category: 'food', distance: '0.4 km', alertsEnabled: true },
    ],
    isSuperhost: false,
    type: 'rv',
  },

  // KERRY - WILD ATLANTIC WAY
  {
    id: '4',
    name: 'Dingle Bay Hideaway',
    location: 'Dingle, Co. Kerry',
    coordinates: { lat: 52.1409, lng: -10.2671 },
    pricePerNight: 35,
    rating: 4.9,
    reviewCount: 412,
    description: 'Intimate family-run campsite on the world-famous Dingle Peninsula. Wake to dolphin sightings, explore ancient beehive huts, and enjoy the best trad music sessions in Ireland.',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
    images: [
      'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
      'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'pets', name: 'Dog Friendly', icon: 'pets' },
      { id: 'kitchen', name: 'Camp Kitchen', icon: 'kitchen' },
      { id: 'fire', name: 'Communal Fire', icon: 'local_fire_department' },
      { id: 'bbq', name: 'BBQ Area', icon: 'outdoor_grill' },
    ],
    lots: [
      { id: 'lot1', name: 'Fungie View', type: 'tent', maxGuests: 4, size: '7m x 7m', pricePerNight: 42 },
      { id: 'lot2', name: 'Peninsula Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 35 },
      { id: 'lot3', name: 'Cosy Corner', type: 'tent', maxGuests: 2, size: '4m x 4m', pricePerNight: 25 },
    ],
    suppliers: [
      { id: 's6', name: 'Dingle Seafood Company', category: 'food', distance: '1.5 km', alertsEnabled: true },
      { id: 's7', name: 'Fungi Boat Tours', category: 'activity', distance: '2.0 km', alertsEnabled: false },
      { id: 's8', name: 'Dingle Surf School', category: 'activity', distance: '3.2 km', alertsEnabled: true },
    ],
    isSuperhost: true,
    type: 'tent',
  },
  {
    id: '5',
    name: 'Ring of Kerry Glamping',
    location: 'Kenmare, Co. Kerry',
    coordinates: { lat: 51.8806, lng: -9.5833 },
    pricePerNight: 89,
    rating: 4.9,
    reviewCount: 287,
    description: 'Luxury safari tents with wood-burning stoves, king-size beds, and private decks overlooking Kenmare Bay. Award-winning restaurant on-site. Pure indulgence in nature.',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Premium WiFi', icon: 'wifi' },
      { id: 'shower', name: 'En-suite Bathroom', icon: 'shower' },
      { id: 'kitchen', name: 'Kitchenette', icon: 'kitchen' },
      { id: 'restaurant', name: 'Restaurant', icon: 'restaurant' },
      { id: 'spa', name: 'Wellness Spa', icon: 'spa' },
      { id: 'heating', name: 'Wood Stove', icon: 'fireplace' },
    ],
    lots: [
      { id: 'lot1', name: 'Safari Suite', type: 'glamping', maxGuests: 2, size: '35sqm', pricePerNight: 145 },
      { id: 'lot2', name: 'Forest Lodge', type: 'glamping', maxGuests: 4, size: '45sqm', pricePerNight: 175 },
      { id: 'lot3', name: 'Bay View Tent', type: 'glamping', maxGuests: 2, size: '28sqm', pricePerNight: 89 },
    ],
    suppliers: [
      { id: 's9', name: 'Kenmare Foodie Tours', category: 'food', distance: '2.5 km', alertsEnabled: true },
    ],
    isSuperhost: true,
    type: 'glamping',
  },
  {
    id: '6',
    name: 'Killarney Lakeside Camp',
    location: 'Killarney, Co. Kerry',
    coordinates: { lat: 52.0598, lng: -9.5044 },
    pricePerNight: 30,
    rating: 4.8,
    reviewCount: 523,
    description: 'Gateway to Killarney National Park. Cycle the Gap of Dunloe, hike Torc Waterfall, and spot red deer from your tent. Jaunting car tours arranged on-site.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'bikes', name: 'Bike Rental', icon: 'directions_bike' },
      { id: 'kayak', name: 'Kayak Hire', icon: 'kayaking' },
      { id: 'shop', name: 'Camp Store', icon: 'store' },
      { id: 'power', name: 'Some Electric', icon: 'bolt' },
    ],
    lots: [
      { id: 'lot1', name: 'Lakefront Deluxe', type: 'tent', maxGuests: 4, size: '8m x 8m', pricePerNight: 45 },
      { id: 'lot2', name: 'Woodland Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 30 },
      { id: 'lot3', name: 'Family Zone', type: 'tent', maxGuests: 8, size: '10m x 10m', pricePerNight: 55 },
      { id: 'lot4', name: 'Backpacker Spot', type: 'tent', maxGuests: 2, size: '4m x 4m', pricePerNight: 18 },
    ],
    suppliers: [
      { id: 's10', name: 'Killarney Jaunting Cars', category: 'activity', distance: '1.0 km', alertsEnabled: true },
      { id: 's11', name: "Murphy's Ice Cream", category: 'food', distance: '3.5 km', alertsEnabled: false },
    ],
    isSuperhost: true,
    type: 'tent',
  },

  // CLARE - BURREN & CLIFFS
  {
    id: '7',
    name: 'Cliffs of Moher Camping',
    location: 'Doolin, Co. Clare',
    coordinates: { lat: 52.9719, lng: -9.4265 },
    pricePerNight: 32,
    rating: 4.7,
    reviewCount: 389,
    description: 'Camp within walking distance of Ireland\'s most iconic cliffs. Nightly trad sessions in Doolin village, Aran Islands ferry nearby, and unforgettable Atlantic sunsets.',
    imageUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800',
    images: [
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
      { id: 'parking', name: 'Free Parking', icon: 'local_parking' },
      { id: 'shop', name: 'Small Shop', icon: 'store' },
    ],
    lots: [
      { id: 'lot1', name: 'Cliff View Premium', type: 'tent', maxGuests: 4, size: '7m x 7m', pricePerNight: 42 },
      { id: 'lot2', name: 'Village Side', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 32 },
      { id: 'lot3', name: 'Solo Traveller', type: 'tent', maxGuests: 1, size: '3m x 3m', pricePerNight: 18 },
    ],
    suppliers: [
      { id: 's12', name: 'Doolin Ferry Co', category: 'activity', distance: '0.8 km', alertsEnabled: true },
      { id: 's13', name: "Gus O'Connor's Pub", category: 'food', distance: '0.5 km', alertsEnabled: false },
    ],
    isSuperhost: false,
    type: 'tent',
  },
  {
    id: '8',
    name: 'Burren Basecamp',
    location: 'Ballyvaughan, Co. Clare',
    coordinates: { lat: 53.1167, lng: -9.1500 },
    pricePerNight: 28,
    rating: 4.8,
    reviewCount: 198,
    description: 'Explore the lunar landscape of the Burren from this peaceful retreat. Rare wildflowers, ancient dolmens, and dark skies perfect for stargazing. Geology walks available.',
    imageUrl: 'https://images.unsplash.com/photo-1487730116445-500c8a39a746?w=800',
    images: [
      'https://images.unsplash.com/photo-1487730116445-500c8a39a746?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Basic WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Showers', icon: 'shower' },
      { id: 'fire', name: 'Campfires OK', icon: 'local_fire_department' },
      { id: 'dark', name: 'Dark Sky Site', icon: 'nights_stay' },
    ],
    lots: [
      { id: 'lot1', name: 'Stargazer Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 32 },
      { id: 'lot2', name: 'Limestone View', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 28 },
    ],
    suppliers: [
      { id: 's14', name: 'Burren Nature Walks', category: 'activity', distance: '1.5 km', alertsEnabled: true },
    ],
    isSuperhost: true,
    type: 'tent',
  },

  // WICKLOW - GARDEN OF IRELAND
  {
    id: '9',
    name: 'Glendalough Forest Retreat',
    location: 'Glendalough, Co. Wicklow',
    coordinates: { lat: 53.0094, lng: -6.3277 },
    pricePerNight: 45,
    rating: 4.9,
    reviewCount: 567,
    description: 'Ancient monastic site meets modern glamping. Bell tents and treehouses in a mystical valley. Hiking, history, and healing in Ireland\'s spiritual heartland.',
    imageUrl: 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800',
    images: [
      'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Luxury Showers', icon: 'shower' },
      { id: 'kitchen', name: 'Communal Kitchen', icon: 'kitchen' },
      { id: 'yoga', name: 'Yoga Deck', icon: 'self_improvement' },
      { id: 'cafe', name: 'On-site Café', icon: 'local_cafe' },
    ],
    lots: [
      { id: 'lot1', name: 'Treehouse Suite', type: 'cabin', maxGuests: 2, size: '20sqm', pricePerNight: 125 },
      { id: 'lot2', name: 'Bell Tent Deluxe', type: 'glamping', maxGuests: 4, size: '5m diameter', pricePerNight: 85 },
      { id: 'lot3', name: 'Forest Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 45 },
      { id: 'lot4', name: 'Monks Walk Pitch', type: 'tent', maxGuests: 2, size: '4m x 4m', pricePerNight: 35 },
    ],
    suppliers: [
      { id: 's15', name: 'Wicklow Way Guides', category: 'activity', distance: '0.5 km', alertsEnabled: true },
      { id: 's16', name: 'Glendalough Hotel', category: 'food', distance: '0.3 km', alertsEnabled: false },
    ],
    isSuperhost: true,
    type: 'glamping',
  },
  {
    id: '10',
    name: 'Powerscourt Wild Camp',
    location: 'Enniskerry, Co. Wicklow',
    coordinates: { lat: 53.1847, lng: -6.1872 },
    pricePerNight: 38,
    rating: 4.6,
    reviewCount: 234,
    description: 'Hidden gem near Powerscourt Waterfall. Minimal impact camping for nature lovers. Wake to birdsong, hike to the highest waterfall in Ireland, perfect weekend escape from Dublin.',
    imageUrl: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800',
    images: [
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800',
    ],
    facilities: [
      { id: 'shower', name: 'Solar Showers', icon: 'shower' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
      { id: 'eco', name: 'Leave No Trace', icon: 'eco' },
    ],
    lots: [
      { id: 'lot1', name: 'Waterfall View', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 45 },
      { id: 'lot2', name: 'Woodland Hideaway', type: 'tent', maxGuests: 2, size: '4m x 4m', pricePerNight: 38 },
    ],
    suppliers: [],
    isSuperhost: false,
    type: 'tent',
  },

  // CORK
  {
    id: '11',
    name: 'Beara Peninsula Retreat',
    location: 'Castletownbere, Co. Cork',
    coordinates: { lat: 51.6500, lng: -9.9167 },
    pricePerNight: 25,
    rating: 4.8,
    reviewCount: 178,
    description: 'Off-the-beaten-track paradise on the wild Beara Peninsula. Fishing villages, copper mines, and Ireland\'s only cable car to Dursey Island. True Wild Atlantic Way.',
    imageUrl: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800',
    images: [
      'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Basic WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Showers', icon: 'shower' },
      { id: 'pets', name: 'Pet Friendly', icon: 'pets' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
    ],
    lots: [
      { id: 'lot1', name: 'Atlantic View', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 30 },
      { id: 'lot2', name: 'Sheltered Cove', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 25 },
    ],
    suppliers: [
      { id: 's17', name: 'Beara Charters', category: 'activity', distance: '2.0 km', alertsEnabled: true },
    ],
    isSuperhost: true,
    type: 'tent',
  },
  {
    id: '12',
    name: 'Kinsale Harbour Camping',
    location: 'Kinsale, Co. Cork',
    coordinates: { lat: 51.7060, lng: -8.5225 },
    pricePerNight: 35,
    rating: 4.7,
    reviewCount: 312,
    description: 'Gourmet capital of Ireland meets camping. Harbour views, excellent restaurants, and rich maritime history. Charles Fort and whale watching nearby.',
    imageUrl: 'https://images.unsplash.com/photo-1534187886935-1e1236e856c3?w=800',
    images: [
      'https://images.unsplash.com/photo-1534187886935-1e1236e856c3?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'power', name: 'Electric Hookups', icon: 'bolt' },
      { id: 'shop', name: 'Camp Shop', icon: 'store' },
    ],
    lots: [
      { id: 'lot1', name: 'Harbour View', type: 'tent', maxGuests: 4, size: '7m x 7m', pricePerNight: 42 },
      { id: 'lot2', name: 'Town Side', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 35 },
      { id: 'lot3', name: 'Campervan Spot', type: 'rv', maxGuests: 4, size: '10m x 4m', pricePerNight: 40 },
    ],
    suppliers: [
      { id: 's18', name: 'Fishy Fishy Restaurant', category: 'food', distance: '1.2 km', alertsEnabled: true },
      { id: 's19', name: 'Kinsale Whale Watch', category: 'activity', distance: '0.8 km', alertsEnabled: true },
    ],
    isSuperhost: false,
    type: 'tent',
  },

  // DONEGAL - NORTHWEST
  {
    id: '13',
    name: 'Slieve League Camping',
    location: 'Carrick, Co. Donegal',
    coordinates: { lat: 54.6333, lng: -8.6833 },
    pricePerNight: 22,
    rating: 4.9,
    reviewCount: 234,
    description: 'Europe\'s highest sea cliffs on your doorstep. Remote, rugged, and utterly magical. Gaeltacht area with traditional Irish culture alive and well.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    ],
    facilities: [
      { id: 'shower', name: 'Showers', icon: 'shower' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
      { id: 'pets', name: 'Dogs Welcome', icon: 'pets' },
    ],
    lots: [
      { id: 'lot1', name: 'Cliff Top Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 28 },
      { id: 'lot2', name: 'Valley Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 22 },
    ],
    suppliers: [
      { id: 's20', name: 'Slieve League Boat Tours', category: 'activity', distance: '3.0 km', alertsEnabled: true },
    ],
    isSuperhost: true,
    type: 'tent',
  },
  {
    id: '14',
    name: 'Fanad Lighthouse Camp',
    location: 'Fanad Head, Co. Donegal',
    coordinates: { lat: 55.2756, lng: -7.6339 },
    pricePerNight: 28,
    rating: 4.8,
    reviewCount: 167,
    description: 'Camp beside one of the world\'s most beautiful lighthouses. Northern Lights viewing in winter, midnight sun in summer. Truly wild Donegal.',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
    images: [
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Basic WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Showers', icon: 'shower' },
      { id: 'dark', name: 'Dark Sky Site', icon: 'nights_stay' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
    ],
    lots: [
      { id: 'lot1', name: 'Lighthouse View', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 35 },
      { id: 'lot2', name: 'Aurora Pitch', type: 'tent', maxGuests: 2, size: '4m x 4m', pricePerNight: 28 },
    ],
    suppliers: [],
    isSuperhost: true,
    type: 'tent',
  },
  {
    id: '15',
    name: 'Bundoran Surf Camp',
    location: 'Bundoran, Co. Donegal',
    coordinates: { lat: 54.4767, lng: -8.2822 },
    pricePerNight: 30,
    rating: 4.6,
    reviewCount: 445,
    description: 'Ireland\'s surf capital! Beginner to pro waves, vibrant surf culture, and legendary nightlife. Surf lessons and board hire on-site.',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'surf', name: 'Surf Lessons', icon: 'surfing' },
      { id: 'boards', name: 'Board Rental', icon: 'surfing' },
      { id: 'bar', name: 'Beach Bar', icon: 'local_bar' },
    ],
    lots: [
      { id: 'lot1', name: 'Peak View', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 38 },
      { id: 'lot2', name: 'Surf Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 30 },
      { id: 'lot3', name: 'Van Life Spot', type: 'rv', maxGuests: 2, size: '8m x 3m', pricePerNight: 28 },
    ],
    suppliers: [
      { id: 's21', name: 'Bundoran Surf Co', category: 'activity', distance: '0.2 km', alertsEnabled: true },
      { id: 's22', name: 'The Surfer Bar', category: 'food', distance: '0.3 km', alertsEnabled: false },
    ],
    isSuperhost: false,
    type: 'tent',
  },

  // MAYO
  {
    id: '16',
    name: 'Achill Island Adventures',
    location: 'Achill Island, Co. Mayo',
    coordinates: { lat: 53.9500, lng: -10.0667 },
    pricePerNight: 26,
    rating: 4.8,
    reviewCount: 298,
    description: 'Ireland\'s largest island offers Atlantic driving, deserted beaches, and the famous Deserted Village. Perfect for adventure seekers and peace lovers alike.',
    imageUrl: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=800',
    images: [
      'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'pets', name: 'Pet Friendly', icon: 'pets' },
      { id: 'kayak', name: 'Sea Kayaking', icon: 'kayaking' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
    ],
    lots: [
      { id: 'lot1', name: 'Keem Bay View', type: 'tent', maxGuests: 4, size: '7m x 7m', pricePerNight: 35 },
      { id: 'lot2', name: 'Atlantic Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 26 },
      { id: 'lot3', name: 'Budget Backpacker', type: 'tent', maxGuests: 2, size: '4m x 4m', pricePerNight: 18 },
    ],
    suppliers: [
      { id: 's23', name: 'Achill Outdoor Centre', category: 'activity', distance: '2.5 km', alertsEnabled: true },
      { id: 's24', name: 'The Beehive', category: 'food', distance: '1.8 km', alertsEnabled: true },
    ],
    isSuperhost: true,
    type: 'tent',
  },
  {
    id: '17',
    name: 'Croagh Patrick Basecamp',
    location: 'Westport, Co. Mayo',
    coordinates: { lat: 53.8003, lng: -9.5167 },
    pricePerNight: 32,
    rating: 4.7,
    reviewCount: 423,
    description: 'Start your pilgrimage from our doorstep. Ireland\'s holy mountain rises above you. Charming Westport town nearby with award-winning pubs and restaurants.',
    imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
    images: [
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'power', name: 'Electric Points', icon: 'bolt' },
      { id: 'shop', name: 'Camp Shop', icon: 'store' },
      { id: 'laundry', name: 'Laundry', icon: 'local_laundry_service' },
    ],
    lots: [
      { id: 'lot1', name: 'Reek View Premium', type: 'tent', maxGuests: 4, size: '8m x 8m', pricePerNight: 42 },
      { id: 'lot2', name: 'Standard Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 32 },
      { id: 'lot3', name: 'Motorhome Bay', type: 'rv', maxGuests: 4, size: '10m x 4m', pricePerNight: 38 },
    ],
    suppliers: [
      { id: 's25', name: "Matt Molloy's Pub", category: 'food', distance: '3.5 km', alertsEnabled: false },
      { id: 's26', name: 'Croagh Patrick Guides', category: 'activity', distance: '0.5 km', alertsEnabled: true },
    ],
    isSuperhost: false,
    type: 'tent',
  },

  // SLIGO
  {
    id: '18',
    name: "Yeats Country Camping",
    location: 'Drumcliffe, Co. Sligo',
    coordinates: { lat: 54.3269, lng: -8.4983 },
    pricePerNight: 24,
    rating: 4.7,
    reviewCount: 189,
    description: 'Under bare Ben Bulben\'s head, camp where Yeats found his inspiration. Literary heritage meets outdoor adventure in one of Ireland\'s most scenic counties.',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
    images: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Showers', icon: 'shower' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
      { id: 'pets', name: 'Pet Friendly', icon: 'pets' },
    ],
    lots: [
      { id: 'lot1', name: 'Ben Bulben View', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 30 },
      { id: 'lot2', name: 'Poets Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 24 },
    ],
    suppliers: [
      { id: 's27', name: 'Yeats Grave Tours', category: 'activity', distance: '0.3 km', alertsEnabled: false },
    ],
    isSuperhost: true,
    type: 'tent',
  },
  {
    id: '19',
    name: 'Mullaghmore Head Camp',
    location: 'Mullaghmore, Co. Sligo',
    coordinates: { lat: 54.4667, lng: -8.4500 },
    pricePerNight: 28,
    rating: 4.6,
    reviewCount: 156,
    description: 'Big wave surf spot meets family camping. Watch pros tackle monster waves or enjoy the sheltered harbour beach. Classiebawn Castle views included.',
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
    images: [
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Showers', icon: 'shower' },
      { id: 'surf', name: 'Surf Watching', icon: 'surfing' },
    ],
    lots: [
      { id: 'lot1', name: 'Headland Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 32 },
      { id: 'lot2', name: 'Harbour View', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 28 },
    ],
    suppliers: [],
    isSuperhost: false,
    type: 'tent',
  },

  // WEXFORD & WATERFORD
  {
    id: '20',
    name: 'Hook Head Lighthouse Camp',
    location: 'Hook Head, Co. Wexford',
    coordinates: { lat: 52.1239, lng: -6.9297 },
    pricePerNight: 30,
    rating: 4.8,
    reviewCount: 267,
    description: 'Camp beside the world\'s oldest working lighthouse. Whale watching, fossil hunting, and the most spectacular sunsets on Ireland\'s Ancient East.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800',
    ],
    facilities: [
      { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
      { id: 'shower', name: 'Hot Showers', icon: 'shower' },
      { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
      { id: 'shop', name: 'Small Shop', icon: 'store' },
    ],
    lots: [
      { id: 'lot1', name: 'Lighthouse View', type: 'tent', maxGuests: 4, size: '7m x 7m', pricePerNight: 38 },
      { id: 'lot2', name: 'Coastal Pitch', type: 'tent', maxGuests: 4, size: '6m x 6m', pricePerNight: 30 },
    ],
    suppliers: [
      { id: 's28', name: 'Hook Lighthouse Tours', category: 'activity', distance: '0.5 km', alertsEnabled: true },
    ],
    isSuperhost: true,
    type: 'tent',
  },
]

export const mockExtras: Extra[] = [
  { id: 'kayak', name: 'Kayak Rental', description: 'Single kayak for the day', price: 25, icon: 'kayaking' },
  { id: 'bbq', name: 'BBQ Kit', description: 'Charcoal, tools, and cleaning supplies', price: 15, icon: 'outdoor_grill' },
  { id: 'firewood', name: 'Firewood Bundle', description: 'Seasoned hardwood for campfire', price: 12, icon: 'local_fire_department' },
  { id: 'breakfast', name: 'Breakfast Basket', description: 'Local eggs, bread, butter, jam, coffee', price: 22, icon: 'egg_alt' },
  { id: 'bike', name: 'Bike Rental', description: 'Mountain bike for the day', price: 20, icon: 'directions_bike' },
  { id: 'surfboard', name: 'Surfboard Hire', description: 'Foam or fibreglass board', price: 30, icon: 'surfing' },
  { id: 'wetsuit', name: 'Wetsuit Hire', description: '4/3mm full wetsuit', price: 15, icon: 'scuba_diving' },
  { id: 'fishing', name: 'Fishing Rod Set', description: 'Rod, reel, tackle, and bait', price: 18, icon: 'phishing' },
  { id: 'stargazing', name: 'Stargazing Kit', description: 'Telescope, star map, and hot chocolate', price: 35, icon: 'nights_stay' },
  { id: 'picnic', name: 'Gourmet Picnic', description: 'Local cheeses, meats, bread, and wine', price: 45, icon: 'lunch_dining' },
  { id: 'marshmallow', name: 'S\'mores Pack', description: 'Marshmallows, chocolate, and biscuits', price: 8, icon: 'cookie' },
  { id: 'games', name: 'Games Bundle', description: 'Frisbee, football, and card games', price: 10, icon: 'sports_soccer' },
]

// ============================================
// CAMPSITE GENERATOR - 100 Additional Sites
// ============================================

// Seeded random number generator for reproducible results
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

// Data pools for generation
const locationData = [
  { town: 'Letterfrack', county: 'Galway', lat: 53.5521, lng: -9.9468 },
  { town: 'Leenane', county: 'Galway', lat: 53.5969, lng: -9.7281 },
  { town: 'Oughterard', county: 'Galway', lat: 53.4333, lng: -9.3167 },
  { town: 'Carna', county: 'Galway', lat: 53.3167, lng: -9.8500 },
  { town: 'Spiddal', county: 'Galway', lat: 53.2439, lng: -9.3056 },
  { town: 'Waterville', county: 'Kerry', lat: 51.8292, lng: -10.1747 },
  { town: 'Cahersiveen', county: 'Kerry', lat: 51.9489, lng: -10.2222 },
  { town: 'Sneem', county: 'Kerry', lat: 51.8306, lng: -9.8972 },
  { town: 'Portmagee', county: 'Kerry', lat: 51.8847, lng: -10.3597 },
  { town: 'Ballybunion', county: 'Kerry', lat: 52.5103, lng: -9.6728 },
  { town: 'Lahinch', county: 'Clare', lat: 52.9333, lng: -9.3500 },
  { town: 'Kilkee', county: 'Clare', lat: 52.6833, lng: -9.6500 },
  { town: 'Fanore', county: 'Clare', lat: 53.1167, lng: -9.2833 },
  { town: 'Miltown Malbay', county: 'Clare', lat: 52.8500, lng: -9.4000 },
  { town: 'Laragh', county: 'Wicklow', lat: 53.0103, lng: -6.3267 },
  { town: 'Avoca', county: 'Wicklow', lat: 52.8500, lng: -6.2167 },
  { town: 'Rathdrum', county: 'Wicklow', lat: 52.9333, lng: -6.2333 },
  { town: 'Roundwood', county: 'Wicklow', lat: 53.0667, lng: -6.2333 },
  { town: 'Arklow', county: 'Wicklow', lat: 52.7979, lng: -6.1620 },
  { town: 'Schull', county: 'Cork', lat: 51.5281, lng: -9.5428 },
  { town: 'Baltimore', county: 'Cork', lat: 51.4833, lng: -9.3667 },
  { town: 'Glengarriff', county: 'Cork', lat: 51.7500, lng: -9.5500 },
  { town: 'Clonakilty', county: 'Cork', lat: 51.6236, lng: -8.8711 },
  { town: 'Youghal', county: 'Cork', lat: 51.9547, lng: -7.8508 },
  { town: 'Dunfanaghy', county: 'Donegal', lat: 55.1833, lng: -7.9667 },
  { town: 'Ardara', county: 'Donegal', lat: 54.7667, lng: -8.4167 },
  { town: 'Glencolmcille', county: 'Donegal', lat: 54.7167, lng: -8.7333 },
  { town: 'Downings', county: 'Donegal', lat: 55.1833, lng: -7.8333 },
  { town: 'Malin Head', county: 'Donegal', lat: 55.3833, lng: -7.3667 },
  { town: 'Belmullet', county: 'Mayo', lat: 54.2250, lng: -10.0000 },
  { town: 'Louisburgh', county: 'Mayo', lat: 53.7667, lng: -9.8167 },
  { town: 'Cong', county: 'Mayo', lat: 53.5333, lng: -9.2833 },
  { town: 'Ballina', county: 'Mayo', lat: 54.1167, lng: -9.1500 },
  { town: 'Strandhill', county: 'Sligo', lat: 54.2708, lng: -8.5931 },
  { town: 'Rosses Point', county: 'Sligo', lat: 54.3000, lng: -8.5667 },
  { town: 'Easkey', county: 'Sligo', lat: 54.2833, lng: -8.9500 },
  { town: 'Dunmore East', county: 'Waterford', lat: 52.1500, lng: -6.9833 },
  { town: 'Tramore', county: 'Waterford', lat: 52.1606, lng: -7.1500 },
  { town: 'Ardmore', county: 'Waterford', lat: 51.9500, lng: -7.7167 },
  { town: 'Courtown', county: 'Wexford', lat: 52.6439, lng: -6.2281 },
  { town: 'Rosslare', county: 'Wexford', lat: 52.2667, lng: -6.3833 },
  { town: 'Kilmore Quay', county: 'Wexford', lat: 52.1725, lng: -6.5856 },
  { town: 'Carlingford', county: 'Louth', lat: 54.0417, lng: -6.1883 },
  { town: 'Bettystown', county: 'Meath', lat: 53.6939, lng: -6.2458 },
  { town: 'Trim', county: 'Meath', lat: 53.5550, lng: -6.7917 },
  { town: 'Athlone', county: 'Westmeath', lat: 53.4239, lng: -7.9403 },
  { town: 'Portumna', county: 'Galway', lat: 53.0911, lng: -8.2172 },
  { town: 'Kinvara', county: 'Galway', lat: 53.1383, lng: -8.9350 },
  { town: 'Clarinbridge', county: 'Galway', lat: 53.2250, lng: -8.8583 },
  { town: 'Kilrush', county: 'Clare', lat: 52.6403, lng: -9.4844 },
]

const namePrefixes = [
  'Wild', 'Atlantic', 'Emerald', 'Celtic', 'Coastal', 'Lakeside', 'Mountain',
  'Forest', 'Harbour', 'Bay', 'Valley', 'Clifftop', 'Riverside', 'Sunset',
  'Wilderness', 'Hidden', 'Ancient', 'Golden', 'Silver', 'Misty', 'Tranquil',
  'Serene', 'Peaceful', 'Adventure', 'Discovery', 'Heritage', 'Nature',
]

const nameSuffixes = [
  'Camping', 'Camp', 'Retreat', 'Hideaway', 'Haven', 'Escape', 'Oasis',
  'Basecamp', 'Lodge', 'Grounds', 'Park', 'Site', 'Spot', 'Corner',
  'Meadows', 'Woods', 'Fields', 'Acres', 'Point', 'View', 'Rest',
]

const campingImages = [
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
  'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
  'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
  'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
  'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800',
  'https://images.unsplash.com/photo-1487730116445-500c8a39a746?w=800',
  'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800',
  'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800',
  'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800',
  'https://images.unsplash.com/photo-1534187886935-1e1236e856c3?w=800',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
  'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=800',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
  'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800',
  'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800',
  'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800',
  'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800',
  'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800',
  'https://images.unsplash.com/photo-1496545672447-f699b503d270?w=800',
  'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800',
]

const allFacilities = [
  { id: 'wifi', name: 'Free WiFi', icon: 'wifi' },
  { id: 'shower', name: 'Hot Showers', icon: 'shower' },
  { id: 'pets', name: 'Pet Friendly', icon: 'pets' },
  { id: 'power', name: 'Electric Hookup', icon: 'bolt' },
  { id: 'fire', name: 'Fire Pits', icon: 'local_fire_department' },
  { id: 'parking', name: 'Free Parking', icon: 'local_parking' },
  { id: 'shop', name: 'Camp Shop', icon: 'store' },
  { id: 'laundry', name: 'Laundry', icon: 'local_laundry_service' },
  { id: 'kitchen', name: 'Camp Kitchen', icon: 'kitchen' },
  { id: 'bbq', name: 'BBQ Area', icon: 'outdoor_grill' },
  { id: 'eco', name: 'Eco Certified', icon: 'eco' },
  { id: 'swim', name: 'Wild Swimming', icon: 'pool' },
  { id: 'dark', name: 'Dark Sky Site', icon: 'nights_stay' },
  { id: 'bikes', name: 'Bike Rental', icon: 'directions_bike' },
  { id: 'kayak', name: 'Kayak Hire', icon: 'kayaking' },
  { id: 'restaurant', name: 'Restaurant', icon: 'restaurant' },
  { id: 'cafe', name: 'On-site Café', icon: 'local_cafe' },
  { id: 'playground', name: 'Playground', icon: 'sports_soccer' },
  { id: 'fishing', name: 'Fishing Nearby', icon: 'phishing' },
  { id: 'hiking', name: 'Hiking Trails', icon: 'hiking' },
]

const supplierTemplates = {
  food: [
    "O'Brien's Farm Shop", "The Local Butcher", "Seafood Shack", "Village Bakery",
    "Farmers Market", "Organic Greens", "The Cheese Maker", "Harbor Fish Co",
    "Mountain Deli", "Celtic Kitchen", "Artisan Foods", "Fresh Catch",
  ],
  activity: [
    "Adventure Tours", "Sea Kayaking", "Horse Trekking", "Surf School",
    "Fishing Charters", "Walking Tours", "Cycling Adventures", "Boat Trips",
    "Rock Climbing", "Wildlife Safaris", "Heritage Walks", "Dive Centre",
  ],
  gear: [
    "Outdoor Outfitters", "Camp Supplies", "Gear Rental", "Adventure Kit",
    "The Camping Store", "Trail Essentials", "Explore More", "Basecamp Gear",
  ],
}

const descriptions = [
  'A hidden gem in the heart of the Irish countryside. Wake to birdsong, fall asleep under the stars. Perfect for families and adventurers alike.',
  'Experience authentic Irish hospitality in this family-run campsite. Traditional music sessions, local produce, and breathtaking scenery.',
  'Eco-friendly camping with minimal footprint. Solar power, composting facilities, and pristine natural surroundings.',
  'Adventure awaits at every turn. Hiking, kayaking, and cycling all within reach. The perfect basecamp for outdoor enthusiasts.',
  'Peaceful retreat offering stunning coastal views and direct beach access. Watch dolphins at sunset.',
  'Nestled in ancient woodland, this magical site offers tranquility and connection with nature.',
  'Award-winning campsite with excellent facilities and warm Irish welcome. Return visitors year after year.',
  'Wild Atlantic Way camping at its finest. Rugged cliffs, dramatic seascapes, and unforgettable sunsets.',
  'Family-friendly site with something for everyone. Playground, games room, and nearby attractions.',
  'Romantic getaway in luxurious glamping accommodation. Hot tubs, wood stoves, and champagne on arrival.',
  'Budget-friendly camping without compromising on views or experience. Backpackers welcome.',
  'Historic site with Iron Age fort and medieval ruins nearby. Step back in time while enjoying modern comforts.',
  'Surfer\'s paradise with consistent waves and vibrant beach culture. Lessons available for all levels.',
  'Mountain retreat with panoramic views. Ideal for hikers tackling nearby peaks and trails.',
  'Lakeside camping with fishing, boating, and waterside walks. Complete peace and quiet.',
  'Dark sky certified site perfect for stargazing. Telescopes available, astronomy nights weekly.',
  'Gateway to some of Ireland\'s most spectacular scenery. National park on your doorstep.',
  'Traditional Irish farm experience. Feed the animals, collect eggs, and enjoy farm-fresh breakfasts.',
  'Coastal path camping with clifftop views. Watch seabirds, seals, and occasional whales.',
  'Wellness retreat with yoga classes, meditation spaces, and healthy cuisine options.',
]

const lotTypes: Array<'tent' | 'rv' | 'cabin' | 'glamping'> = ['tent', 'rv', 'cabin', 'glamping']

const lotNamesByType = {
  tent: ['Standard Pitch', 'Premium Pitch', 'Family Zone', 'Solo Spot', 'Scenic View', 'Sheltered Pitch', 'Woodland Pitch', 'Meadow Pitch'],
  rv: ['Full Hookup Bay', 'Standard RV Spot', 'Premium Motorhome', 'Campervan Corner', 'Large Vehicle Bay'],
  cabin: ['Cosy Cabin', 'Forest Lodge', 'Woodland Hut', 'Ranger Station', 'Mountain Cabin', 'Lakeside Cabin'],
  glamping: ['Bell Tent', 'Safari Tent', 'Yurt', 'Shepherd\'s Hut', 'Pod', 'Treehouse', 'Geodome', 'Tipi'],
}

function generateCampsite(id: number, random: () => number): Campsite {
  const location = locationData[Math.floor(random() * locationData.length)]
  const prefix = namePrefixes[Math.floor(random() * namePrefixes.length)]
  const suffix = nameSuffixes[Math.floor(random() * nameSuffixes.length)]

  // Determine primary type with weighted distribution
  const typeRoll = random()
  let primaryType: 'tent' | 'rv' | 'cabin' | 'glamping'
  if (typeRoll < 0.40) primaryType = 'tent'
  else if (typeRoll < 0.65) primaryType = 'glamping'
  else if (typeRoll < 0.85) primaryType = 'rv'
  else primaryType = 'cabin'

  // Generate base price based on type
  let basePrice: number
  switch (primaryType) {
    case 'tent': basePrice = 20 + Math.floor(random() * 25); break
    case 'rv': basePrice = 30 + Math.floor(random() * 25); break
    case 'glamping': basePrice = 65 + Math.floor(random() * 80); break
    case 'cabin': basePrice = 80 + Math.floor(random() * 70); break
  }

  // Generate rating (weighted toward higher ratings)
  const ratingBase = 3.8 + random() * 1.2
  const rating = Math.round(ratingBase * 10) / 10

  // Select random facilities (4-8)
  const numFacilities = 4 + Math.floor(random() * 5)
  const shuffledFacilities = [...allFacilities].sort(() => random() - 0.5)
  const facilities = shuffledFacilities.slice(0, numFacilities)

  // Select random images (1-3)
  const numImages = 1 + Math.floor(random() * 3)
  const shuffledImages = [...campingImages].sort(() => random() - 0.5)
  const images = shuffledImages.slice(0, numImages)

  // Generate lots (2-5)
  const numLots = 2 + Math.floor(random() * 4)
  const lots = []
  const usedLotNames = new Set<string>()

  // Always include primary type
  const primaryLotNames = lotNamesByType[primaryType]
  const primaryLotName = primaryLotNames[Math.floor(random() * primaryLotNames.length)]
  usedLotNames.add(primaryLotName)

  lots.push({
    id: `lot1`,
    name: primaryLotName,
    type: primaryType,
    maxGuests: primaryType === 'tent' ? 2 + Math.floor(random() * 6) : 2 + Math.floor(random() * 4),
    size: primaryType === 'tent' ? `${5 + Math.floor(random() * 4)}m x ${5 + Math.floor(random() * 4)}m` :
          primaryType === 'rv' ? `${8 + Math.floor(random() * 4)}m x ${3 + Math.floor(random() * 2)}m` :
          `${20 + Math.floor(random() * 30)}sqm`,
    pricePerNight: basePrice + Math.floor(random() * 20) - 10,
  })

  // Add additional lots
  for (let i = 1; i < numLots; i++) {
    const lotType = lotTypes[Math.floor(random() * lotTypes.length)]
    const lotNames = lotNamesByType[lotType]
    let lotName = lotNames[Math.floor(random() * lotNames.length)]

    // Ensure unique names
    let attempts = 0
    while (usedLotNames.has(lotName) && attempts < 10) {
      lotName = lotNames[Math.floor(random() * lotNames.length)]
      attempts++
    }
    if (usedLotNames.has(lotName)) {
      lotName = `${lotName} ${i + 1}`
    }
    usedLotNames.add(lotName)

    const lotPrice = lotType === 'tent' ? 18 + Math.floor(random() * 30) :
                     lotType === 'rv' ? 28 + Math.floor(random() * 30) :
                     lotType === 'glamping' ? 60 + Math.floor(random() * 90) :
                     75 + Math.floor(random() * 80)

    lots.push({
      id: `lot${i + 1}`,
      name: lotName,
      type: lotType,
      maxGuests: lotType === 'tent' ? 2 + Math.floor(random() * 6) : 2 + Math.floor(random() * 4),
      size: lotType === 'tent' ? `${4 + Math.floor(random() * 5)}m x ${4 + Math.floor(random() * 5)}m` :
            lotType === 'rv' ? `${8 + Math.floor(random() * 5)}m x ${3 + Math.floor(random() * 2)}m` :
            `${15 + Math.floor(random() * 35)}sqm`,
      pricePerNight: lotPrice,
    })
  }

  // Generate suppliers (0-4)
  const numSuppliers = Math.floor(random() * 5)
  const suppliers = []
  const categories: Array<'food' | 'activity' | 'gear'> = ['food', 'activity', 'gear']

  for (let i = 0; i < numSuppliers; i++) {
    const category = categories[Math.floor(random() * categories.length)]
    const names = supplierTemplates[category]
    const name = names[Math.floor(random() * names.length)]

    suppliers.push({
      id: `s${id}-${i + 1}`,
      name: `${location.town} ${name}`,
      category: category as 'food' | 'activity' | 'gear',
      distance: `${(0.3 + random() * 4.7).toFixed(1)} km`,
      alertsEnabled: random() > 0.5,
    })
  }

  // Add small random offset to coordinates
  const latOffset = (random() - 0.5) * 0.05
  const lngOffset = (random() - 0.5) * 0.05

  return {
    id: String(id),
    name: `${prefix} ${suffix}`,
    location: `${location.town}, Co. ${location.county}`,
    coordinates: {
      lat: location.lat + latOffset,
      lng: location.lng + lngOffset,
    },
    pricePerNight: basePrice,
    rating,
    reviewCount: 50 + Math.floor(random() * 500),
    description: descriptions[Math.floor(random() * descriptions.length)],
    imageUrl: images[0],
    images,
    facilities,
    lots,
    suppliers,
    isSuperhost: random() > 0.4,
    type: primaryType,
  }
}

// Generate 100 additional campsites with seed for reproducibility
const random = seededRandom(12345)
const generatedCampsites: Campsite[] = Array.from({ length: 100 }, (_, i) =>
  generateCampsite(21 + i, random)
)

// Export combined array: 20 hand-crafted + 100 generated = 120 total
export const mockCampsites: Campsite[] = [
  ...handCraftedCampsites,
  ...generatedCampsites,
]
