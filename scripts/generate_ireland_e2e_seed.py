#!/usr/bin/env python3
"""Generate V1102 Ireland e2e catalogue seed SQL.

Run from repo root:
    python3 scripts/generate_ireland_e2e_seed.py
"""
from __future__ import annotations

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / (
    "my-island-api/src/main/resources/db/seed/V1102__ireland_e2e_catalogue.sql"
)

# BCrypt for plaintext "password" (same hash used by original V999 seeds)
PASSWORD = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG"

U = "https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&q=80&w=1200"

IMG = {
    "tent": [
        U.format(pid="1504280390367-361c6d9f38f4"),
        U.format(pid="1478131143081-80f7f84ca84d"),
        U.format(pid="1508873696983-2dfd5898f08b"),
        U.format(pid="1510312305653-8ed496efae75"),
        U.format(pid="1537905569824-f89f16cf2b41"),
    ],
    "touring": [
        U.format(pid="1523987355523-c7b5b0dd90a7"),
        U.format(pid="1469854523086-cc02fe5d8800"),
        U.format(pid="1527786356703-4b4e2d23890b"),
        U.format(pid="1502301197979-71779edbaa8d"),
    ],
    "glamping": [
        U.format(pid="1587061949409-02df41d5e562"),
        U.format(pid="1499696010180-025ef6e1a8f9"),
        U.format(pid="1618767689160-da3fb810aad7"),
        U.format(pid="1476041800959-2f6bb412c8ce"),
        U.format(pid="1571896349842-33c89424de2d"),
    ],
    "cabin": [
        U.format(pid="1449158743715-0a90ebb6d2d8"),
        U.format(pid="1510798831971-661eb04b3739"),
        U.format(pid="1482192505345-56501afb27d7"),
        U.format(pid="1520250497591-112f2f40a3f4"),
    ],
    "mobile": [
        U.format(pid="1566438480900-0609be27a4be"),
        U.format(pid="1566073771259-6a8506099945"),
    ],
    "coast": [
        U.format(pid="1507525428034-b723cf961d3e"),
        U.format(pid="1501785888041-af3ef285b470"),
        U.format(pid="1475924156734-496f6cae6d46"),
        U.format(pid="1500375592092-40eb2168fd21"),
    ],
    "forest": [
        U.format(pid="1441974231531-c6227db76b6e"),
        U.format(pid="1511497584788-876760111969"),
        U.format(pid="1542273917363-3b531dd36f7a"),
    ],
    "lake": [
        U.format(pid="1439066615861-d1cad629e3d5"),
        U.format(pid="1501785888041-af3ef285b470"),
        U.format(pid="1472214103451-9374bd1c798e"),
    ],
    "mountain": [
        U.format(pid="1464822759023-fed622ff2c3b"),
        U.format(pid="1483728642387-6fa7afb05c54"),
        U.format(pid="1519681393784-d32d7659d3d8"),
    ],
}

