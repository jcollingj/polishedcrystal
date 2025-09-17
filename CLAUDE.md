# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Save State / ROM Modification Issues

### Problem encountered:
- Modified ROM (changed item prices/shop inventory) causes checksum errors in OpenEmu
- Save states (.oesavestate) contain ROM checksums and won't load with modified ROMs
- Battery saves (.sav) work fine across ROM modifications

### Solutions for future modifications:
1. **Use standalone emulators** (mGBA, SameBoy) - less strict about checksums
2. **Battery saves (.sav) are compatible** - work with modified ROMs, just lose exact state position
3. **Keep original ROM backup** - can swap back to use save states when needed
4. **Avoid OpenEmu for modified ROMs** - it enforces checksum validation strictly

### File locations:
- Save files: `~/Library/Application Support/OpenEmu/Gambatte/Battery Saves/`
- Save states: `~/Library/Application Support/OpenEmu/Save States/GameBoy/[game-name]/`

## Project Overview

This is Pokémon Polished Crystal - a ROM hack based on the Pokémon Crystal disassembly. It's written in Z80 assembly language for the Game Boy Color. The project creates an improved version of Pokémon Crystal with bug fixes, modern Pokémon mechanics, and additional features.

## Build Commands

### Automated build script:
- `./build-and-deploy.sh` - **Recommended**: Clean build, create ROM, and deploy to OpenEmu automatically

### Manual build commands:
- `make` - Build standard polishedcrystal.gbc ROM
- `make clean` - Clean build artifacts
- `make tidy` - Remove intermediate files

### Build variants (can be combined):
- `make faithful` - Build with original mechanics preserved
- `make monochrome` - Build with monochrome palette
- `make noir` - Build with noir styling
- `make hgss` - Build with HeartGold/SoulSilver features
- `make debug` - Build with debug features enabled
- `make pocket` - Build for Analogue Pocket

Example: `make faithful monochrome` builds a monochrome faithful version.

## Prerequisites

### macOS:
- Install with Homebrew: `brew install rgbds coreutils`
- coreutils provides required `md5sum`, `ghead`, and `gtail`

### Required tools:
- **rgbds** (Rednex Game Boy Development System) - assembler toolchain
- **make** - build automation
- **git** - version control
- Python scripts in tools/ and utils/ for asset processing

## Code Architecture

### Key directories:
- `engine/` - Core game engine code (battles, overworld, events, menus)
- `home/` - Frequently-called routines in ROM bank 0
- `data/` - Game data (Pokémon stats, moves, maps, text)
- `maps/` - Individual map scripts and layouts
- `gfx/` - Graphics assets and conversion scripts
- `audio/` - Music and sound effects
- `constants/` - Game constants and enumerations
- `macros/` - Assembly macros for common patterns
- `tools/` - Build tools and utilities
- `ram/` - RAM layout definitions

### Core files:
- `main.asm` - Main entry point and ROM structure
- `home.asm` - Home bank routines
- `layout.link` - ROM bank layout specification
- `includes.asm` - Global includes and definitions

### Assembly patterns:
- Uses RGBDS assembler syntax with macros extensively
- ROM is divided into banks (16KB each)
- Home bank (bank 0) contains frequently-used routines
- WRAM and HRAM carefully managed for performance
- Extensive use of jump tables and indirect addressing

## Development Notes

### Making changes:
1. Assembly files use `.asm` extension
2. Graphics use `.png` format and are converted to `.2bpp` or `.1bpp`
3. Maps are defined in `maps/` with block data, scripts, and events
4. Constants should be defined in appropriate `constants/` files
5. Use existing macros from `macros/` for common operations

### Testing:
- No automated test suite - manual testing required
- Use `make debug` for debug builds with additional checks
- Test ROM in emulator (BGB recommended for debugging)

### Common tasks:
- Adding new maps: Create files in `maps/`, update `data/maps/`
- Modifying Pokémon: Edit files in `data/pokemon/`
- Adding moves: Update `data/moves/` and related battle engine code
- Graphics changes: Edit PNGs in `gfx/`, rebuild with make

## Important conventions:
- Labels use PascalCase (e.g., `BattleCommand_Tackle`)
- Constants use UPPER_SNAKE_CASE (e.g., `BATTLE_VARS_STATUS`)
- Local labels start with `.` (e.g., `.loop`)
- Comments use `;` and should explain non-obvious code
- Preserve existing code style and indentation (tabs)