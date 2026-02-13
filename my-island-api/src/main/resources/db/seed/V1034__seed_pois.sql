INSERT INTO points_of_interest (name, description, category, latitude, longitude, county, town, difficulty, distance_km, website_url) VALUES

-- ============================================================
-- TRAILS (19)
-- ============================================================
('Wicklow Way', 'Ireland''s oldest and most popular long-distance trail through the Wicklow Mountains from Dublin to Carlow.', 'TRAIL', 53.27, -6.32, 'Wicklow', 'Dublin', 'MODERATE', 131.0, 'https://www.wicklowway.com'),
('Kerry Way', 'Ireland''s longest waymarked trail circumnavigating the Iveragh Peninsula through mountains and coast.', 'TRAIL', 52.06, -9.51, 'Kerry', 'Killarney', 'MODERATE', 214.0, NULL),
('Dingle Way', 'Circular route exploring the beautiful Dingle Peninsula with coastal and mountain views.', 'TRAIL', 52.14, -10.27, 'Kerry', 'Tralee', 'MODERATE', 162.0, NULL),
('Beara Way', 'Circular trail around the remote Beara Peninsula along Ireland''s rugged southwest coast.', 'TRAIL', 51.75, -9.53, 'Cork', 'Glengarriff', 'MODERATE', 206.0, NULL),
('Burren Way', 'Scenic trail through Europe''s largest karst limestone landscape and unique flora.', 'TRAIL', 52.94, -9.06, 'Clare', 'Ballyvaughan', 'MODERATE', 114.0, NULL),
('Sheep''s Head Way', 'Peaceful peninsula walk with spectacular coastal views along one of Ireland''s quietest peninsulas.', 'TRAIL', 51.54, -9.85, 'Cork', 'Bantry', 'EASY', 88.0, NULL),
('Causeway Coast Way', 'Coastal path linking the Giant''s Causeway, Carrick-a-Rede rope bridge, and dramatic cliff scenery.', 'TRAIL', 55.24, -6.51, 'Antrim', 'Ballycastle', 'EASY', 51.0, NULL),
('Cuilcagh Boardwalk', 'The Stairway to Heaven boardwalk trail leading to panoramic views from the summit.', 'TRAIL', 54.2053, -7.8012, 'Fermanagh', 'Florencecourt', 'MODERATE', 7.5, NULL),
('Diamond Hill', 'Popular hill walk in Connemara National Park with stunning 360-degree views of the Twelve Bens.', 'TRAIL', 53.5450, -9.9430, 'Galway', 'Letterfrack', 'MODERATE', 7.0, 'https://www.connemaranationalpark.ie'),
('Cliffs of Moher Coastal Walk', 'Dramatic coastal path along Europe''s most famous sea cliffs from Doolin to Hags Head.', 'TRAIL', 52.97, -9.43, 'Clare', 'Doolin', 'MODERATE', 20.0, 'https://www.cliffsofmoher.ie'),
('Howth Cliff Walk', 'Scenic coastal loop with harbour views and dramatic cliffs just north of Dublin.', 'TRAIL', 53.38, -6.06, 'Dublin', 'Howth', 'EASY', 6.0, NULL),
('Bray to Greystones Cliff Walk', 'Popular coastal path along the Irish Sea with views of Bray Head and the Wicklow coast.', 'TRAIL', 53.20, -6.09, 'Wicklow', 'Bray', 'EASY', 7.0, NULL),
('Glendalough Spinc Walk', 'Challenging loop with boardwalk through ancient oak woodland overlooking the Upper Lake.', 'TRAIL', 53.01, -6.35, 'Wicklow', 'Laragh', 'DIFFICULT', 11.0, NULL),
('Gap of Dunloe', 'Narrow mountain pass through MacGillycuddy''s Reeks with glacial lakes and towering rock walls.', 'TRAIL', 52.03, -9.68, 'Kerry', 'Killarney', 'MODERATE', 11.0, NULL),
('Killary Harbour Green Road', 'Historic famine road along Ireland''s only fjord with mountain and sea views.', 'TRAIL', 53.60, -9.77, 'Galway', 'Leenane', 'EASY', 9.0, NULL),
('Glenariff Waterfall Walk', 'Stunning waterfall trail in the Queen of the Glens of Antrim through mossy gorges.', 'TRAIL', 54.99, -6.08, 'Antrim', 'Cushendall', 'MODERATE', 5.0, NULL),
('Torc Mountain', 'Steep ascent rewarded with spectacular panoramic views over the Killarney Lakes.', 'TRAIL', 52.01, -9.56, 'Kerry', 'Killarney', 'DIFFICULT', 5.0, NULL),
('Slieve League Cliff Path', 'Walk to the summit of some of Europe''s highest accessible sea cliffs at nearly 600m.', 'TRAIL', 54.64, -8.71, 'Donegal', 'Carrick', 'DIFFICULT', 10.0, NULL),
('Ballyhoura Way', 'Forest and moorland trail through the Ballyhoura Mountains on the Limerick-Cork border.', 'TRAIL', 52.38, -8.52, 'Limerick', 'Ardpatrick', 'MODERATE', 90.0, NULL),