# Popular Irish destinations researched for realistic mock listings.
# Names are original mock brands inspired by real places, not copies of live businesses.
NEW_SITES = [
    {
        "email": "corkagh@myisland.com",
        "owner": "Corkagh Park Host",
        "name": "Corkagh Touring Park",
        "county": "Dublin",
        "town": "Clondalkin",
        "type": "TOURING",
        "lat": 53.3169,
        "lng": -6.4032,
        "phone": "+353 1 464 0100",
        "web": "https://corkaghtouring.ie",
        "featured": True,
        "desc": "Dublin's gateway touring park on the 300-acre Corkagh Park demesne. Fully serviced hardstandings with hedged gardens, a playground, and tarmac walks to fishing lakes and rose gardens. Ten minutes from the Red Cow Luas and a 25-minute drive to Dublin Airport — the classic first-night stop for island tours.",
        "hero": "touring",
        "gallery": ["forest", "tent"],
        "lots": [
            ("Hedged Hardstanding 1", "TOURING", "Level 10m hardstanding with 16A electric, water and grey-water points, screened by beech hedges.", 42, 4, "touring"),
            ("Hedged Hardstanding 2", "TOURING", "Family touring pitch with awning space and easy access to the playground and putting green.", 45, 6, "touring"),
            ("Parkland Tent Pitch", "TENT", "Grassy pitch beside woodland walks. Shared facilities a two-minute stroll away.", 28, 4, "tent"),
            ("Family Mobile Home", "MOBILE_HOME", "Three-bedroom static with kitchen, living area and a small enclosed garden. Sleeps six.", 145, 6, "mobile"),
        ],
        "amenities": ["WiFi", "Electricity", "Water Hookup", "Toilet", "Shower", "Playground", "Parking", "Laundry", "Shop", "Reception", "Security"],
    },
    {
        "email": "howth.camp@myisland.com",
        "owner": "Howth Head Host",
        "name": "Howth Head Coastal Camp",
        "county": "Dublin",
        "town": "Howth",
        "type": "TENT",
        "lat": 53.3865,
        "lng": -6.0733,
        "phone": "+353 1 832 2200",
        "web": "https://howthheadcamp.ie",
        "featured": False,
        "desc": "Cliff-edge camping above Dublin Bay with the Howth Cliff Walk at the gate. Watch the Dublin-Holyhead ferry from your tent, then walk into Howth village for lobster and live trad. DART station is 15 minutes on foot — city nightlife without giving up the sea air.",
        "hero": "coast",
        "gallery": ["tent", "glamping"],
        "lots": [
            ("Cliff Meadow Pitch", "TENT", "Elevated grass pitch with Ireland's Eye views. Sheltered by gorse. Bring pegs for the breeze.", 32, 4, "tent"),
            ("Harbour View Pitch", "TENT", "Slightly lower pitch facing Howth Harbour lights. Quieter on windy nights.", 30, 4, "tent"),
            ("Bailey Pod", "GLAMPING", "Cedar pod with a picture window toward the Bailey Lighthouse. King bed, kettle, and electric blanket.", 135, 2, "glamping"),
        ],
        "amenities": ["WiFi", "Toilet", "Shower", "Parking", "Hiking", "Reception", "Pet Friendly"],
    },
    {
        "email": "curragh.farm@myisland.com",
        "owner": "Curragh Farm Host",
        "name": "Curragh Farm Camping",
        "county": "Kildare",
        "town": "Athy",
        "type": "TOURING",
        "lat": 52.9919,
        "lng": -6.9835,
        "phone": "+353 59 863 1200",
        "web": "https://curraghfarmcamping.ie",
        "featured": False,
        "desc": "Family-run park on a working 140-acre farm of mature beech and evergreen, three miles from heritage-town Athy. Touring pitches sit well back from the road. The Curragh, Irish National Stud and Japanese Gardens are a short drive; the Barrow and Grand Canal offer coarse and game fishing.",
        "hero": "touring",
        "gallery": ["forest", "tent"],
        "lots": [
            ("Beech Avenue Pitch", "TOURING", "Hardstanding under mature beech with 16A hookup. Quiet even on rally weekends.", 36, 4, "touring"),
            ("Farm Meadow Tent", "TENT", "Open grass beside the farm track. Morning light, hens for company, and a camper's kitchen nearby.", 24, 4, "tent"),
            ("Orchard Pod", "GLAMPING", "Insulated pod at the edge of the old orchard. Double bed, heater, and farm-egg breakfast optional.", 95, 2, "glamping"),
        ],
        "amenities": ["WiFi", "Electricity", "Toilet", "Shower", "Parking", "Laundry", "Pet Friendly", "Reception", "Fishing"],
    },
    {
        "email": "punchestown@myisland.com",
        "owner": "Punchestown Meadows Host",
        "name": "Punchestown Meadows",
        "county": "Kildare",
        "town": "Naas",
        "type": "TENT",
        "lat": 53.1844,
        "lng": -6.6267,
        "phone": "+353 45 897 200",
        "web": "https://punchestownmeadows.ie",
        "featured": False,
        "desc": "Open meadow camping on the edge of Punchestown. Race-week buzz in April and a sleepy Kildare hideaway the rest of the year. Naas town, the canal greenway and Dublin are all an easy hop. Hardstandings for vans plus a wildflower field for tents.",
        "hero": "tent",
        "gallery": ["touring", "forest"],
        "lots": [
            ("Racecourse Meadow", "TENT", "Big grass pitch in a wildflower field. Festival weekends book out months ahead.", 26, 6, "tent"),
            ("Canal Bank Touring", "TOURING", "Level touring bay with electric, a short walk from the Grand Canal towpath.", 38, 4, "touring"),
        ],
        "amenities": ["Toilet", "Shower", "Parking", "Pet Friendly", "Cycling", "Reception"],
    },
    {
        "email": "blackstairs@myisland.com",
        "owner": "Blackstairs Eco Host",
        "name": "Blackstairs Eco Camp",
        "county": "Carlow",
        "town": "Borris",
        "type": "GLAMPING",
        "lat": 52.6006,
        "lng": -6.9250,
        "phone": "+353 59 977 3100",
        "web": "https://blackstairsecocamp.ie",
        "featured": True,
        "desc": "Shepherd huts and canvas lodges under Mount Leinster on the Carlow-Wexford border. Off-grid luxury with composting loos, solar showers and wood-fired hot tubs. Walk the South Leinster Way, then recover in Borris with a pint beside the viaduct. Adults-leaning, dog-friendly, dark-sky nights.",
        "hero": "glamping",
        "gallery": ["mountain", "cabin"],
        "lots": [
            ("Mount Leinster Hut", "GLAMPING", "Victorian-style shepherd hut with a wood burner, king bed and a private deck facing the Blackstairs.", 155, 2, "glamping"),
            ("South Leinster Yurt", "GLAMPING", "Family yurt with a stove, rugs and a fire pit. Sleeps four on proper beds.", 130, 4, "glamping"),
            ("Barrow Valley Pitch", "TENT", "Simple meadow pitch for walkers doing the South Leinster Way. Composting toilet nearby.", 20, 2, "tent"),
        ],
        "amenities": ["Fire Pit", "Hiking", "Parking", "Pet Friendly", "Toilet", "Shower", "Reception"],
    },
    {
        "email": "ramor@myisland.com",
        "owner": "Lough Ramor Host",
        "name": "Lough Ramor Waterside",
        "county": "Cavan",
        "town": "Virginia",
        "type": "TENT",
        "lat": 53.8322,
        "lng": -7.0811,
        "phone": "+353 49 854 7100",
        "web": "https://loughramorwaterside.ie",
        "featured": False,
        "desc": "Lakeside camping on the southwestern shore of Lough Ramor, 500m off the N3 near Virginia. Rowing boats and motorboats for hire, island-hopping, and coarse fishing from the bank. A Hidden Heartlands base between Dublin and Donegal with genuine Cavan quiet.",
        "hero": "lake",
        "gallery": ["tent", "touring"],
        "lots": [
            ("Lakeshore Pitch 1", "TENT", "Waterfront grass pitch. Cast from the bank at dawn without leaving the site.", 27, 4, "tent"),
            ("Lakeshore Pitch 2", "TENT", "Second-row pitch with lake glimpses and more shelter from westerlies.", 24, 4, "tent"),
            ("Angler's Hardstanding", "TOURING", "Level touring pitch with electric, close to the slipway and fish-cleaning station.", 36, 4, "touring"),
            ("Island-View Cabin", "CABIN", "One-bedroom timber cabin with a deck over the reeds. Kettle, heater, and rod storage.", 110, 2, "cabin"),
        ],
        "amenities": ["Fishing", "Swimming", "Toilet", "Shower", "Parking", "Fire Pit", "BBQ", "Reception", "Pet Friendly"],
    },
    {
        "email": "shercock@myisland.com",
        "owner": "Shercock Lakes Host",
        "name": "Shercock Lakeside Cabins",
        "county": "Cavan",
        "town": "Shercock",
        "type": "CABIN",
        "lat": 53.9936,
        "lng": -6.8956,
        "phone": "+353 42 966 8400",
        "web": "https://shercockcabins.ie",
        "featured": False,
        "desc": "Hand-built lakeside cabins on Lough Sillan at Shercock. Slow Cavan evenings, pike fishing, and a village pub that still does a proper session. Cabins are heated year-round; a handful of grass pitches open May to September.",
        "hero": "cabin",
        "gallery": ["lake", "forest"],
        "lots": [
            ("Sillan Cabin East", "CABIN", "Handcrafted cabin with lake views, a wood stove and a small kitchenette. Sleeps two plus a sofa bed.", 118, 3, "cabin"),
            ("Sillan Cabin West", "CABIN", "Twin of East Cabin with a slightly bigger deck and evening sun.", 122, 3, "cabin"),
            ("Lough Sillan Pitch", "TENT", "Seasonal grass pitch among alder. Shared shower block.", 22, 4, "tent"),
        ],
        "amenities": ["WiFi", "Toilet", "Shower", "Parking", "Fishing", "Fire Pit", "Reception"],
    },
    {
        "email": "corlea@myisland.com",
        "owner": "Corlea Bog Host",
        "name": "Corlea Bog Camp",
        "county": "Longford",
        "town": "Kenagh",
        "type": "TENT",
        "lat": 53.6508,
        "lng": -7.7394,
        "phone": "+353 43 332 4100",
        "web": "https://corleabogcamp.ie",
        "featured": False,
        "desc": "Quiet midlands camping beside the Iron Age Corlea Trackway. Raised bog, curlew country, and the Royal Canal greenway a few kilometres away. Simple facilities, big skies, and a genuinely off-the-beaten-path Longford stay.",
        "hero": "tent",
        "gallery": ["forest", "lake"],
        "lots": [
            ("Bog Meadow Pitch", "TENT", "Sheltered grass pitch on the edge of the raised bog. Dawn chorus is the alarm clock.", 20, 4, "tent"),
            ("Canal Touring Bay", "TOURING", "Hardstanding with electric for canal-touring vans heading Athlone to Dublin.", 32, 4, "touring"),
        ],
        "amenities": ["Toilet", "Shower", "Parking", "Hiking", "Cycling", "Pet Friendly"],
    },
    {
        "email": "muckno@myisland.com",
        "owner": "Muckno Forest Host",
        "name": "Muckno Forest Camping",
        "county": "Monaghan",
        "town": "Castleblayney",
        "type": "TENT",
        "lat": 54.1183,
        "lng": -6.7361,
        "phone": "+353 42 974 0200",
        "web": "https://mucknocamping.ie",
        "featured": False,
        "desc": "Forest and lakeside pitches on Lough Muckno at Castleblayney — Monaghan's outdoor playground. Walking loops, coarse fishing, and a market town with a proper bakery. A practical overnight on the Dublin-Derry road that feels like a holiday.",
        "hero": "forest",
        "gallery": ["lake", "tent"],
        "lots": [
            ("Forest Loop Pitch", "TENT", "Pitch among larch and pine with the lake trail at the back of the site.", 23, 4, "tent"),
            ("Muckno Shore Pitch", "TENT", "Closer to the water, popular with anglers. Flat, slightly more open.", 25, 4, "tent"),
            ("Hope Castle Touring", "TOURING", "Electric hardstanding near the old estate walls. Easy in-and-out for one-nighters.", 34, 4, "touring"),
        ],
        "amenities": ["Toilet", "Shower", "Parking", "Fishing", "Hiking", "Playground", "Reception"],
    },
    {
        "email": "loughkey@myisland.com",
        "owner": "Lough Key Host",
        "name": "Lough Key Hideaways",
        "county": "Roscommon",
        "town": "Boyle",
        "type": "GLAMPING",
        "lat": 53.9889,
        "lng": -8.2431,
        "phone": "+353 71 966 4200",
        "web": "https://loughkeyhideaways.ie",
        "featured": True,
        "desc": "Treehouses, pods and forest tents beside Lough Key Forest & Activity Park. Zip-lines, a Boda Borg, and island castle ruins by boat. Boyle town and the Carrowkeel cairns are close; this is the Hidden Heartlands at their most playful.",
        "hero": "glamping",
        "gallery": ["forest", "cabin"],
        "lots": [
            ("Forest Treehouse", "CABIN", "Elevated cabin in the canopy with a rope-bridge approach. Queen bed and a wood-burning stove.", 175, 2, "cabin"),
            ("Lough Key Pod", "GLAMPING", "Insulated glamping pod with lake glimpses, en-suite shower and a private fire pit.", 140, 2, "glamping"),
            ("Activity Park Pitch", "TENT", "Family grass pitch a short walk from the visitor centre and playground.", 28, 6, "tent"),
            ("Boyle Touring Bay", "TOURING", "Serviced hardstanding for motorhomes exploring the Heartlands loop.", 40, 4, "touring"),
        ],
        "amenities": ["WiFi", "Toilet", "Shower", "Parking", "Playground", "Hiking", "Fire Pit", "Reception", "Shop"],
    },
    {
        "email": "shannon.harbour@myisland.com",
        "owner": "Shannon Harbour Host",
        "name": "Shannon Harbour Camp",
        "county": "Roscommon",
        "town": "Athlone",
        "type": "TOURING",
        "lat": 53.4236,
        "lng": -7.9428,
        "phone": "+353 90 649 2100",
        "web": "https://shannonharbourcamp.ie",
        "featured": False,
        "desc": "Riverside touring park on the Roscommon bank of the Shannon above Athlone. Cruiser watching, the Old Rail Trail greenway, and a walkable stretch into town for Sean's Bar. A practical Heartlands hub with full services.",
        "hero": "touring",
        "gallery": ["lake", "tent"],
        "lots": [
            ("Riverbank Hardstanding", "TOURING", "Full-service pitch facing the navigation. Watch the lock traffic from your awning.", 39, 4, "touring"),
            ("Greenway Tent Pitch", "TENT", "Grass pitch with direct access onto the Old Rail Trail.", 22, 4, "tent"),
        ],
        "amenities": ["WiFi", "Electricity", "Water Hookup", "Toilet", "Shower", "Parking", "Cycling", "Reception"],
    },
    {
        "email": "gullion@myisland.com",
        "owner": "Slieve Gullion Host",
        "name": "Slieve Gullion Basecamp",
        "county": "Armagh",
        "town": "Forkhill",
        "type": "TENT",
        "lat": 54.1231,
        "lng": -6.4306,
        "phone": "+44 28 3084 8100",
        "web": "https://slievegullioncamp.com",
        "featured": False,
        "desc": "Basecamp for the Ring of Gullion AONB. Hike the trail to the passage tomb on the summit, then drop back to a fire pit under the mountain. Armagh orchards, Newry and the Cooley Peninsula are all day-trip easy. Simple, scenic, and properly mountainous.",
        "hero": "mountain",
        "gallery": ["tent", "forest"],
        "lots": [
            ("Gullion View Pitch", "TENT", "Open pitch with the mountain filling the sky. Stargazing on clear nights.", 22, 4, "tent"),
            ("Ring of Gullion Pitch", "TENT", "More sheltered pitch in the lee of a stone wall. Popular with trail walkers.", 20, 4, "tent"),
            ("Orchard County Pod", "GLAMPING", "Heated pod with a kettle and a view toward Camlough. Year-round.", 105, 2, "glamping"),
        ],
        "amenities": ["Toilet", "Shower", "Parking", "Hiking", "Fire Pit", "Pet Friendly"],
    },
    {
        "email": "gortin@myisland.com",
        "owner": "Gortin Glen Host",
        "name": "Gortin Glen Camp",
        "county": "Tyrone",
        "town": "Gortin",
        "type": "TENT",
        "lat": 54.7164,
        "lng": -7.2389,
        "phone": "+44 28 8164 8100",
        "web": "https://gortinglencamp.com",
        "featured": False,
        "desc": "Forest camping in the Sperrins AONB at Gortin Glen. Red squirrels, waymarked trails, and the Ulster Way on the doorstep. Omagh is twenty minutes; this is the quiet Tyrone that walkers keep to themselves.",
        "hero": "forest",
        "gallery": ["mountain", "tent"],
        "lots": [
            ("Sperrin Forest Pitch", "TENT", "Pitch among Sitka and native oak. Trails start at the cattle grid.", 21, 4, "tent"),
            ("Glen Lookout Pitch", "TENT", "Higher pitch with a Sperrin ridge view. Bring a warm bag.", 23, 2, "tent"),
            ("Gortin Touring Bay", "TOURING", "Electric hardstanding for vans touring the Sperrins scenic drive.", 33, 4, "touring"),
        ],
        "amenities": ["Toilet", "Shower", "Parking", "Hiking", "Pet Friendly", "Reception"],
    },
    {
        "email": "magilligan@myisland.com",
        "owner": "Magilligan Strand Host",
        "name": "Magilligan Strand Park",
        "county": "Derry",
        "town": "Limavady",
        "type": "TOURING",
        "lat": 55.1664,
        "lng": -6.9511,
        "phone": "+44 28 7775 0100",
        "web": "https://magilliganstrand.com",
        "featured": False,
        "desc": "Miles of Blue Flag sand at Benone and Magilligan, with Binevenagh rising behind the dunes. A Causeway Coast touring park for surfers, kite-flyers and ferry arrivals via Magilligan Point. Downhill beach and Mussenden Temple are a short hop east.",
        "hero": "coast",
        "gallery": ["touring", "tent"],
        "lots": [
            ("Dune Hardstanding", "TOURING", "Serviced pitch behind the dunes. Boardwalk to Benone Strand in five minutes.", 40, 4, "touring"),
            ("Benone Family Pitch", "TENT", "Spacious grass pitch near the play park. Soft sand, long evenings.", 28, 6, "tent"),
            ("Binevenagh Cabin", "CABIN", "Two-bedroom cabin with dune views and space for wet suits and boards.", 135, 5, "cabin"),
        ],
        "amenities": ["WiFi", "Electricity", "Toilet", "Shower", "Parking", "Playground", "Swimming", "Reception", "Shop"],
    },
    {
        "email": "portrush.dunes@myisland.com",
        "owner": "Portrush Dunes Host",
        "name": "Portrush Dunes Camp",
        "county": "Antrim",
        "town": "Portrush",
        "type": "TENT",
        "lat": 55.2044,
        "lng": -6.6542,
        "phone": "+44 28 7082 3100",
        "web": "https://portrushdunescamp.com",
        "featured": False,
        "desc": "Camping behind the East Strand dunes in Ireland's surf town. Whiterocks, Dunluce Castle and the Giant's Causeway are the day-trip circuit; the night is pints on the harbour. A livelier Causeway Coast alternative to the Bushmills end.",
        "hero": "coast",
        "gallery": ["tent", "glamping"],
        "lots": [
            ("East Strand Pitch", "TENT", "Grass pitch a boardwalk from the surf. Expect a soundtrack of Atlantic swell.", 30, 4, "tent"),
            ("Whiterocks Touring", "TOURING", "Hardstanding with electric, popular with van-lifers doing the Causeway loop.", 42, 4, "touring"),
            ("Harbour Pod", "GLAMPING", "Snug pod with a harbour-light view. Perfect after a cold-water session.", 125, 2, "glamping"),
        ],
        "amenities": ["WiFi", "Toilet", "Shower", "Parking", "Swimming", "Reception", "Shop"],
    },
    {
        "email": "cong.glamping@myisland.com",
        "owner": "Cong Village Host",
        "name": "Cong Village Glamping",
        "county": "Mayo",
        "town": "Cong",
        "type": "GLAMPING",
        "lat": 53.5406,
        "lng": -9.2869,
        "phone": "+353 94 954 6100",
        "web": "https://congvillageglamping.ie",
        "featured": True,
        "desc": "Luxury tents and stone cottages in the Quiet Man village between Lough Corrib and Lough Mask. Ashford Castle woods, falconry, and the Cong Canal on the doorstep. Dress up for dinner in the village or keep it simple with a fire pit and Corrib trout.",
        "hero": "glamping",
        "gallery": ["forest", "lake"],
        "lots": [
            ("Quiet Man Safari Tent", "GLAMPING", "Canvas lodge with a proper bed, stove and a private garden. Village pubs a five-minute stroll.", 165, 2, "glamping"),
            ("Ashford Wood Cabin", "CABIN", "Stone-and-timber cabin on the estate edge. Wood-burning stove and a claw-foot bath.", 195, 2, "cabin"),
            ("Corrib Bank Pitch", "TENT", "Simple lakeside pitch for kayakers and walkers. Shared facilities.", 26, 4, "tent"),
        ],
        "amenities": ["WiFi", "Toilet", "Shower", "Parking", "Fire Pit", "Hiking", "Fishing", "Restaurant", "Reception"],
    },
]

