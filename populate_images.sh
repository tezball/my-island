#!/bin/bash
# populate_images.sh
# Populates public/images/lots with placeholders for all images referenced in V999 and V1005

SOURCE_DIR="docs/test-images"
DEST_DIR="my-island-web/public/images/lots"

mkdir -p "$DEST_DIR"

# Source images
TENT_IMG="$SOURCE_DIR/camping-tent-forest.jpg"
POD_IMG="$SOURCE_DIR/glamping-bell-tent.jpg"
CAMPER_IMG="$SOURCE_DIR/camping-lake-tent.jpg"
CABIN_IMG="$SOURCE_DIR/camping-night-campfire.jpg"

echo "Populating images..."

# Function to copy if not exists
copy_img() {
    src=$1
    dest="$DEST_DIR/$2"
    if [ ! -f "$dest" ]; then
        cp "$src" "$dest"
        echo "Created $2"
    fi
}

# 1. Ensure Generics exist (already done, but good for completeness)
copy_img "$TENT_IMG" "generic-tent.jpg"
copy_img "$POD_IMG" "generic-pod.jpg"
copy_img "$CAMPER_IMG" "generic-camper.jpg"

# 2. Map specific images from V999 (Scanning the file content I saw earlier)

# Nore Valley (Owner 1)
copy_img "$TENT_IMG" "riverside-1.jpg"
copy_img "$TENT_IMG" "riverside-2.jpg"
copy_img "$TENT_IMG" "riverside-3.jpg"
copy_img "$CAMPER_IMG" "hardstanding-a.jpg"
copy_img "$CAMPER_IMG" "hardstanding-b.jpg"
copy_img "$CAMPER_IMG" "hardstanding-c.jpg"
copy_img "$POD_IMG" "bell-tent.jpg"
copy_img "$CABIN_IMG" "treehouse.jpg"

# Wild Atlantic (Owner 2)
copy_img "$POD_IMG" "cliff-pod-1.jpg"
copy_img "$POD_IMG" "cliff-pod-2.jpg"
copy_img "$POD_IMG" "cliff-pod-3.jpg"
copy_img "$POD_IMG" "atlantic-yurt.jpg"
copy_img "$CABIN_IMG" "cosy-cabin.jpg"
copy_img "$POD_IMG" "stargazer-dome.jpg"

# Lakeside (Owner 3)
copy_img "$TENT_IMG" "lakeshore-1.jpg"
copy_img "$TENT_IMG" "lakeshore-2.jpg"
copy_img "$CABIN_IMG" "anglers-cabin.jpg"
copy_img "$CABIN_IMG" "family-chalet.jpg"
copy_img "$CAMPER_IMG" "campervan-bay-1.jpg"

# Clifden (Owner 4)
copy_img "$TENT_IMG" "wild-pitch-1.jpg"
copy_img "$TENT_IMG" "wild-pitch-2.jpg"
copy_img "$POD_IMG" "eco-pod.jpg"
copy_img "$CABIN_IMG" "hobbit-hut.jpg"
copy_img "$POD_IMG" "connemara-tipi.jpg"

# Dingle (Owner 5)
copy_img "$TENT_IMG" "bay-view-1.jpg"
copy_img "$TENT_IMG" "bay-view-2.jpg"
copy_img "$TENT_IMG" "bay-view-3.jpg"
copy_img "$CAMPER_IMG" "motorhome-bay-a.jpg"
copy_img "$CAMPER_IMG" "motorhome-bay-b.jpg"
copy_img "$CABIN_IMG" "kerry-cottage.jpg"

# Wicklow (Owner 6)
copy_img "$CABIN_IMG" "shepherds-hut-1.jpg"
copy_img "$CABIN_IMG" "shepherds-hut-2.jpg"
copy_img "$POD_IMG" "woodland-yurt.jpg"
copy_img "$CABIN_IMG" "treehouse-nest.jpg"
copy_img "$POD_IMG" "safari-tent.jpg"

# Donegal (Owner 7)
copy_img "$TENT_IMG" "atlantic-edge-1.jpg"
copy_img "$TENT_IMG" "atlantic-edge-2.jpg"
copy_img "$TENT_IMG" "sheltered-glen.jpg"
copy_img "$TENT_IMG" "stargazer-pitch.jpg"
copy_img "$CABIN_IMG" "bothy.jpg"

# West Cork (Owner 8)
copy_img "$POD_IMG" "garden-suite-1.jpg"
copy_img "$POD_IMG" "garden-suite-2.jpg"
copy_img "$CABIN_IMG" "schull-cabin.jpg"
copy_img "$CABIN_IMG" "beach-hut.jpg"

# Burren (Owner 9)
copy_img "$TENT_IMG" "limestone-1.jpg"
copy_img "$TENT_IMG" "limestone-2.jpg"
copy_img "$TENT_IMG" "cave-entrance.jpg"
copy_img "$POD_IMG" "hazel-pod.jpg"
copy_img "$CABIN_IMG" "stone-cottage.jpg"

# Croagh Patrick (Owner 10)
copy_img "$TENT_IMG" "pilgrim-1.jpg"
copy_img "$TENT_IMG" "pilgrim-2.jpg"
copy_img "$TENT_IMG" "greenway-pitch.jpg"
copy_img "$CAMPER_IMG" "caravan-row-1.jpg"
copy_img "$POD_IMG" "westport-pod.jpg"

# Yeats (Owner 11)
copy_img "$TENT_IMG" "ben-bulben-1.jpg"
copy_img "$TENT_IMG" "ben-bulben-2.jpg"
copy_img "$CAMPER_IMG" "surfers-corner.jpg"
copy_img "$CABIN_IMG" "drumcliffe-cabin.jpg"

# Sunny Southeast (Owner 12)
copy_img "$TENT_IMG" "beach-pitch-1.jpg"
copy_img "$TENT_IMG" "beach-pitch-2.jpg"
copy_img "$TENT_IMG" "beach-pitch-3.jpg"
copy_img "$CAMPER_IMG" "seaside-caravan.jpg"
copy_img "$CABIN_IMG" "family-lodge.jpg"
copy_img "$CABIN_IMG" "beach-house.jpg"

# Ring of Kerry (Owner 13)
copy_img "$POD_IMG" "mountain-dome-1.jpg"
copy_img "$POD_IMG" "mountain-dome-2.jpg"
copy_img "$POD_IMG" "kenmare-pod.jpg"
copy_img "$CABIN_IMG" "wild-atlantic-suite.jpg"
copy_img "$POD_IMG" "romantic-retreat.jpg"

# Giants Causeway (Owner 14)
copy_img "$TENT_IMG" "causeway-1.jpg"
copy_img "$TENT_IMG" "causeway-2.jpg"
copy_img "$TENT_IMG" "dark-hedges.jpg"
copy_img "$POD_IMG" "whiskey-pod.jpg"
copy_img "$CABIN_IMG" "giants-cabin.jpg"

echo "All images seeded."