-- ============================================================
-- BEACHES (24)
-- ============================================================
('Inch Beach', 'Stunning 5km sand spit extending into Dingle Bay, popular for surfing and walking.', 'BEACH', 52.1337, -9.9710, 'Kerry', 'Inch', NULL, NULL, NULL),
('Derrynane Beach', 'Pristine golden sands and turquoise waters within the Derrynane National Historic Park.', 'BEACH', 51.7654, -10.1209, 'Kerry', 'Caherdaniel', NULL, NULL, NULL),
('Coumeenoole Beach', 'Dramatic cove beach on the Slea Head drive with spectacular crashing Atlantic waves.', 'BEACH', 52.1093, -10.4649, 'Kerry', 'Dunquin', NULL, NULL, NULL),
('Ventry Beach', 'Breathtaking crescent of golden sand with crystal-clear turquoise waters sheltered by Mount Eagle.', 'BEACH', 52.1333, -10.3617, 'Kerry', 'Ventry', NULL, NULL, NULL),
('Rossbeigh Beach', 'Beautiful Blue Flag beach with miles of golden sand along the Ring of Kerry.', 'BEACH', 52.0547, -9.9435, 'Kerry', 'Glenbeigh', NULL, NULL, NULL),
('Ballybunion Beach', 'Famous surfing beach on the north Kerry coast backed by dramatic eroded cliffs.', 'BEACH', 52.5111, -9.6710, 'Kerry', 'Ballybunion', NULL, NULL, NULL),
('Keem Bay', 'Spectacular secluded Blue Flag beach on the western tip of Achill Island.', 'BEACH', 53.9676, -10.1925, 'Mayo', 'Achill Island', NULL, NULL, NULL),
('Dog''s Bay', 'Unique horseshoe-shaped beach in Connemara with white coral sand and turquoise waters.', 'BEACH', 53.3935, -10.0560, 'Galway', 'Roundstone', NULL, NULL, NULL),
('Fanore Beach', 'Pristine Blue Flag beach at the base of the Burren with wild Atlantic beauty.', 'BEACH', 53.1175, -9.2868, 'Clare', 'Fanore', NULL, NULL, NULL),
('Lahinch Beach', 'Popular surfing beach with consistent waves and a lively seaside village in Clare.', 'BEACH', 52.9322, -9.3422, 'Clare', 'Lahinch', NULL, NULL, NULL),
('Barleycove Beach', 'Sheltered crescent-shaped beach with sand dunes near Mizen Head in West Cork.', 'BEACH', 51.4638, -9.7824, 'Cork', 'Goleen', NULL, NULL, NULL),
('Inchydoney Beach', 'Two magnificent Blue Flag sandy crescents near Clonakilty with crystal-clear waters.', 'BEACH', 51.6020, -8.8760, 'Cork', 'Clonakilty', NULL, NULL, NULL),
('Strandhill Beach', 'Lively surfing beach near Sligo with varied waves and stunning Knocknarea views.', 'BEACH', 54.2703, -8.5967, 'Sligo', 'Strandhill', NULL, NULL, NULL),
('Bundoran Beach', 'Ireland''s surf capital with world-class reef waves including the famous Peak.', 'BEACH', 54.4767, -8.2833, 'Donegal', 'Bundoran', NULL, NULL, NULL),
('Silver Strand Malin Beg', 'Spectacular horseshoe-shaped beach in southwest Donegal accessed by steep steps through cliffs.', 'BEACH', 54.6642, -8.7742, 'Donegal', 'Glencolmcille', NULL, NULL, NULL),
('Portsalon Beach', 'Once voted the second most beautiful beach in the world with views of Lough Swilly.', 'BEACH', 55.2050, -7.6370, 'Donegal', 'Portsalon', NULL, NULL, NULL),
('Tra na Rossan', 'Stunning hidden cove on the Rosguill Peninsula with calm waters and pristine sand.', 'BEACH', 55.2292, -7.8037, 'Donegal', 'Downings', NULL, NULL, NULL),
('Whiterocks Beach', 'Famous beach near Portrush with distinctive white limestone cliffs and sea caves.', 'BEACH', 55.1959, -6.6493, 'Antrim', 'Portrush', NULL, NULL, NULL),
('Benone Strand', 'One of Ireland''s longest Blue Flag beaches stretching for miles along the Causeway Coast.', 'BEACH', 55.1650, -6.8580, 'Derry', 'Limavady', NULL, NULL, NULL),
('Murlough Beach', 'Beautiful beach within a National Nature Reserve backed by ancient dunes and the Mournes.', 'BEACH', 54.2450, -5.8480, 'Down', 'Newcastle', NULL, NULL, NULL),
('Curracloe Beach', 'Breathtaking 10-kilometre stretch of golden sand backed by marram-grass dunes in Wexford.', 'BEACH', 52.3932, -6.3921, 'Wexford', 'Curracloe', NULL, NULL, NULL),
('Brittas Bay', 'Stunning Blue Flag beach in Wicklow with miles of golden sand, popular with Dubliners.', 'BEACH', 52.8833, -6.0500, 'Wicklow', 'Brittas Bay', NULL, NULL, NULL),
('Dollymount Strand', 'Long sandy beach on Bull Island in north Dublin with views of Howth and Dublin Bay.', 'BEACH', 53.3670, -6.1394, 'Dublin', 'Dublin', NULL, NULL, NULL),
('Killiney Bay', 'Scenic pebble beach south of Dublin with beautiful views often compared to the Bay of Naples.', 'BEACH', 53.2615, -6.0986, 'Dublin', 'Killiney', NULL, NULL, NULL),