# Enrich existing V1005 one-line listings (looked up by owner email).
V1005_ENRICH = {
    "owner101@example.com": (
        "Riverside camping on the Shannon at Carrick-on-Shannon, with cruiser hire next door and the Blueway on the towpath. "
        "A sociable Heartlands hub: pubs with sessions, supermarket five minutes away, and lock-side sunsets. "
        "Touring pitches take the bigger vans; grass pitches suit tents and trailer tents."
    ),
    "owner102@example.com": (
        "Trailhead camping for the Ballyhoura mountain-bike mega trails — 98km of purpose-built singletrack. "
        "Forest walks, the Ballyhoura Way, and quiet Limerick villages with proper bakers. "
        "Muddy bikes welcome; a wash-down bay sits beside the touring field."
    ),
    "owner103@example.com": (
        "Valley camping under the Comeraghs near Dungarvan, with Coumshingaun corrie lake the signature hike. "
        "The Waterford Greenway is a short spin; the Copper Coast is the rainy-day drive. "
        "Family grass pitches and a couple of heated pods for the shoulder season."
    ),
    "owner104@example.com": (
        "Wild Atlantic Way glamping on Achill Island above Keel beach and Minaun Heights. "
        "Keem Bay, Atlantic Drive and the deserted village of Slievemore are the island circuit. "
        "Pods hold the weather; a few wild pitches remain for tents that can take a gale."
    ),
    "owner105@example.com": (
        "Yurts and shepherd huts in the Boyne Valley a few minutes from Newgrange, Knowth and the Battle of the Boyne site. "
        "Slane Castle concerts in summer; Monasterboice and Trim Castle for the rest of the year. "
        "Adults-leaning glamping with a family yurt for the school holidays."
    ),
    "owner106@example.com": (
        "Eco-camping in Wicklow Mountains National Park above Laragh, with Glendalough's monastic city and Spinc boardwalk on the doorstep. "
        "Leave the car: trails start at the gate. Composting toilets, solar showers, and a strict quiet hours policy after 10pm."
    ),
    "owner107@example.com": (
        "Remote peninsula glamping above Castletownbere on the Beara. Healy Pass, Dursey cable car, and empty coves. "
        "This is the quiet sister of the Ring of Kerry — more seals than tour buses. Wood-fired hot tubs on two of the units."
    ),
    "owner108@example.com": (
        "UNESCO Copper Coast camping at Bunmahon: fossil cliffs, coves, and the Geopark visitor centre. "
        "A sunny-southeast family site with a playground, a shop, and a short walk to the strand."
    ),
    "owner109@example.com": (
        "Ireland's most northerly campsite at Malin Head, Banba's Crown. Watch Atlantic weather systems roll in, then chase them with a drive around Inishowen. "
        "Dark skies, hardy grass pitches, and a bothy for nights when the tent is a bad idea."
    ),
    "owner110@example.com": (
        "Hiking base for Slieve Donard and the Mourne Wall, ten minutes from Newcastle's promenade. "
        "Tollymore Forest, Murlough dunes and Maggy's Leap fill the rest of the week. Touring pitches for the van crowd; tents in the lower field."
    ),
    "owner111@example.com": (
        "Lakeside camping at Ballina/Killaloe on Lough Derg with a slipway, sailing club next door, and the East Clare Way. "
        "A different Lough Derg to the unsubscribed test site down the road — this one takes bookings and has a shop."
    ),
    "owner112@example.com": (
        "Camping in the shadow of the Rock of Cashel. Walk into town for the cathedral complex, then drive the Vee Gap and Cahir Castle. "
        "A central Munster touring stop with proper showers and a camper's kitchen."
    ),
    "owner113@example.com": (
        "Dark-sky glamping pods on Valentia Island, a bridge from Portmagee and a boat from the Skelligs. "
        "Fog, lighthouses, and the first transatlantic cable. Pods are insulated; nights here are about the stars."
    ),
    "owner114@example.com": (
        "Camping on the edge of Killarney National Park — lakes, yew woods, and the Gap of Dunloe. "
        "Jaunting cars and tour buses by day; the park belongs to walkers at dawn. Book the lakeside pitches early in July."
    ),
    "owner115@example.com": (
        "Family camping behind Tramore's dunes, with the amusement park, Guillamene diving boards, and a huge strand. "
        "Heated outdoor pool on site. This is the classic Waterford seaside holiday, slightly louder, very handy."
    ),
    "owner116@example.com": (
        "Surf-town camping at Strandhill under Knocknarea. Lessons on the doorstep, seaweed baths for afterwards, and Sligo town twenty minutes inland. "
        "Vans love the hardstandings; tents go in the lee of the dunes."
    ),
    "owner117@example.com": (
        "Glamping beside Hook Head, the oldest operational lighthouse in Ireland. "
        "Wexford's Hook peninsula: choughs, shipwrecks, and Loftus Hall. Adults-leaning pods with a family cabin for summer."
    ),
    "owner118@example.com": (
        "Camping on the Slea Head Drive at Ventry, with Mount Eagle behind you and the Blaskets in front. "
        "Gallarus Oratory, Dunbeg fort, and Coumeenoole in one loop. A Dingle Peninsula stay that is quieter than town."
    ),
    "owner119@example.com": (
        "Cliff-and-island views from Doolin: the Cliffs of Moher coastal path, Aran ferries, and the best trad sessions in Clare. "
        "A busier Wild Atlantic Way stop — book ahead for festival weekends."
    ),
    "owner120@example.com": (
        "Adventure-sports glamping in medieval Carlingford on the Cooley Peninsula. "
        "Zip-lines, a skypark, oyster festival, and the Táin Way. Views across the lough to the Mournes."
    ),
    "owner121@example.com": (
        "Sheltered Bantry Bay camping with Sheep's Head and the Beara on either side. "
        "Market square, mussel farms, and Garnish Island by boat from Glengarriff. A classic West Cork touring base."
    ),
    "owner122@example.com": (
        "Camping on Ireland's only fjord at Killary, under Mweelrea and the Twelve Bens. "
        "Mussel ropes in the water, the Green Road famine walk, and Connemara National Park twenty minutes west."
    ),
    "owner123@example.com": (
        "Trailhead camping in the Slieve Bloom Mountains — Ireland's least-visited range, which is the point. "
        "Waymarked loops, mountain biking, and dark skies. Mountrath is the supply town."
    ),
    "owner124@example.com": (
        "Hidden Heartlands camping on Lough Ree east of Athlone. "
        "Inland beaches, cruiser traffic, and the Old Rail Trail. A gentler Shannon than the big tourist quays."
    ),
    "owner125@example.com": (
        "Camping a short walk from Clonmacnoise, the early Christian city on the Shannon. "
        "High crosses at dawn before the coaches, then the bog railway and Clonony Castle. Simple, historic, unforgettable."
    ),
    "owner126@example.com": (
        "Climbing and hiking base under the Galtees at Cahir. Galtymore is the day's work; Cahir Castle and the Swiss Cottage fill the rest. "
        "A munster mountain site with surprisingly good showers."
    ),
    "owner127@example.com": (
        "Glamping on the Great Western Greenway at Mulranny, with Clew Bay's drowned drumlins in front and Croagh Patrick across the water. "
        "Cycle Westport to Achill without seeing a main road. Heated pods, a couple of grass pitches."
    ),
    "owner128@example.com": (
        "Remote valley camping in the Black Valley under MacGillycuddy's Reeks — one of the last places in Ireland with no mains electricity. "
        "Bring a torch. The Gap of Dunloe walk starts here. Not for everyone; perfect for the right people."
    ),
    "owner129@example.com": (
        "Camping at the edge of Glenveagh National Park: castle, gardens, golden eagles, and the Derryveagh Mountains. "
        "A Donegal Highlands stay that still has a shop and hot water."
    ),
    "owner130@example.com": (
        "Pitch at the foot of Mount Errigal in Gweedore Gaeltacht country. "
        "Poison Glen, Dunlewey lakes, and some of the best traditional singing in Ireland. The mountain looks painted on."
    ),
    "owner131@example.com": (
        "Atlantic camping at Spanish Point, with the story of the Armada wreck and a surf beach that works on a west swell. "
        "Miltown Malbay's Willie Clancy Festival in July is either a reason to come or a reason to book a year ahead."
    ),
    "owner132@example.com": (
        "Cliff-edge pods at Kilkee looking over the Pollock Holes and the Loop Head drive. "
        "Natural swimming pools at low tide, dramatic walks, and a Victorian seaside town that still has ice cream."
    ),
    "owner133@example.com": (
        "Lakeland luxury glamping on Lough Erne near Enniskillen. Castle Archdale, White Island figures, and the Cuilcagh boardwalk. "
        "Fermanagh's water-country at its most comfortable: hot tubs, proper beds, still the sound of water."
    ),
    "owner134@example.com": (
        "Island-hopping base on Clew Bay outside Westport. Kayak the drumlins, climb Croagh Patrick, cycle the Greenway. "
        "Westport's food scene is the evening plan. A busier Mayo site that earns it."
    ),
    "owner135@example.com": (
        "Hill-and-sea glamping at Tara Hill near Gorey. Courtown strand, woodland walks, and a Wexford microclimate that actually gets sun. "
        "Family safari tents and a couple of adults-only huts."
    ),
    "owner136@example.com": (
        "Camping below Powerscourt Waterfall and the gardens at Enniskerry. "
        "A Dublin-escape site: Great Sugar Loaf, Bray Head, and the 44 bus if you refuse to drive. Book the waterfall-view pitches first."
    ),
    "owner137@example.com": (
        "Classic East Coast beach camping at Brittas Bay — miles of sand, dunes, and a weekend exodus from Dublin. "
        "Arrive Thursday if you can. Facilities are solid; the beach is the point."
    ),
    "owner138@example.com": (
        "Ferry-port stopover at Rosslare Harbour with hardstandings, showers, and a walk to the terminal. "
        "Curracloe and Wexford town if your sailing is not until evening. Open year-round for the late boat."
    ),
    "owner139@example.com": (
        "Historic walled-town camping at Youghal: clock gate, Myrtle Grove, and a Blue Flag strand. "
        "The N25 touring stop that is actually worth an extra night. Family pitches and a small shop."
    ),
    "owner140@example.com": (
        "Harbour-view camping at Cobh, watching the liners that still call where Titanic last touched land. "
        "The Cathedral, the Spike Island ferry, and a steep colourful town. Touring pitches have the view; tents sit further up."
    ),
    "owner141@example.com": (
        "Camping a short walk from Blarney Castle and the stone. Kiss it or don't; the gardens and poison garden are the better hour. "
        "Cork city is twenty minutes. A genuine tourist-circuit site that still has grass and trees."
    ),
    "owner142@example.com": (
        "Family glamping beside Fota Wildlife Park and the arboretum. Lemurs at breakfast (not literally). "
        "Cobh and Cork Harbour for the afternoon. Safari tents with proper beds and a small kitchen."
    ),
    "owner143@example.com": (
        "Camping near Mizen Head, Ireland's southwest tip. The signal station, Barleycove dunes, and Fastnet on the horizon. "
        "A Wild Atlantic Way end-of-the-road site. Hold your tent in a gale; the light is worth it."
    ),
    "owner144@example.com": (
        "Walking-base camping for the Sheep's Head Way — 88km, empty, and arguably West Cork's finest ridge. "
        "Durrus cheese down the road. Small, simple, and booked by people who have already done the Beara."
    ),
    "owner145@example.com": (
        "Gaeltacht island glamping on Cape Clear: Irish spoken in the shop, the Fastnet lighthouse, and migrating birds in autumn. "
        "Ferry from Baltimore. No cars needed. Tigíns and a field for tents."
    ),
    "owner146@example.com": (
        "Island camping on Sherkin: beaches, an abbey, and a slower Baltimore. "
        "The ferry is the fun part. Facilities are basic; the beaches are not."
    ),
    "owner147@example.com": (
        "Glengarriff camping with Garnish Island's Italian gardens a ten-minute boat ride away. "
        "Seals in the harbour, Caha tunnels inland, and Bantry for supplies. A lush, sheltered West Cork pocket."
    ),
    "owner148@example.com": (
        "Forest camping at Gougane Barra, source of the River Lee, with St Finbarr's oratory on the lake. "
        "A Coillte forest park setting: trails, picnic tables, and a sacred-feeling valley. Popular with Sunday drivers; stay the night."
    ),
    "owner149@example.com": (
        "Clifftop camping above the fishing village of Dunmore East. "
        "Thatched cottages, a sandy cove, and the Waterford Greenway a short drive. A pretty, slightly posh southeast stay."
    ),
    "owner150@example.com": (
        "City-edge camping at the Waterford Greenway start, so you can cycle to Dungarvan without loading the car. "
        "Viking Triangle museums for the rainy morning. Practical, friendly, and surprisingly quiet at night."
    ),
}

