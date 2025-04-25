# Dot Matrix PDF Converter

**Dot Matrix PDF Converter** is a standalone desktop application built with **Electron** and **JavaScript** that converts `.txt` files—originally designed for dot matrix printers—into properly formatted PDF documents.

## Features

- 📄 **Converts plain `.txt` to PDF**
- 🖨️ Supports dot matrix formatting:
  - **CPI modes** (10 CPI = Landscape, 17 CPI = Portrait)
  - **Control characters**:
    - `DC2` (0x12) = Double width
    - `SI` (0x0F) = Normal width
    - `Form feed (0x0C)` = Page break
- 🗂️ Organizes outputs into daily folders (UTC+8 timestamp)
- 🖼️ Custom window/taskbar icon
- 🖥️ Designed for both Windows and macOS (Mac for development, Windows for final build)

## Installation

Download the `.exe` (Windows) or `.dmg` (macOS) installer from the [Releases](https://github.com/MJTuazon/Dot-Matrix-PDF-Converter-Standalone.git/releases) page.

> 💡 **Note:** This app is fully offline and requires no internet connection.

## Usage

1. Launch the app.
2. Select a `.txt` file with dot matrix formatting.
3. Choose CPI mode.
4. Click **Generate PDF**.
5. The PDF will be saved in `~/Desktop/DotMatrixPDFsConverted/YYYY-MM-DD/`.

## Development

### Requirements

- Node.js & npm
- Electron
- pdf-lib

### Setup

```bash
npm install
npm start
