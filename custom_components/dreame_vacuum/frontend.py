"""Support for Dreame Vacuum frontend card integration."""
from __future__ import annotations

import logging
from pathlib import Path
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

URL_BASE = "/dreame_vacuum_frontend"
FILE_NAME = "dreame-vacuum-map-card.js"
CARD_URL = f"{URL_BASE}/{FILE_NAME}"
DATA_EXTRA_MODULE_URL = "frontend_extra_module_url"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Register the integrated Dreame Vacuum Map Card in Home Assistant."""
    frontend_dir = Path(__file__).parent / "frontend"
    card_file = frontend_dir / FILE_NAME

    if not card_file.is_file():
        _LOGGER.warning("Dreame Vacuum Map Card file not found at %s", card_file)
        return

    # 1. Register static HTTP path for serving the card JS
    try:
        if hasattr(hass.http, "async_register_static_paths"):
            from homeassistant.components.http import StaticPathConfig

            await hass.http.async_register_static_paths([
                StaticPathConfig(CARD_URL, str(card_file), cache_headers=True)
            ])
        elif hasattr(hass.http, "register_static_path"):
            hass.http.register_static_path(CARD_URL, str(card_file), cache_headers=True)
    except Exception as err:
        _LOGGER.debug("Dreame Vacuum static path already registered or failed: %s", err)

    # 2. Register extra JS url so Home Assistant loads the card in the browser
    try:
        from homeassistant.components.frontend import add_extra_js_url

        add_extra_js_url(hass, f"{CARD_URL}?v=1.6.1")
        _LOGGER.info("Dreame Vacuum Map Card registered successfully: %s", CARD_URL)
    except Exception as err:
        _LOGGER.warning("Failed to register Dreame Vacuum Map Card into frontend: %s", err)


async def setup(hass: HomeAssistant) -> None:
    """Entry point for frontend setup."""
    await async_register_frontend(hass)


async def remove(hass: HomeAssistant, entry=None) -> None:
    """Entry point for frontend cleanup when entry is removed."""
    pass

