import json
import os
import re
from pathlib import Path

# Config
CANVAS_PATH = 'docs/04-User-Flows/user-flows.canvas'
SEARCH_DIR = 'docs/04-User-Flows'

def normalize(text):
    # Remove extension, leading numbers, replace -/_ with space, lowercase
    text = re.sub(r'\.(png|jpg|jpeg|webp)$', '', text, flags=re.I)
    text = re.sub(r'^\d+[a-z]?[-_]', '', text) # Remove leading 01-, 02b-
    return re.sub(r'[-_]', ' ', text).lower()

def get_keywords(text):
    return set(normalize(text).split())

def find_best_match(old_path, node_id, available_files):
    # old_path example: "../05-Design-Specs/login_page_2/screen.png"
    # Extract the folder name "login_page_2"
    parts = old_path.split('/')
    if len(parts) >= 2 and parts[-1] == 'screen.png':
        old_name = parts[-2]
    else:
        old_name = Path(old_path).stem

    # Determine category from node_id if possible
    category_map = {
        'auth': 'auth',
        'booking': 'booking',
        'discovery': 'discovery',
        'favorites': 'favorites',
        'my-bookings': 'my-bookings',
        'bookings': 'my-bookings',
        'notifications': 'notifications',
        'offers': 'offers',
        'onboarding': 'onboarding',
        'onboard': 'onboarding',
        'owner': 'owner-admin',
        'profile': 'profile',
        'reviews': 'reviews',
        'modify': 'my-bookings', # modify usually in my-bookings
        'cancel': 'my-bookings',
    }
    
    prefix = node_id.split('-')[0]
    category = category_map.get(prefix)
    
    # Filter candidates
    candidates = []
    if category:
        candidates = [f for f in available_files if f.startswith(category + '/')]
    
    if not candidates:
        candidates = available_files # Fallback to all

    # Scoring
    best_score = -1
    best_match = None
    
    old_keywords = get_keywords(old_name)
    id_keywords = get_keywords(node_id)
    
    # Heuristics for specific mismatches
    if 'login_page_2' in old_name: old_keywords.add('login')
    
    for cand in candidates:
        cand_name = os.path.basename(cand)
        cand_keywords = get_keywords(cand_name)
        
        # Jaccard index or intersection count?
        # Overlap with old name is most important
        score = len(old_keywords.intersection(cand_keywords)) * 2
        # Overlap with ID is secondary
        score += len(id_keywords.intersection(cand_keywords))
        
        # Penalize length difference? No.
        
        if score > best_score:
            best_score = score
            best_match = cand
        elif score == best_score:
             # Tie breaker: Prefer shorter name (often main screen)
             if len(cand) < len(best_match):
                 best_match = cand
                 
    return best_match

def main():
    # 1. Load available files
    available_files = []
    base_path = Path(SEARCH_DIR)
    for p in base_path.rglob('*.png'):
        rel_path = p.relative_to(base_path)
        available_files.append(str(rel_path))
    
    print(f"Found {len(available_files)} images.")

    # 2. Load Canvas
    with open(CANVAS_PATH, 'r') as f:
        data = json.load(f)
    
    nodes = data.get('nodes', [])
    updated_count = 0
    
    changes = []

    for node in nodes:
        if node.get('type') == 'file' and node.get('file', '').endswith('.png'):
            old_file = node['file']
            node_id = node['id']
            
            # Skip if already fixed (doesn't start with ..)
            if not old_file.startswith('..'):
                continue

            match = find_best_match(old_file, node_id, available_files)
            if match:
                node['file'] = match
                updated_count += 1
                changes.append(f"{node_id}: {old_file} -> {match}")
            else:
                changes.append(f"WARNING: No match for {node_id} ({old_file})")

    # 3. Save
    with open(CANVAS_PATH, 'w') as f:
        json.dump(data, f, indent='\t')
        
    print(f"Updated {updated_count} nodes.")
    for c in changes:
        print(c)

if __name__ == "__main__":
    main()