-- ============================================================
-- CASTLES (20)
-- ============================================================
('Blarney Castle', 'Medieval stronghold famous for the Blarney Stone said to bestow the gift of eloquence.', 'CASTLE', 51.9291, -8.5707, 'Cork', 'Blarney', NULL, NULL, 'https://www.blarneycastle.ie'),
('Kilkenny Castle', 'Medieval castle and former seat of the Butler family in the heart of Kilkenny city.', 'CASTLE', 52.6542, -7.2522, 'Kilkenny', 'Kilkenny', NULL, NULL, 'https://heritageireland.ie/places-to-visit/kilkenny-castle/'),
('Bunratty Castle', '15th-century medieval fortress and one of Ireland''s most complete and well-restored castles.', 'CASTLE', 52.6996, -8.8119, 'Clare', 'Bunratty', NULL, NULL, 'https://www.bunrattycastle.ie'),
('Cahir Castle', 'One of Ireland''s largest and best-preserved castles on an island in the River Suir.', 'CASTLE', 52.3744, -7.9271, 'Tipperary', 'Cahir', NULL, NULL, NULL),
('Trim Castle', 'Largest Anglo-Norman castle in Ireland, used as a filming location for Braveheart.', 'CASTLE', 53.5546, -6.7900, 'Meath', 'Trim', NULL, NULL, NULL),
('Ross Castle', '15th-century tower house on the edge of Lough Leane in Killarney National Park.', 'CASTLE', 52.0384, -9.5152, 'Kerry', 'Killarney', NULL, NULL, NULL),
('Dunguaire Castle', '16th-century tower house on the shores of Galway Bay, famous for its medieval banquets.', 'CASTLE', 53.1422, -8.9261, 'Galway', 'Kinvara', NULL, NULL, NULL),
('Ashford Castle', 'Luxury castle hotel on the shores of Lough Corrib, originally built in 1228.', 'CASTLE', 53.5350, -9.2840, 'Mayo', 'Cong', NULL, NULL, 'https://ashfordcastle.com'),
('Malahide Castle', '12th-century castle with medieval and Victorian interiors set in parkland near Dublin.', 'CASTLE', 53.4449, -6.1646, 'Dublin', 'Malahide', NULL, NULL, 'https://malahidecastleandgardens.ie'),
('Dunluce Castle', 'Dramatic ruined medieval castle perched on the edge of a basalt outcrop above the sea.', 'CASTLE', 55.2106, -6.5794, 'Antrim', 'Bushmills', NULL, NULL, NULL),
('Kylemore Abbey', 'Benedictine monastery in a stunning Victorian castle nestled in the Connemara mountains.', 'CASTLE', 53.5570, -9.8862, 'Galway', 'Letterfrack', NULL, NULL, 'https://www.kylemoreabbey.com'),
('Birr Castle', 'Historic castle and gardens home to the Great Telescope, once the world''s largest.', 'CASTLE', 53.0953, -7.9155, 'Offaly', 'Birr', NULL, NULL, 'https://birrcastle.com'),
('Dublin Castle', 'Historic castle and government complex in the heart of Dublin dating to 1204.', 'CASTLE', 53.3427, -6.2671, 'Dublin', 'Dublin', NULL, NULL, 'https://www.dublincastle.ie'),
('King John''s Castle', '13th-century fortress on King''s Island beside the River Shannon in Limerick.', 'CASTLE', 52.6684, -8.6271, 'Limerick', 'Limerick', NULL, NULL, NULL),
('Carrickfergus Castle', 'Norman castle built in 1177, one of the best-preserved medieval structures in Ireland.', 'CASTLE', 54.7137, -5.8063, 'Antrim', 'Carrickfergus', NULL, NULL, NULL),
('Donegal Castle', '15th-century stronghold of the O''Donnell clan, beautifully restored in Donegal Town.', 'CASTLE', 54.6549, -8.1097, 'Donegal', 'Donegal Town', NULL, NULL, NULL),
('Lismore Castle', 'Historic castle on the Blackwater River, Irish seat of the Duke of Devonshire since 1753.', 'CASTLE', 52.1333, -7.9333, 'Waterford', 'Lismore', NULL, NULL, NULL),
('Enniskillen Castle', '16th-century waterside castle housing the Fermanagh County Museum.', 'CASTLE', 54.3460, -7.6440, 'Fermanagh', 'Enniskillen', NULL, NULL, NULL),
('Portumna Castle', 'Early 17th-century semi-fortified house with Renaissance-style gardens on Lough Derg.', 'CASTLE', 53.0866, -8.2206, 'Galway', 'Portumna', NULL, NULL, NULL),
('Reginald''s Tower', 'Viking-era tower and Ireland''s oldest civic building, now the Waterford Viking Museum.', 'CASTLE', 52.2621, -7.1122, 'Waterford', 'Waterford', NULL, NULL, NULL),

