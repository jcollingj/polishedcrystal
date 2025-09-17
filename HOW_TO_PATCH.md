# How to Patch Polished Crystal ROM

This document outlines the process for making modifications to the Polished Crystal ROM and getting them working in OpenEmu.

## Prerequisites

- macOS with Homebrew installed
- OpenEmu emulator
- Git for version control

## Initial Setup

### 1. Install Build Dependencies
```bash
brew install rgbds coreutils
```

### 2. Set Up Git Repository
```bash
# Rename original remote to upstream
git remote rename origin upstream

# Add your fork as the new origin
git remote add origin git@github.com:YOURUSERNAME/polishedcrystal.git

# Push to your fork
git push -u origin master
```

## Making Changes

### 1. Modify Game Files
Examples of common modifications:

**Adding items to shops** (`data/items/marts.asm`):
```asm
EcruteakMart:
	db 12 ; # items (increment count)
	db POKE_BALL
	db GREAT_BALL
	; ... existing items
	db RARE_CANDY  ; add new item
	db -1
```

**Changing item prices** (`data/items/attributes.asm`):
```asm
; RARE CANDY
item_attribute 1, 0, 0, MEDICINE, ITEMMENU_PARTY, ITEMMENU_NOUSE
```

**Changing save version** (`constants/misc_constants.asm`):
```asm
; save file version
DEF SAVE_VERSION EQU 9
```

### 2. Build the ROM
```bash
make clean && make
```

This generates `polishedcrystal-3.2.0.gbc`.

## Deploying to OpenEmu

### Method 1: Direct Copy (Recommended)
```bash
cp polishedcrystal-3.2.0.gbc "/Users/jacobcolling/Library/Application Support/OpenEmu/Game Library/roms/Game Boy/polishedcrystal-3.2.0.gbc"
```

### Method 2: Drag and Drop
- Drag the `.gbc` file into OpenEmu's main window
- OpenEmu will import it into its library

## Save File Compatibility

### Problem: Version Mismatch
When you modify a ROM, OpenEmu may show:
```
Your save file does not match the game version of this ROM.
Game version: 00010
Save version: 00009
```

### Solution: Match Save Version
1. Set `SAVE_VERSION` in `constants/misc_constants.asm` to match your existing save (usually 9)
2. Rebuild the ROM
3. Copy the new ROM to OpenEmu

### Save File Management
- **Save files location**: `~/Library/Application Support/OpenEmu/Gambatte/Battery Saves/`
- **Format**: `{rom-name}.sav` and `{rom-name}.rtc`
- **Compatibility**: Battery saves (`.sav`) work across ROM modifications, save states do not

To copy save between ROM versions:
```bash
cp "/Users/jacobcolling/Library/Application Support/OpenEmu/Gambatte/Battery Saves/polishedcrystal-3.1.1.sav" "/Users/jacobcolling/Library/Application Support/OpenEmu/Gambatte/Battery Saves/polishedcrystal-3.2.0.sav"

cp "/Users/jacobcolling/Library/Application Support/OpenEmu/Gambatte/Battery Saves/polishedcrystal-3.1.1.rtc" "/Users/jacobcolling/Library/Application Support/OpenEmu/Gambatte/Battery Saves/polishedcrystal-3.2.0.rtc"
```

## Useful File Paths

### OpenEmu Directories
- **ROMs**: `~/Library/Application Support/OpenEmu/Game Library/roms/Game Boy/`
- **Battery Saves**: `~/Library/Application Support/OpenEmu/Gambatte/Battery Saves/`
- **Save States**: `~/Library/Application Support/OpenEmu/Save States/GameBoy/`

### Key Source Files
- **Shop inventories**: `data/items/marts.asm`
- **Item prices/attributes**: `data/items/attributes.asm`
- **Save version**: `constants/misc_constants.asm`
- **Pokémon abilities**: `data/pokemon/base_stats/{pokemon}.asm`
- **Available items**: `constants/item_constants.asm`
- **Available abilities**: `constants/ability_constants.asm`

## Common Modifications

### Adding Items to Shops
1. Find the shop in `data/items/marts.asm`
2. Increment the item count
3. Add the item constant before the `-1` terminator

### Changing Pokémon Abilities
1. Find the Pokémon file in `data/pokemon/base_stats/`
2. Modify the `abilities_for` line:
   ```asm
   abilities_for PIDGEOTTO, KEEN_EYE, TANGLED_FEET, BIG_PECKS
   ```

### Changing Item Prices
1. Find the item in `data/items/attributes.asm`
2. Modify the first parameter in `item_attribute`

## Troubleshooting

### Build Errors
- Ensure rgbds and coreutils are installed
- Check file syntax (tabs vs spaces matter in assembly)
- Verify constant names match those in `constants/`

### Save Compatibility Issues
- Use battery saves (`.sav`) instead of save states
- Match `SAVE_VERSION` to your existing save
- Consider using standalone emulators (mGBA, SameBoy) for testing

### OpenEmu Not Recognizing Changes
- Use direct copy method instead of drag-and-drop
- Restart OpenEmu after copying ROM
- Check that file was copied to correct location

## Version Control

Commit your changes regularly:
```bash
git add .
git commit -m "Add rare candy to Ecruteak City market

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Notes

- Modified ROMs will have different checksums than original
- Save states are not compatible across ROM modifications
- Keep backups of original ROMs and save files
- Test changes thoroughly before playing long sessions