V1005_LOT_NAMES = {
    "Standard Pitch": "{short} Meadow Pitch",
    "Electric Pitch": "{short} Electric Bay",
    "Glamping Pod": "{short} Pod",
}

FEATURED_EXISTING = [
    "Nore Valley Park",
    "Wild Atlantic Glamping",
    "Dingle Peninsula Camping",
    "Wicklow Hills Hideaway",
    "Giants Causeway Camp",
    "Killarney National Park",
    "Achill Wilds",
]

NEW_SUPPLIERS = [
    ("dublin.bikes@myisland.com", "Phoenix Park Cycle Hire", "EQUIPMENT_RENTAL",
     "Bike hire at the edge of Phoenix Park — 707 hectares of deer, avenues and the Papal Cross. City-to-coast loops mapped for you.",
     "Dublin", "Dublin", "Chesterfield Avenue, Phoenix Park", 53.3559, -6.3298, "+353 1 677 0090", "https://phoenixparkcycles.ie"),
    ("howth.lobster@myisland.com", "Howth Harbour Lobster Shack", "RESTAURANT",
     "Day-boat lobster, chowder and brown bread on Howth Pier. Book a table or take a picnic back to the cliff camp.",
     "Dublin", "Howth", "West Pier, Howth", 53.3915, -6.0690, "+353 1 832 4100", "https://howthlobstershack.ie"),
    ("athy.canal@myisland.com", "Barrow Line Boats", "ACTIVITY_PROVIDER",
     "Day-hire narrowboats and kayaks on the Barrow and Grand Canal at Athy. No licence needed for the day boats.",
     "Kildare", "Athy", "The Harbour, Athy", 52.9915, -6.9840, "+353 59 863 4400", "https://barrowlineboats.ie"),
    ("kildare.stud@myisland.com", "Curragh Trail Rides", "ACTIVITY_PROVIDER",
     "Guided hacks across the Curragh plains. See racehorses at work and the National Stud from the saddle.",
     "Kildare", "Kildare Town", "Tully Road, Kildare", 53.1560, -6.9110, "+353 45 521 200", "https://curraghtrails.ie"),
    ("carlow.kayak@myisland.com", "Barrow Valley Kayaks", "ACTIVITY_PROVIDER",
     "Guided paddles on the River Barrow through the Barrow Gap. Beginners welcome, seals occasionally too.",
     "Carlow", "Borris", "The Quay, Borris", 52.6010, -6.9280, "+353 59 977 2800", "https://barrowvalleykayaks.ie"),
    ("cavan.boats@myisland.com", "Ramor Boat Hire", "EQUIPMENT_RENTAL",
     "Rowing boats and small outboards on Lough Ramor. Island picnics and coarse fishing from the water.",
     "Cavan", "Virginia", "Ryefield, Virginia", 53.8330, -7.0820, "+353 49 854 6200", "https://ramorboathire.ie"),
    ("longford.greenway@myisland.com", "Royal Canal Cycles", "EQUIPMENT_RENTAL",
     "Hybrid and e-bike hire for the Royal Canal Greenway through Longford. One-way drops to Mullingar by arrangement.",
     "Longford", "Longford Town", "Market Square, Longford", 53.7270, -7.7980, "+353 43 334 5500", "https://royalcanalcycles.ie"),
    ("monaghan.market@myisland.com", "Blayney Market Kitchen", "FARM_SHOP",
     "Monaghan farm produce, apple juice from Armagh orchards, and soda bread baked before dawn. Picnic boxes for Muckno.",
     "Monaghan", "Castleblayney", "Main Street, Castleblayney", 54.1200, -6.7370, "+353 42 974 1800", "https://blayneymarket.ie"),
    ("roscommon.forest@myisland.com", "Lough Key Adventures", "ACTIVITY_PROVIDER",
     "Zip-line, Boda Borg and forest trails at Lough Key. Campsite guests get a late slot on the zip-line.",
     "Roscommon", "Boyle", "Lough Key Forest Park", 53.9900, -8.2410, "+353 71 967 3122", "https://loughkeyadventures.ie"),
    ("armagh.cidery@myisland.com", "Orchard County Cider House", "FARM_SHOP",
     "Armagh apple country tastings, farm shop and a short orchard walk. Non-alcoholic juices for the designated driver.",
     "Armagh", "Markethill", "Orchard Road, Markethill", 54.2960, -6.5230, "+44 28 3755 2100", "https://orchardcountycider.com"),
    ("tyrone.walks@myisland.com", "Sperrins Walking Guides", "TOUR_OPERATOR",
     "Guided hill days in the Sperrins: Mullaghcarn, Sawel, and the Ulster Way. Small groups, local weather knowledge.",
     "Tyrone", "Gortin", "Main Street, Gortin", 54.7170, -7.2400, "+44 28 8164 7200", "https://sperrinsguides.com"),
    ("derry.surf@myisland.com", "Benone Surf Co", "ACTIVITY_PROVIDER",
     "Surf and stand-up paddle lessons on Benone and Magilligan. Wetsuits included; the Atlantic is not optional.",
     "Derry", "Limavady", "Benone Strand", 55.1670, -6.8600, "+44 28 7775 0400", "https://benonesurf.com"),
]