-- ============================================================
-- HERITAGE (15)
-- ============================================================
('Newgrange', 'Prehistoric passage tomb and UNESCO site, older than Stonehenge and the Great Pyramids.', 'HERITAGE', 53.6947, -6.4754, 'Meath', 'Donore', NULL, NULL, 'https://www.newgrange.com'),
('Knowth', 'Neolithic passage tomb with Europe''s largest collection of megalithic art.', 'HERITAGE', 53.7010, -6.4883, 'Meath', 'Donore', NULL, NULL, NULL),
('Dowth', 'Neolithic passage tomb completing the trio of monuments at the Bru na Boinne UNESCO site.', 'HERITAGE', 53.7037, -6.4506, 'Meath', 'Donore', NULL, NULL, NULL),
('Hill of Tara', 'Ancient seat of the High Kings of Ireland with ceremonial and burial monuments.', 'HERITAGE', 53.5810, -6.6095, 'Meath', 'Navan', NULL, NULL, NULL),
('Glendalough', 'Early medieval monastic settlement with round tower in a glacial valley in the Wicklow Mountains.', 'HERITAGE', 53.0113, -6.3296, 'Wicklow', 'Laragh', NULL, NULL, 'https://www.glendalough.ie'),
('Rock of Cashel', 'Spectacular group of medieval buildings on a limestone outcrop including round tower and cathedral.', 'HERITAGE', 52.5201, -7.8904, 'Tipperary', 'Cashel', NULL, NULL, NULL),
('Clonmacnoise', '6th-century monastic settlement with high crosses, round towers, and cathedral ruins on the Shannon.', 'HERITAGE', 53.3260, -7.9868, 'Offaly', 'Shannonbridge', NULL, NULL, NULL),
('Jerpoint Abbey', '12th-century Cistercian abbey with remarkable medieval stone carvings and sculpture.', 'HERITAGE', 52.5109, -7.1575, 'Kilkenny', 'Thomastown', NULL, NULL, NULL),
('Gallarus Oratory', 'Early Christian drystone church from the 11th-12th century on the Dingle Peninsula.', 'HERITAGE', 52.1718, -10.3532, 'Kerry', 'Dingle', NULL, NULL, NULL),
('Dun Aonghasa', 'Prehistoric stone fort perched dramatically on a 100-metre cliff edge on Inis Mor.', 'HERITAGE', 53.1256, -9.7697, 'Galway', 'Kilronan', NULL, NULL, NULL),
('Poulnabrone Dolmen', 'Neolithic portal tomb dating to 3200 BC in the limestone landscape of the Burren.', 'HERITAGE', 53.0471, -9.1406, 'Clare', 'Ballyvaughan', NULL, NULL, NULL),
('Drombeg Stone Circle', 'Bronze Age stone circle of 17 stones aligned with the winter solstice sunset.', 'HERITAGE', 51.5646, -9.0870, 'Cork', 'Glandore', NULL, NULL, NULL),
('Ceide Fields', 'Neolithic farming landscape with the oldest known field systems in the world, over 5,000 years old.', 'HERITAGE', 54.3056, -9.4585, 'Mayo', 'Ballycastle', NULL, NULL, NULL),
('Kilmainham Gaol', 'Historic prison and monument to Irish nationalism where leaders of the 1916 Rising were executed.', 'HERITAGE', 53.3419, -6.3095, 'Dublin', 'Dublin', NULL, NULL, 'https://www.kilmainhamgaolmuseum.ie'),
('Loughcrew Cairns', 'Neolithic passage tomb cemetery with Megalithic art older than Newgrange on hilltops in Meath.', 'HERITAGE', 53.7447, -7.1178, 'Meath', 'Oldcastle', NULL, NULL, NULL),