GUESTS = [
    ("siobhan.walsh@example.com", "Siobhan Walsh"),
    ("cormac.nolan@example.com", "Cormac Nolan"),
    ("aoife.byrne@example.com", "Aoife Byrne"),
    ("padraig.kelly@example.com", "Pádraig Kelly"),
    ("niamh.dunne@example.com", "Niamh Dunne"),
    ("eoin.mcgrath@example.com", "Eoin McGrath"),
    ("orla.fitzgerald@example.com", "Orla Fitzgerald"),
    ("cian.obrien@example.com", "Cian O'Brien"),
    ("mairead.quinn@example.com", "Mairéad Quinn"),
    ("fionn.sullivan@example.com", "Fionn O'Sullivan"),
    ("clodagh.ryan@example.com", "Clodagh Ryan"),
    ("tadhg.murphy@example.com", "Tadhg Murphy"),
    ("sinead.doherty@example.com", "Sinéad Doherty"),
    ("ruairi.gallagher@example.com", "Ruairí Gallagher"),
    ("aileen.power@example.com", "Aileen Power"),
    ("diarmuid.keane@example.com", "Diarmuid Keane"),
    ("ronan.healy@example.com", "Ronan Healy"),
    ("grainne.lynch@example.com", "Gráinne Lynch"),
]

REVIEWS = [
    (4.5, "Woke to birdsong and a proper Irish mist over the fields. Facilities were spotless and the hosts had a map of local walks ready at check-in. We will be back with the dogs."),
    (5.0, "One of the best pitches we have had in years. Level, quiet, and close enough to the village for a pint. The kids vanished into the playground and we actually read a book."),
    (4.0, "Lovely site with a genuine sense of place. Showers were hot, which is not nothing in an Irish October. Only minus is the road noise on the front pitches — pick one further back."),
    (4.5, "We used this as a base for a long weekend of hiking and it could not have been better placed. Fire pit, dark skies, and a breakfast roll from the on-site shop that ruined us for petrol-station food."),
    (3.5, "Grand location and friendly welcome. The grass was a bit waterlogged after two days of rain — not their fault, but a boardwalk to the block would help. Fair price."),
    (5.0, "Glamping done properly: real mattress, warm pod, and a view I still think about. We toasted marshmallows and did not check our phones once. Rare."),
    (4.0, "Perfect overnight on a Wild Atlantic Way loop. Easy in, easy out, and a shower that actually had pressure. Would happily make it a two-nighter next time."),
    (4.5, "The children are still talking about the farm animals and the river. Hardstanding was level, hook-ups worked, and the farm shop soda bread is dangerous."),
    (5.0, "If you like your camping with a side of heritage, stay here. We walked to the historic site at opening time and had it to ourselves. Magical morning."),
    (3.5, "Nice spot but a little cramped on the touring field in August. Staff were grand and the facilities clean. Come in June if you can."),
    (4.5, "Surfed in the morning, seaweed bath in the afternoon, pint in the evening. The pitch behind the dunes is the one you want. Bring extra pegs."),
    (5.0, "We celebrated an anniversary in the cabin and it was perfect — stove going, rain on the roof, and a bottle of something local. Hosts left us alone in the best way."),
    (4.0, "Great jumping-off point for the national park. Buses and jaunting cars nearby if you want them; the forest trails if you do not. Quiet after 10 as promised."),
    (4.5, "Ferry the next morning and this was the least-stressful port stopover we have done. Hot shower, level pitch, walk to the terminal. Open late, which mattered."),
    (5.0, "Dark-sky night that made us feel very small in a good way. Pod was cosy, the kettle was boiled twice, and we saw the Milky Way. Unforgettable."),
]

OWNER_REPLIES = [
    "Go raibh maith agat — delighted you had a good stay. We have noted the pitch advice and will keep the back field for tents in the wet months.",
    "Thanks a million for the kind words. The soda bread is a point of pride. See you next season.",
    "Really glad the walks worked out. Ask at reception next time and we will lend you the laminated loop cards.",
    "Appreciate the honest note about August crowding — we cap touring numbers now on bank-holiday weekends.",
    "The dark-sky forecast is on the blackboard every evening. Hope to welcome you back for the Perseids.",
]