-- ============================================================
-- MOUNTAINS (12)
-- ============================================================
('Carrauntoohil', 'Ireland''s highest peak at 1,038m in the MacGillycuddy''s Reeks mountain range.', 'MOUNTAIN', 51.9990, -9.7440, 'Kerry', 'Beaufort', 'STRENUOUS', 13.0, NULL),
('Croagh Patrick', 'Ireland''s holy mountain and pilgrimage site at 764m with panoramic views of Clew Bay.', 'MOUNTAIN', 53.7601, -9.9019, 'Mayo', 'Murrisk', 'DIFFICULT', 7.0, 'https://www.croagh-patrick.com'),
('Lugnaquilla', 'Highest of the Wicklow Mountains at 925m with sweeping views across Leinster.', 'MOUNTAIN', 52.9633, -6.4667, 'Wicklow', 'Glenmalure', 'MODERATE', 12.0, NULL),
('Errigal', 'Distinctive quartzite cone at 751m, the highest peak in Donegal and an iconic silhouette.', 'MOUNTAIN', 55.0344, -8.1128, 'Donegal', 'Gweedore', 'MODERATE', 4.5, NULL),
('Slieve Donard', 'Northern Ireland''s highest peak at 850m, gateway to the Mourne Mountains.', 'MOUNTAIN', 54.1803, -5.9208, 'Down', 'Newcastle', 'MODERATE', 9.0, NULL),
('Brandon Mountain', 'Ireland''s second-highest peak at 952m on the Dingle Peninsula with an ancient pilgrim path.', 'MOUNTAIN', 52.2350, -10.2350, 'Kerry', 'Dingle', 'DIFFICULT', 8.0, NULL),
('Galtymore', 'Highest of the Galtee Mountains at 919m, straddling Tipperary and Limerick.', 'MOUNTAIN', 52.3750, -8.1850, 'Tipperary', 'Cahir', 'MODERATE', 10.0, NULL),
('Mweelrea', 'Highest peak in Connacht at 814m, overlooking Killary Harbour fjord.', 'MOUNTAIN', 53.6500, -9.8200, 'Mayo', 'Leenane', 'DIFFICULT', 12.0, NULL),
('Knocknarea', 'Limestone hill at 327m topped with Queen Maeve''s Cairn, a massive Neolithic passage tomb.', 'MOUNTAIN', 54.2588, -8.5746, 'Sligo', 'Sligo', 'EASY', 3.0, NULL),
('Twelve Bens', 'Dramatic quartzite mountain range in Connemara with Benbaun as the highest peak at 729m.', 'MOUNTAIN', 53.5001, -9.8100, 'Galway', 'Clifden', 'DIFFICULT', 15.0, NULL),
('Mount Leinster', 'Highest peak in the Blackstairs Mountains at 796m with panoramic views across five counties.', 'MOUNTAIN', 52.6160, -6.7330, 'Carlow', 'Borris', 'MODERATE', 8.0, NULL),
('Mangerton Mountain', 'Mountain at 838m in Killarney National Park featuring the Devil''s Punch Bowl crater lake.', 'MOUNTAIN', 51.9580, -9.4830, 'Kerry', 'Killarney', 'MODERATE', 11.0, NULL),

-- ============================================================
-- LAKES (7)
-- ============================================================
('Lough Corrib', 'Largest lake in the Republic of Ireland, renowned for brown trout and salmon fishing.', 'LAKE', 53.4000, -9.3000, 'Galway', 'Oughterard', NULL, NULL, NULL),
('Lough Derg', 'Third largest lake in Ireland on the River Shannon, popular for boating and fishing.', 'LAKE', 52.9000, -8.4000, 'Clare', 'Killaloe', NULL, NULL, NULL),
('Lough Leane', 'Largest of Killarney''s three lakes surrounded by MacGillycuddy''s Reeks and ancient oak forest.', 'LAKE', 52.0330, -9.5330, 'Kerry', 'Killarney', NULL, NULL, NULL),
('Lough Tay', 'Dark mountain lake known as the Guinness Lake for its resemblance to a pint of stout.', 'LAKE', 53.1147, -6.2700, 'Wicklow', 'Roundwood', NULL, NULL, NULL),
('Glendalough Upper Lake', 'Glacial lake in the valley of two lakes surrounded by oak woodland and granite cliffs.', 'LAKE', 53.0069, -6.3446, 'Wicklow', 'Laragh', NULL, NULL, NULL),
('Lough Hyne', 'Ireland''s first Marine Nature Reserve, a unique saltwater lake connected to the sea by rapids.', 'LAKE', 51.5021, -9.3055, 'Cork', 'Skibbereen', NULL, NULL, NULL),
('Gougane Barra Lake', 'Source of the River Lee with a serene island oratory in a dramatic mountain setting.', 'LAKE', 51.8333, -9.3167, 'Cork', 'Ballingeary', NULL, NULL, NULL),