def sql_str(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def img(kind: str, index: int) -> str:
    seq = IMG[kind]
    return seq[index % len(seq)]


def write_header(lines: list[str]) -> None:
    lines.append("-- V1102: Ireland e2e catalogue for a production-like local dev instance")
    lines.append("-- Auto-loaded by Flyway when spring.profiles.active=dev (see start.sh).")
    lines.append("-- Mock listings inspired by popular Irish camping regions; original brand names.")
    lines.append("-- Extra catalogue users use password: password")
    lines.append("")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 1. Platform: enable booking so the local instance feels like a live marketplace")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("UPDATE feature_toggle")
    lines.append("SET enabled = TRUE,")
    lines.append("    description = 'When enabled, full booking functionality is available. Seeded TRUE in local dev so the Ireland catalogue can be booked end-to-end.',")
    lines.append("    updated_at = NOW()")
    lines.append("WHERE name = 'BOOKING_ENABLED';")
    lines.append("")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 2. Activate subscriptions for every owner/supplier except the two gate-test accounts")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("UPDATE owners")
    lines.append("SET subscription_status = 'ACTIVE',")
    lines.append("    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_e2e_owner_' || id),")
    lines.append("    stripe_subscription_id = COALESCE(stripe_subscription_id, 'sub_e2e_owner_' || id),")
    lines.append("    subscription_current_period_end = CURRENT_TIMESTAMP + INTERVAL '365 days',")
    lines.append("    subscription_cancel_at_period_end = FALSE")
    lines.append("WHERE subscription_status IN ('NONE', 'CANCELED', 'UNPAID')")
    lines.append("  AND user_id NOT IN (SELECT id FROM users WHERE email = 'bookings@loughdergcamping.ie');")
    lines.append("")
    lines.append("UPDATE suppliers")
    lines.append("SET subscription_status = 'ACTIVE',")
    lines.append("    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_e2e_supplier_' || id),")
    lines.append("    stripe_subscription_id = COALESCE(stripe_subscription_id, 'sub_e2e_supplier_' || id),")
    lines.append("    subscription_current_period_end = CURRENT_TIMESTAMP + INTERVAL '365 days',")
    lines.append("    subscription_cancel_at_period_end = FALSE")
    lines.append("WHERE subscription_status IN ('NONE', 'CANCELED', 'UNPAID')")
    lines.append("  AND user_id NOT IN (SELECT id FROM users WHERE email = 'hello@dinglekayak.ie');")
    lines.append("")


def write_new_sites(lines: list[str]) -> None:
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 3. New campsites covering previously missing counties (Dublin, Kildare, Carlow,")
    lines.append("--    Cavan, Longford, Monaghan, Roscommon, Armagh, Tyrone, Derry) plus extra")
    lines.append("--    popular destinations (Portrush, Cong)")
    lines.append("--------------------------------------------------------------------------------")
    for site in NEW_SITES:
        lines.append(
            f"INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)"
        )
        lines.append(
            f"SELECT {sql_str(site['email'])}, '{PASSWORD}', {sql_str(site['owner'])}, 'OWNER', TRUE, FALSE, TRUE"
        )
        lines.append(f"WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = {sql_str(site['email'])});")
        lines.append("")
        lines.append(
            "INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,"
        )
        lines.append(
            "                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,"
        )
        lines.append("                    instant_booking, is_featured, featured_until)")
        lines.append("SELECT u.id,")
        lines.append(f"       {sql_str(site['name'])}, {sql_str(site['county'])}, {sql_str(site['town'])}, {sql_str(site['type'])},")
        lines.append(f"       {sql_str(site['desc'])}, {site['lat']}, {site['lng']}, {sql_str(site['phone'])}, {sql_str(site['web'])},")
        lines.append("       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',")
        featured = "TRUE" if site["featured"] else "FALSE"
        until = "CURRENT_TIMESTAMP + INTERVAL '120 days'" if site["featured"] else "NULL"
        lines.append(f"       TRUE, {featured}, {until}")
        lines.append(f"FROM users u WHERE u.email = {sql_str(site['email'])}")
        lines.append("  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);")
        lines.append("")
        for i, lot in enumerate(site["lots"]):
            name, ltype, desc, price, guests, ikind = lot
            url = img(ikind, i)
            min_stay = 2 if ltype in ("GLAMPING", "CABIN", "MOBILE_HOME") else 1
            lines.append(
                "INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)"
            )
            lines.append("SELECT o.id,")
            lines.append(f"       {sql_str(name)}, {sql_str(ltype)}, {sql_str(desc)}, {price:.2f}, {guests}, {min_stay}, TRUE, {sql_str(url)}")
            lines.append("FROM owners o JOIN users u ON o.user_id = u.id")
            lines.append(f"WHERE u.email = {sql_str(site['email'])}")
            lines.append("  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = " + sql_str(name) + ");")
            lines.append("")
        amen_list = ", ".join(sql_str(a) for a in site["amenities"])
        lines.append("INSERT INTO campsite_amenities (owner_id, amenity_id)")
        lines.append("SELECT o.id, a.id")
        lines.append("FROM owners o JOIN users u ON o.user_id = u.id")
        lines.append("CROSS JOIN amenities a")
        lines.append(f"WHERE u.email = {sql_str(site['email'])}")
        lines.append(f"  AND a.name IN ({amen_list})")
        lines.append("ON CONFLICT DO NOTHING;")
        lines.append("")
        # lot amenities: electric for touring, fire pit for tent/glamping, wifi for cabins
        lines.append("INSERT INTO lot_amenities (lot_id, amenity_id)")
        lines.append("SELECT l.id, a.id")
        lines.append("FROM lots l")
        lines.append("JOIN owners o ON l.owner_id = o.id")
        lines.append("JOIN users u ON o.user_id = u.id")
        lines.append("CROSS JOIN amenities a")
        lines.append(f"WHERE u.email = {sql_str(site['email'])}")
        lines.append("  AND (")
        lines.append("        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))")
        lines.append("     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))")
        lines.append("     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))")
        lines.append("     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))")
        lines.append("  )")
        lines.append("ON CONFLICT DO NOTHING;")
        lines.append("")


def write_enrich_existing(lines: list[str]) -> None:
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 4. Enrich existing V1005 listings (longer copy, unique lot names, Unsplash photos)")
    lines.append("--------------------------------------------------------------------------------")
    for email, desc in V1005_ENRICH.items():
        lines.append("UPDATE owners o SET description = " + sql_str(desc))
        lines.append("FROM users u")
        lines.append("WHERE o.user_id = u.id AND u.email = " + sql_str(email) + ";")
        lines.append("")

    # Unique lot names from property short name
    lines.append("-- Rename generic V1005 lots so search results look like real inventory")
    lines.append("UPDATE lots l")
    lines.append("SET name = regexp_replace(o.property_name, '\\s+(Camping|Camp|Park|Pods|Wilds|Green|Retreat|Drive|Estate|Resort|Signal|Way|View|Start|Wildlife|Lighthouse)$', '', 'i')")
    lines.append("             || CASE l.name")
    lines.append("                    WHEN 'Standard Pitch' THEN ' Meadow Pitch'")
    lines.append("                    WHEN 'Electric Pitch' THEN ' Electric Bay'")
    lines.append("                    WHEN 'Glamping Pod' THEN ' Glamping Pod'")
    lines.append("                    ELSE ' ' || l.name")
    lines.append("                END,")
    lines.append("    description = CASE l.name")
    lines.append("        WHEN 'Standard Pitch' THEN 'Grass pitch with space for a family tent and guy lines. Shared toilet and shower block.'")
    lines.append("        WHEN 'Electric Pitch' THEN 'Level hardstanding with 16A electric hook-up, handy for motorhomes and tourers.'")
    lines.append("        WHEN 'Glamping Pod' THEN 'Heated glamping pod with a proper bed, kettle and USB charging. En-suite or nearby showers depending on the unit.'")
    lines.append("        ELSE l.description")
    lines.append("    END,")
    lines.append("    image_url = CASE l.lot_type")
    lines.append(f"        WHEN 'TENT' THEN {sql_str(img('tent', 0))}")
    lines.append(f"        WHEN 'TOURING' THEN {sql_str(img('touring', 0))}")
    lines.append(f"        WHEN 'GLAMPING' THEN {sql_str(img('glamping', 0))}")
    lines.append(f"        WHEN 'CABIN' THEN {sql_str(img('cabin', 0))}")
    lines.append(f"        WHEN 'MOBILE_HOME' THEN {sql_str(img('mobile', 0))}")
    lines.append("        ELSE l.image_url")
    lines.append("    END")
    lines.append("FROM owners o JOIN users u ON o.user_id = u.id")
    lines.append("WHERE l.owner_id = o.id")
    lines.append("  AND u.email LIKE 'owner1%@example.com'")
    lines.append("  AND l.name IN ('Standard Pitch', 'Electric Pitch', 'Glamping Pod');")
    lines.append("")

    lines.append("-- Add a cabin or extra tent to the larger V1005 sites for inventory variety")
    lines.append("INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)")
    lines.append("SELECT o.id,")
    lines.append("       o.property_name || ' Cabin',")
    lines.append("       'CABIN',")
    lines.append("       'Timber cabin with a small kitchenette, heating and a private deck. A comfortable step up from the field.',")
    lines.append(f"       115.00, 4, 2, TRUE, {sql_str(img('cabin', 1))}")
    lines.append("FROM owners o JOIN users u ON o.user_id = u.id")
    lines.append("WHERE u.email IN (")
    extras = [
        "owner104@example.com", "owner106@example.com", "owner110@example.com",
        "owner114@example.com", "owner115@example.com", "owner129@example.com",
        "owner133@example.com", "owner136@example.com", "owner141@example.com",
        "owner148@example.com",
    ]
    lines.append("    " + ", ".join(sql_str(e) for e in extras))
    lines.append(")")
    lines.append("  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.lot_type = 'CABIN' AND l.name LIKE '% Cabin');")
    lines.append("")

    lines.append("INSERT INTO campsite_amenities (owner_id, amenity_id)")
    lines.append("SELECT o.id, a.id")
    lines.append("FROM owners o JOIN users u ON o.user_id = u.id")
    lines.append("CROSS JOIN amenities a")
    lines.append("WHERE u.email LIKE 'owner1%@example.com'")
    lines.append("  AND a.name IN ('Toilet', 'Shower', 'Parking', 'Reception')")
    lines.append("ON CONFLICT DO NOTHING;")
    lines.append("")
    lines.append("INSERT INTO campsite_amenities (owner_id, amenity_id)")
    lines.append("SELECT o.id, a.id")
    lines.append("FROM owners o JOIN users u ON o.user_id = u.id")
    lines.append("CROSS JOIN amenities a")
    lines.append("WHERE u.email LIKE 'owner1%@example.com'")
    lines.append("  AND o.property_type IN ('GLAMPING', 'CABIN', 'MOBILE_HOME')")
    lines.append("  AND a.name IN ('WiFi', 'Electricity')")
    lines.append("ON CONFLICT DO NOTHING;")
    lines.append("")


def write_images_and_featured(lines: list[str]) -> None:
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 5. Unsplash photos for every owner and lot so galleries and search look live")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- Replace legacy /images/... lot URLs (files are not shipped) with Unsplash")
    lines.append("UPDATE lots SET image_url = CASE lot_type")
    lines.append(f"    WHEN 'TENT' THEN {sql_str(img('tent', 1))}")
    lines.append(f"    WHEN 'TOURING' THEN {sql_str(img('touring', 1))}")
    lines.append(f"    WHEN 'GLAMPING' THEN {sql_str(img('glamping', 1))}")
    lines.append(f"    WHEN 'CABIN' THEN {sql_str(img('cabin', 2))}")
    lines.append(f"    WHEN 'MOBILE_HOME' THEN {sql_str(img('mobile', 0))}")
    lines.append("    ELSE image_url")
    lines.append("END")
    lines.append("WHERE image_url LIKE '/images/%' OR image_url IS NULL;")
    lines.append("")

    # Vary lot images by id so neighbouring cards are not identical
    for i, kind in enumerate(["tent", "touring", "glamping", "cabin", "mobile"]):
        ltype = {"tent": "TENT", "touring": "TOURING", "glamping": "GLAMPING", "cabin": "CABIN", "mobile": "MOBILE_HOME"}[kind]
        lines.append(f"UPDATE lots SET image_url = CASE (id % {len(IMG[kind])})")
        for j, url in enumerate(IMG[kind]):
            lines.append(f"    WHEN {j} THEN {sql_str(url)}")
        lines.append(f"    ELSE image_url END WHERE lot_type = '{ltype}';")
        lines.append("")

    lines.append("-- Owner hero + gallery. Skip insert if this s3_key already exists (V1027).")
    lines.append("INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)")
    lines.append("SELECT 'OWNER', o.id,")
    lines.append("       'e2e/owners/' || o.id || '/hero.jpg',")
    lines.append("       CASE o.property_type")
    lines.append(f"           WHEN 'TENT' THEN {sql_str(img('tent', 2))}")
    lines.append(f"           WHEN 'TOURING' THEN {sql_str(img('touring', 2))}")
    lines.append(f"           WHEN 'GLAMPING' THEN {sql_str(img('glamping', 2))}")
    lines.append(f"           WHEN 'CABIN' THEN {sql_str(img('cabin', 0))}")
    lines.append(f"           WHEN 'MOBILE_HOME' THEN {sql_str(img('mobile', 1))}")
    lines.append(f"           ELSE {sql_str(img('coast', 0))}")
    lines.append("       END,")
    lines.append("       'hero.jpg', 'image/jpeg', 180000, 0,")
    lines.append("       NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.entity_type = 'OWNER' AND ei.entity_id = o.id AND ei.is_primary = TRUE),")
    lines.append("       o.property_name || ' — main view'")
    lines.append("FROM owners o")
    lines.append("WHERE NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/owners/' || o.id || '/hero.jpg');")
    lines.append("")

    lines.append("INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)")
    lines.append("SELECT 'OWNER', o.id,")
    lines.append("       'e2e/owners/' || o.id || '/gallery.jpg',")
    lines.append("       CASE")
    lines.append(f"           WHEN o.county IN ('Kerry','Clare','Donegal','Antrim','Cork','Galway','Mayo','Derry') THEN {sql_str(img('coast', 1))}")
    lines.append(f"           WHEN o.county IN ('Wicklow','Tyrone','Armagh','Tipperary') THEN {sql_str(img('mountain', 0))}")
    lines.append(f"           WHEN o.county IN ('Cavan','Fermanagh','Westmeath','Leitrim','Roscommon') THEN {sql_str(img('lake', 0))}")
    lines.append(f"           ELSE {sql_str(img('forest', 0))}")
    lines.append("       END,")
    lines.append("       'gallery.jpg', 'image/jpeg', 160000, 1, FALSE,")
    lines.append("       o.property_name || ' — surroundings'")
    lines.append("FROM owners o")
    lines.append("WHERE NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/owners/' || o.id || '/gallery.jpg');")
    lines.append("")

    lines.append("INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)")
    lines.append("SELECT 'LOT', l.id,")
    lines.append("       'e2e/lots/' || l.id || '/primary.jpg',")
    lines.append("       COALESCE(l.image_url, " + sql_str(img("tent", 0)) + "),")
    lines.append("       'primary.jpg', 'image/jpeg', 140000, 0,")
    lines.append("       NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.entity_type = 'LOT' AND ei.entity_id = l.id AND ei.is_primary = TRUE),")
    lines.append("       l.name")
    lines.append("FROM lots l")
    lines.append("WHERE NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/lots/' || l.id || '/primary.jpg');")
    lines.append("")

    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 6. Featured listings (homepage PROMOTED row) — spread around the island")
    lines.append("--------------------------------------------------------------------------------")
    names = ", ".join(sql_str(n) for n in FEATURED_EXISTING)
    lines.append("UPDATE owners")
    lines.append("SET is_featured = TRUE, featured_until = CURRENT_TIMESTAMP + INTERVAL '90 days',")
    lines.append("    featured_purchase_id = COALESCE(featured_purchase_id, 'e2e_featured_' || id)")
    lines.append(f"WHERE property_name IN ({names});")
    lines.append("")
    lines.append("UPDATE suppliers")
    lines.append("SET is_featured = TRUE, featured_until = CURRENT_TIMESTAMP + INTERVAL '90 days',")
    lines.append("    featured_purchase_id = COALESCE(featured_purchase_id, 'e2e_featured_sup_' || id)")
    lines.append("WHERE business_name IN ('Green Acres Farm Shop', 'Lahinch Surf School', 'Wild Water Kayaks', 'Dingle Distillery Tours');")
    lines.append("")


def write_guests_bookings_reviews(lines: list[str]) -> None:
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 7. Guest accounts, completed stays, and reviews across the island")
    lines.append("--------------------------------------------------------------------------------")
    for email, name in GUESTS:
        lines.append(
            f"INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)"
        )
        lines.append(
            f"SELECT {sql_str(email)}, '{PASSWORD}', {sql_str(name)}, 'GUEST', FALSE, FALSE, TRUE"
        )
        lines.append(f"WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = {sql_str(email)});")
        lines.append("")

    # Create completed bookings + reviews using a numbered guest and a numbered owner.
    # We pick lots via ROW_NUMBER so this is deterministic and does not collide with
    # the reviews.booking_id unique constraint.
    lines.append("-- One completed stay + review per guest, spread across distinct campsites")
    lines.append("WITH ranked_lots AS (")
    lines.append("    SELECT l.id AS lot_id, l.owner_id, l.price_per_night,")
    lines.append("           ROW_NUMBER() OVER (PARTITION BY l.owner_id ORDER BY l.id) AS lot_rank")
    lines.append("    FROM lots l")
    lines.append("    JOIN owners o ON o.id = l.owner_id")
    lines.append("    WHERE o.is_deactivated = FALSE")
    lines.append("),")
    lines.append("pick_lots AS (")
    lines.append("    SELECT lot_id, owner_id, price_per_night,")
    lines.append("           ROW_NUMBER() OVER (ORDER BY owner_id) AS rn")
    lines.append("    FROM ranked_lots WHERE lot_rank = 1")
    lines.append("),")
    lines.append("pick_guests AS (")
    lines.append("    SELECT id AS user_id, ROW_NUMBER() OVER (ORDER BY id) AS rn")
    lines.append("    FROM users")
    lines.append("    WHERE email IN (" + ", ".join(sql_str(e) for e, _ in GUESTS) + ")")
    lines.append(")")
    lines.append("INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status,")
    lines.append("                     payment_status, service_fee, charge_total, booking_source, special_requests)")
    lines.append("SELECT g.user_id, p.lot_id,")
    lines.append("       DATE '2025-06-01' + (g.rn * 7)::int,")
    lines.append("       DATE '2025-06-01' + (g.rn * 7)::int + 2,")
    lines.append("       2,")
    lines.append("       p.price_per_night * 2,")
    lines.append("       'COMPLETED', 'CAPTURED',")
    lines.append("       ROUND(p.price_per_night * 2 * 0.10, 2),")
    lines.append("       ROUND(p.price_per_night * 2 * 1.10, 2),")
    lines.append("       'ONLINE',")
    lines.append("       'Ireland e2e seed stay'")
    lines.append("FROM pick_guests g")
    lines.append("JOIN pick_lots p ON p.rn = g.rn")
    lines.append("WHERE NOT EXISTS (")
    lines.append("    SELECT 1 FROM bookings b")
    lines.append("    WHERE b.user_id = g.user_id AND b.lot_id = p.lot_id AND b.special_requests = 'Ireland e2e seed stay'")
    lines.append(");")
    lines.append("")

    # Second wave of reviews using original seed guests (36-40) on additional lots
    lines.append("WITH extra_lots AS (")
    lines.append("    SELECT l.id AS lot_id, l.owner_id, l.price_per_night,")
    lines.append("           ROW_NUMBER() OVER (ORDER BY l.owner_id) AS rn")
    lines.append("    FROM lots l")
    lines.append("    JOIN owners o ON o.id = l.owner_id")
    lines.append("    WHERE o.is_deactivated = FALSE")
    lines.append("      AND l.id NOT IN (SELECT lot_id FROM bookings WHERE special_requests = 'Ireland e2e seed stay')")
    lines.append("),")
    lines.append("seed_guests AS (")
    lines.append("    SELECT id AS user_id, ROW_NUMBER() OVER (ORDER BY id) AS rn")
    lines.append("    FROM users WHERE email IN (")
    lines.append("        'family@example.com', 'solo@example.com', 'couple@example.com',")
    lines.append("        'adventure@example.com', 'group@example.com'")
    lines.append("    )")
    lines.append(")")
    lines.append("INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status,")
    lines.append("                     payment_status, service_fee, charge_total, booking_source, special_requests)")
    lines.append("SELECT g.user_id, p.lot_id,")
    lines.append("       DATE '2025-07-10' + (p.rn)::int,")
    lines.append("       DATE '2025-07-10' + (p.rn)::int + 3,")
    lines.append("       3,")
    lines.append("       p.price_per_night * 3,")
    lines.append("       'COMPLETED', 'CAPTURED',")
    lines.append("       ROUND(p.price_per_night * 3 * 0.10, 2),")
    lines.append("       ROUND(p.price_per_night * 3 * 1.10, 2),")
    lines.append("       'ONLINE',")
    lines.append("       'Ireland e2e extra stay'")
    lines.append("FROM extra_lots p")
    lines.append("JOIN seed_guests g ON g.rn = ((p.rn - 1) % 5) + 1")
    lines.append("WHERE p.rn <= 40")
    lines.append("  AND NOT EXISTS (")
    lines.append("    SELECT 1 FROM bookings b")
    lines.append("    WHERE b.user_id = g.user_id AND b.lot_id = p.lot_id AND b.special_requests = 'Ireland e2e extra stay'")
    lines.append(");")
    lines.append("")

    # Insert reviews for those bookings that do not already have one
    lines.append("INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, owner_response, owner_response_at,")
    lines.append("                     moderation_status, created_at, updated_at)")
    lines.append("SELECT b.user_id, l.owner_id, b.id,")
    lines.append("       (ARRAY[4.0, 4.5, 5.0, 4.0, 3.5, 5.0, 4.5, 4.0, 5.0, 3.5])[(((b.id % 10) + 1)::int)],")
    comments_sql = ", ".join(sql_str(c) for _, c in REVIEWS)
    replies_sql = ", ".join(sql_str(r) for r in OWNER_REPLIES)
    lines.append(f"       (ARRAY[{comments_sql}])[(((b.id % {len(REVIEWS)}) + 1)::int)],")
    lines.append(f"       CASE WHEN b.id % 5 = 0 THEN NULL ELSE (ARRAY[{replies_sql}])[(((b.id % {len(OWNER_REPLIES)}) + 1)::int)] END,")
    lines.append("       CASE WHEN b.id % 5 = 0 THEN NULL ELSE b.created_at + INTERVAL '3 days' END,")
    lines.append("       'APPROVED',")
    lines.append("       CURRENT_TIMESTAMP - INTERVAL '20 days' - (((b.id % 40)::text) || ' days')::interval,")
    lines.append("       CURRENT_TIMESTAMP - INTERVAL '10 days'")
    lines.append("FROM bookings b")
    lines.append("JOIN lots l ON l.id = b.lot_id")
    lines.append("WHERE b.special_requests IN ('Ireland e2e seed stay', 'Ireland e2e extra stay')")
    lines.append("  AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.booking_id = b.id);")
    lines.append("")

    lines.append("-- Future confirmed stays so owner calendars and guest trips are not empty")
    lines.append("INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status,")
    lines.append("                     payment_status, service_fee, charge_total, booking_source, special_requests)")
    lines.append("SELECT u.id, l.id,")
    lines.append("       CURRENT_DATE + (21 + (o.id % 30))::int,")
    lines.append("       CURRENT_DATE + (24 + (o.id % 30))::int,")
    lines.append("       2, l.price_per_night * 3,")
    lines.append("       'CONFIRMED', 'CAPTURED',")
    lines.append("       ROUND(l.price_per_night * 3 * 0.10, 2),")
    lines.append("       ROUND(l.price_per_night * 3 * 1.10, 2),")
    lines.append("       'ONLINE', 'Ireland e2e upcoming stay'")
    lines.append("FROM owners o")
    lines.append("JOIN lots l ON l.owner_id = o.id")
    lines.append("JOIN users u ON u.email = 'family@example.com'")
    lines.append("WHERE o.is_featured = TRUE")
    lines.append("  AND l.id = (SELECT MIN(l2.id) FROM lots l2 WHERE l2.owner_id = o.id)")
    lines.append("  AND NOT EXISTS (")
    lines.append("      SELECT 1 FROM bookings b WHERE b.lot_id = l.id AND b.special_requests = 'Ireland e2e upcoming stay'")
    lines.append("  );")
    lines.append("")

    lines.append("UPDATE owners o SET")
    lines.append("    rating = sub.avg_rating,")
    lines.append("    review_count = sub.cnt")
    lines.append("FROM (")
    lines.append("    SELECT owner_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS cnt")
    lines.append("    FROM reviews")
    lines.append("    WHERE moderation_status = 'APPROVED'")
    lines.append("    GROUP BY owner_id")
    lines.append(") sub")
    lines.append("WHERE o.id = sub.owner_id;")
    lines.append("")


def write_suppliers(lines: list[str]) -> None:
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 8. Local suppliers + offers in the newly covered counties")
    lines.append("--------------------------------------------------------------------------------")
    for email, name, cat, desc, county, town, address, lat, lng, phone, web in NEW_SUPPLIERS:
        lines.append(
            f"INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)"
        )
        lines.append(
            f"SELECT {sql_str(email)}, '{PASSWORD}', {sql_str(name)}, 'SUPPLIER', FALSE, TRUE, TRUE"
        )
        lines.append(f"WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = {sql_str(email)});")
        lines.append("")
        lines.append(
            "INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,"
        )
        lines.append("                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,")
        lines.append("                      stripe_subscription_id, subscription_current_period_end)")
        lines.append("SELECT u.id,")
        lines.append(f"       {sql_str(name)}, {sql_str(cat)}, {sql_str(desc)}, {sql_str(county)}, {sql_str(town)}, {sql_str(address)},")
        lines.append(f"       {sql_str(phone)}, {sql_str(web)}, TRUE, {lat}, {lng},")
        lines.append("       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,")
        lines.append("       CURRENT_TIMESTAMP + INTERVAL '365 days'")
        lines.append(f"FROM users u WHERE u.email = {sql_str(email)}")
        lines.append("  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);")
        lines.append("")
        lines.append("INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,")
        lines.append("                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)")
        lines.append("SELECT s.id,")
        lines.append(f"       {sql_str('Campsite guest rate')},")
        lines.append(f"       {sql_str('Show a valid My Island booking and save on the day. Limited daily capacity.')},")
        lines.append("       'PERCENTAGE', 15.00, 20.00,")
        lines.append(f"       {sql_str('One claim per booking. Subject to availability. Cannot be combined with other offers.')},")
        lines.append("       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,")
        img_url = img("coast", hash(email) % 4)
        lines.append(f"       {sql_str(img_url)}")
        lines.append("FROM suppliers s JOIN users u ON s.user_id = u.id")
        lines.append(f"WHERE u.email = {sql_str(email)}")
        lines.append("  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');")
        lines.append("")

        lines.append("INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)")
        lines.append("SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',")
        lines.append(f"       {sql_str(img_url)}, 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, {sql_str(name)}")
        lines.append("FROM suppliers s JOIN users u ON s.user_id = u.id")
        lines.append(f"WHERE u.email = {sql_str(email)}")
        lines.append("  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');")
        lines.append("")


def write_pricing_and_blocks(lines: list[str]) -> None:
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 9. Peak-season pricing + a few blocked dates so calendars look lived-in")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("INSERT INTO seasonal_pricing_rules (owner_id, lot_type, name, start_date, end_date, price_per_night, min_stay)")
    lines.append("SELECT o.id, l.lot_type, 'Summer peak',")
    lines.append("       (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' + INTERVAL '6 months')::date,")
    lines.append("       (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' + INTERVAL '8 months')::date,")
    lines.append("       ROUND(l.price_per_night * 1.25, 2),")
    lines.append("       GREATEST(l.min_stay, 2)")
    lines.append("FROM owners o")
    lines.append("JOIN LATERAL (")
    lines.append("    SELECT lot_type, MIN(price_per_night) AS price_per_night, MIN(min_stay) AS min_stay")
    lines.append("    FROM lots WHERE owner_id = o.id")
    lines.append("    GROUP BY lot_type")
    lines.append(") l ON TRUE")
    lines.append("WHERE o.is_featured = TRUE")
    lines.append("  AND NOT EXISTS (")
    lines.append("      SELECT 1 FROM seasonal_pricing_rules r")
    lines.append("      WHERE r.owner_id = o.id AND r.name = 'Summer peak' AND r.lot_type = l.lot_type")
    lines.append("  );")
    lines.append("")
    lines.append("INSERT INTO lot_blocked_periods (lot_id, start_date, end_date, reason, created_by)")
    lines.append("SELECT l.id,")
    lines.append("       CURRENT_DATE + 40,")
    lines.append("       CURRENT_DATE + 43,")
    lines.append("       'Private event / site maintenance',")
    lines.append("       o.user_id")
    lines.append("FROM lots l")
    lines.append("JOIN owners o ON o.id = l.owner_id")
    lines.append("WHERE o.is_featured = TRUE")
    lines.append("  AND l.id = (SELECT MAX(l2.id) FROM lots l2 WHERE l2.owner_id = o.id)")
    lines.append("  AND NOT EXISTS (")
    lines.append("      SELECT 1 FROM lot_blocked_periods bp WHERE bp.lot_id = l.id AND bp.reason = 'Private event / site maintenance'")
    lines.append("  );")
    lines.append("")


def write_footer(lines: list[str]) -> None:
    lines.append("--------------------------------------------------------------------------------")
    lines.append("-- 10. Sanity: keep Lough Derg / Dingle Kayak as the unsubscribed test pair")
    lines.append("--------------------------------------------------------------------------------")
    lines.append("UPDATE owners SET subscription_status = 'NONE',")
    lines.append("    stripe_customer_id = NULL, stripe_subscription_id = NULL, subscription_current_period_end = NULL")
    lines.append("WHERE user_id = (SELECT id FROM users WHERE email = 'bookings@loughdergcamping.ie');")
    lines.append("")
    lines.append("UPDATE suppliers SET subscription_status = 'NONE',")
    lines.append("    stripe_customer_id = NULL, stripe_subscription_id = NULL, subscription_current_period_end = NULL")
    lines.append("WHERE user_id = (SELECT id FROM users WHERE email = 'hello@dinglekayak.ie');")
    lines.append("")
    lines.append("-- Instant booking on for the catalogue (except a couple of request-to-book sites)")
    lines.append("UPDATE owners SET instant_booking = TRUE WHERE instant_booking IS DISTINCT FROM TRUE;")
    lines.append("UPDATE owners SET instant_booking = FALSE")
    lines.append("WHERE property_name IN ('Black Valley Wild', 'Donegal Wild Camping', 'Cape Clear Island');")
    lines.append("")


def main() -> None:
    lines: list[str] = []
    write_header(lines)
    write_new_sites(lines)
    write_enrich_existing(lines)
    write_images_and_featured(lines)
    write_guests_bookings_reviews(lines)
    write_suppliers(lines)
    write_pricing_and_blocks(lines)
    write_footer(lines)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(lines)} lines)")


if __name__ == "__main__":
    main()