-- ============================================================
-- WATERFALLS (7)
-- ============================================================
('Powerscourt Waterfall', 'Ireland''s highest waterfall at 121m, set in the beautiful Powerscourt Estate.', 'WATERFALL', 53.1503, -6.2115, 'Wicklow', 'Enniskerry', 'EASY', 1.5, 'https://powerscourt.com/our-waterfall/'),
('Torc Waterfall', 'Beautiful 20m cascade in Killarney National Park, easily accessible from the road.', 'WATERFALL', 51.9822, -9.5860, 'Kerry', 'Killarney', 'EASY', 2.0, NULL),
('Mahon Falls', '80m waterfall tumbling down the Comeragh Mountains, reached by a gentle 20-minute walk.', 'WATERFALL', 52.2500, -7.5330, 'Waterford', 'Lemybrien', 'EASY', 2.0, NULL),
('Aasleagh Falls', 'Picturesque 10m waterfall where the Erriff River meets Killary Harbour fjord.', 'WATERFALL', 53.6330, -9.7000, 'Mayo', 'Leenane', NULL, NULL, NULL),
('Glencar Waterfall', 'Scenic waterfall that inspired the poetry of W.B. Yeats, set in a lush green valley.', 'WATERFALL', 54.3397, -8.3525, 'Leitrim', 'Glencar', 'EASY', 1.0, NULL),
('Assaranca Waterfall', '20m roadside waterfall near Ardara in the Donegal Highlands.', 'WATERFALL', 54.7586, -8.5136, 'Donegal', 'Ardara', NULL, NULL, NULL),
('Glenevin Waterfall', 'Charming 12m waterfall reached by an easy family-friendly forest trail in Donegal.', 'WATERFALL', 55.3200, -7.3900, 'Donegal', 'Clonmany', 'EASY', 2.0, NULL),

-- ============================================================
-- VIEWPOINTS (5)
-- ============================================================
('Ladies View', 'Iconic Ring of Kerry viewpoint overlooking the Upper Lake in Killarney National Park.', 'VIEWPOINT', 51.9614, -9.6903, 'Kerry', 'Killarney', NULL, NULL, NULL),
('Slieve League Cliffs', 'Among the highest sea cliffs in Europe at nearly 600m, with breathtaking Atlantic panoramas.', 'VIEWPOINT', 54.6370, -8.6820, 'Donegal', 'Teelin', 'MODERATE', 5.5, NULL),
('Healy Pass', 'Mountain pass at 334m linking Cork and Kerry with dramatic hairpin bends and mountain views.', 'VIEWPOINT', 51.7220, -9.7570, 'Cork', 'Adrigole', NULL, NULL, NULL),
('Conor Pass', 'Ireland''s highest mountain pass at 456m on the Dingle Peninsula with sweeping views.', 'VIEWPOINT', 52.1850, -10.0330, 'Kerry', 'Dingle', NULL, NULL, NULL),
('Sky Road', 'Scenic 16km coastal loop near Clifden with panoramic views of the Atlantic and offshore islands.', 'VIEWPOINT', 53.5160, -10.0670, 'Galway', 'Clifden', NULL, NULL, NULL),

-- ============================================================
-- ISLANDS (7)
-- ============================================================
('Skellig Michael', 'UNESCO World Heritage island monastery off the Kerry coast, a Star Wars filming location.', 'ISLAND', 51.7710, -10.5385, 'Kerry', 'Portmagee', 'STRENUOUS', 2.5, NULL),
('Inis Mor', 'Largest of the Aran Islands with the ancient cliff-edge fort of Dun Aonghasa and traditional culture.', 'ISLAND', 53.1208, -9.7232, 'Galway', 'Kilronan', NULL, NULL, 'https://www.aranislands.ie'),
('Great Blasket Island', 'Uninhabited island with rich Irish literary heritage, inhabited until 1953.', 'ISLAND', 52.0895, -10.5360, 'Kerry', 'Dunquin', NULL, NULL, NULL),
('Achill Island', 'Ireland''s largest island connected by bridge with dramatic cliffs, beaches, and deserted village.', 'ISLAND', 53.9670, -10.0670, 'Mayo', 'Achill Sound', NULL, NULL, NULL),
('Valentia Island', 'Island off the Ring of Kerry with a historic slate quarry and 385-million-year-old Tetrapod trackway.', 'ISLAND', 51.9309, -10.3438, 'Kerry', 'Knightstown', NULL, NULL, NULL),
('Cape Clear Island', 'Southernmost inhabited Irish island and Gaeltacht area with an international bird observatory.', 'ISLAND', 51.4388, -9.4923, 'Cork', 'Baltimore', NULL, NULL, NULL),
('Tory Island', 'Remote island 14.5km off the Donegal coast with a unique king, culture, and artist colony.', 'ISLAND', 55.2644, -8.2219, 'Donegal', 'Falcarragh', NULL, NULL, NULL),

-- ============================================================
-- LANDMARKS (7)
-- ============================================================
('Cliffs of Moher', 'Ireland''s most visited natural attraction, with dramatic sea cliffs rising 214m above the Atlantic.', 'LANDMARK', 52.9715, -9.4309, 'Clare', 'Liscannor', NULL, NULL, 'https://www.cliffsofmoher.ie'),
('Giant''s Causeway', 'UNESCO World Heritage Site featuring around 40,000 interlocking basalt columns.', 'LANDMARK', 55.2408, -6.5116, 'Antrim', 'Bushmills', NULL, NULL, 'https://www.nationaltrust.org.uk/giants-causeway'),
('Mizen Head', 'Ireland''s most south-westerly point with a dramatic signal station and bridge over a sea chasm.', 'LANDMARK', 51.4500, -9.8137, 'Cork', 'Goleen', 'EASY', 2.0, 'https://www.mizenhead.ie'),
('Malin Head', 'Ireland''s most northerly point with wild coastal scenery and WWII lookout posts.', 'LANDMARK', 55.3817, -7.3714, 'Donegal', 'Malin', 'EASY', 3.0, NULL),
('Hook Lighthouse', 'One of the oldest operational lighthouses in the world, guiding ships for over 800 years.', 'LANDMARK', 52.1234, -6.9307, 'Wexford', 'Fethard-on-Sea', NULL, NULL, 'https://hookheritage.ie'),
('Fastnet Rock', 'Ireland''s most southerly point with an iconic lighthouse on a rock 13km off the Cork coast.', 'LANDMARK', 51.3894, -9.6028, 'Cork', 'Baltimore', NULL, NULL, NULL),
('Loop Head', 'Dramatic headland at the tip of County Clare with a lighthouse and spectacular coastal scenery.', 'LANDMARK', 52.5607, -9.9327, 'Clare', 'Kilbaha', NULL, NULL, NULL);
