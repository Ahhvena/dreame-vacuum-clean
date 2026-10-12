"""Unit test suite for Dreame Vacuum Trash Bin features.

Tests:
1. go_to_trash_bin button:
   - When docked: reads coordinates from config_entry.options and drives to trash bin via device.go_to(x, y).
   - When not docked (and not cleaning): returns to dock via device.return_to_base().
   - Availability when draining, self_repairing, or map capability missing.
2. set_trash_bin_location button:
   - Saves current robot position from current_map.robot_position to config_entry.options.
   - Saves current robot position from map_data.robot_position fallback.
3. dreame_vacuum.set_trash_bin_location service on vacuum entity:
   - Sets custom coordinates when provided (x, y).
   - Saves current position when x, y are omitted.
"""

import asyncio
import sys
import types
from unittest.mock import MagicMock, AsyncMock
from dataclasses import dataclass
from importlib.machinery import ModuleSpec

# Setup Mock system for Home Assistant dependencies
class MockModule(types.ModuleType):
    def __getattr__(self, name):
        val = MagicMock()
        setattr(self, name, val)
        return val

class MockLoader:
    def __init__(self, name):
        self.name = name
    def create_module(self, spec):
        mod = MockModule(self.name)
        mod.__path__ = []
        return mod
    def exec_module(self, module):
        pass

class MockFinder:
    def find_spec(self, fullname, path, target=None):
        if any(fullname.startswith(p) for p in ["homeassistant", "paho", "miio", "PIL", "voluptuous"]):
            return ModuleSpec(fullname, MockLoader(fullname), is_package=True)
        return None

sys.meta_path.insert(0, MockFinder())

import homeassistant.core
import homeassistant.components.button
import homeassistant.components.vacuum
homeassistant.core.callback = lambda fn: fn

import homeassistant.helpers.entity
import homeassistant.helpers.update_coordinator

class DummyEntity:
    """Mock base Entity."""
    _attr_has_entity_name = True
    _attr_translation_placeholders = None
    _attr_device_info = {}
    _attr_available = True
    hass = None

    def async_write_ha_state(self):
        pass

homeassistant.helpers.entity.Entity = DummyEntity

class DummyCoordinatorEntity(DummyEntity):
    def __init__(self, coordinator=None):
        self.coordinator = coordinator
        self.hass = getattr(coordinator, "hass", None)

    def __class_getitem__(cls, item):
        return cls

homeassistant.helpers.update_coordinator.CoordinatorEntity = DummyCoordinatorEntity

class DummyButtonEntity(DummyEntity):
    """Mock base ButtonEntity."""
    _attr_icon = None
    _attr_name = None
    _attr_unique_id = None
    entity_id = None

class DummyStateVacuumEntity(DummyEntity):
    """Mock base StateVacuumEntity."""
    pass

@dataclass
class DummyButtonEntityDescription:
    key: str = None
    icon: str = None
    entity_category: Any = None
    name: str = None
    action_key: Any = None
    action_fn: Any = None
    exists_fn: Any = None
    available_fn: Any = None
    async_press: Any = None
    entity_registry_enabled_default: bool = True
    device_class: Any = None

homeassistant.helpers.entity.EntityDescription = DummyButtonEntityDescription
homeassistant.components.button.ButtonEntity = DummyButtonEntity
homeassistant.components.button.ButtonEntityDescription = DummyButtonEntityDescription
homeassistant.components.vacuum.StateVacuumEntity = DummyStateVacuumEntity

# Add custom_components to path
sys.path.insert(0, "/home/hermes/workspace-code/dreame-vacuum")

from custom_components.dreame_vacuum.const import (
    CONF_TRASH_BIN_X,
    CONF_TRASH_BIN_Y,
    DOMAIN,
)
from custom_components.dreame_vacuum.button import (
    BUTTONS,
    DreameVacuumButtonEntity,
)
from custom_components.dreame_vacuum.vacuum import DreameVacuum
from custom_components.dreame_vacuum.dreame import DreameVacuumStatus


class MockPoint:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y


class MockCurrentMap:
    def __init__(self, robot_position=None):
        self.robot_position = robot_position


class MockDeviceStatus:
    def __init__(self):
        self.docked = True
        self.cleaning = False
        self.status = DreameVacuumStatus.CHARGING
        self.draining = False
        self.self_repairing = False
        self.current_map = None
        self.zone_cleaning = False
        self.spot_cleaning = False
        self.segment_cleaning = False
        self.auto_cleaning = False
        self.started = False
        self.has_error = False
        self.has_warning = False
        self.low_water = False
        self.draining_complete = False
        self.returning_to_wash = False
        self.washing = False
        self.paused = False
        self.washing_paused = False
        self.returning_to_wash_paused = False
        self.drying = False
        self.sleeping = False
        self.charging = False
        self.cruising = False
        self.customized_cleaning = False
        self.suction_unavailable = False
        self.suction_level = MagicMock(name="standard")
        self.state = 1
        self.attributes = {}
        self.selected_map = 1
        self.map_data_list = {}


class MockDeviceCapability:
    def __init__(self):
        self.map = True


class MockDevice:
    def __init__(self):
        self.mac = "11:22:33:44:55:66"
        self.name = "Fifi"
        self.device_connected = True
        self.status = MockDeviceStatus()
        self.capability = MockDeviceCapability()
        self.map_data = None
        self._map_manager = None
        self.action_mapping = {}
        self.data = {}
        self.auto_switch_data = {}
        self.ai_data = {}
        self.info = MagicMock(model="dreame.vacuum.test", firmware_version="1.0", hardware_version="1.0")
        
        self.go_to = MagicMock()
        self.return_to_base = MagicMock()


class MockConfigEntry:
    def __init__(self, options=None):
        self.entry_id = "test_entry_id"
        self.options = options or {}


class MockCoordinator:
    def __init__(self, device: MockDevice, config_entry: MockConfigEntry, hass):
        self.device = device
        self.config_entry = config_entry
        self.hass = hass


async def run_tests():
    print("=== DREAME VACUUM TRASH BIN TESTISARJA ===")

    # Find button descriptions
    go_to_desc = next((d for d in BUTTONS if d.key == "go_to_trash_bin"), None)
    set_loc_desc = next((d for d in BUTTONS if d.key == "set_trash_bin_location"), None)

    assert go_to_desc is not None, "go_to_trash_bin description puuttuu BUTTONS-listasta"
    assert set_loc_desc is not None, "set_trash_bin_location description puuttuu BUTTONS-listasta"
    assert go_to_desc.icon == "mdi:trash-can-outline", f"Väärä kuvake: {go_to_desc.icon}"
    assert set_loc_desc.icon == "mdi:map-marker-check", f"Väärä kuvake: {set_loc_desc.icon}"
    print("PASS: ButtonEntityDescriptionit löytyvät oikeilla avaimilla ja kuvakkeilla.")

    # Setup Hass, Device, Coordinator
    mock_hass = MagicMock()
    mock_hass.async_add_executor_job = AsyncMock(side_effect=lambda fn, *args, **kwargs: fn(*args, **kwargs))
    mock_hass.config_entries.async_update_entry = AsyncMock()

    device = MockDevice()
    config_entry = MockConfigEntry(options={
        CONF_TRASH_BIN_X: 2500,
        CONF_TRASH_BIN_Y: -1200,
    })
    coordinator = MockCoordinator(device, config_entry, mock_hass)

    # 1. TESTAA GO_TO_TRASH_BIN KUN IMURI ON TELAKASSA
    print("\n--- TESTI 1: go_to_trash_bin telakassa ---")
    device.status.docked = True
    device.status.cleaning = False
    button_go_to = DreameVacuumButtonEntity(coordinator, go_to_desc)
    button_go_to.hass = mock_hass

    await button_go_to.async_press()
    device.go_to.assert_called_once_with(2500, -1200)
    device.return_to_base.assert_not_called()
    print("PASS: Imuri telakassa -> go_to(2500, -1200) kutsuttu onnistuneesti.")

    # 2. TESTAA GO_TO_TRASH_BIN KUN IMURI ON POIS TELAKASTA (ROSKAKORILLA)
    print("\n--- TESTI 2: go_to_trash_bin pois telakasta ---")
    device.go_to.reset_mock()
    device.return_to_base.reset_mock()
    device.status.docked = False
    device.status.cleaning = False

    await button_go_to.async_press()
    device.return_to_base.assert_called_once()
    device.go_to.assert_not_called()
    print("PASS: Imuri pois telakasta -> return_to_base() kutsuttu onnistuneesti.")

    # 3. TESTAA AVAILABILITY (draining, self_repairing, map-kyky)
    print("\n--- TESTI 3: go_to_trash_bin availability-ehdot ---")
    device.status.docked = True
    assert button_go_to.available is True, "Pitäisi olla available oletustilassa"

    device.status.draining = True
    assert button_go_to.available is False, "Draining tilassa ei saa olla available"
    device.status.draining = False

    device.status.self_repairing = True
    assert button_go_to.available is False, "Self repairing tilassa ei saa olla available"
    device.status.self_repairing = False

    device.capability.map = False
    assert button_go_to.available is False, "Ilman map-kykyä ei saa olla available"
    device.capability.map = True
    assert button_go_to.available is True, "Pitäisi palata availableksi"
    print("PASS: Availability-ehdot toimivat odotetusti.")

    # 4. TESTAA SET_TRASH_BIN_LOCATION PAINIKE (current_map)
    print("\n--- TESTI 4: set_trash_bin_location (current_map.robot_position) ---")
    device.status.current_map = MockCurrentMap(robot_position=MockPoint(x=1840, y=-650))
    button_set_loc = DreameVacuumButtonEntity(coordinator, set_loc_desc)
    button_set_loc.hass = mock_hass

    await button_set_loc.async_press()
    mock_hass.config_entries.async_update_entry.assert_called_once()
    call_args = mock_hass.config_entries.async_update_entry.call_args[1]
    assert call_args["options"][CONF_TRASH_BIN_X] == 1840
    assert call_args["options"][CONF_TRASH_BIN_Y] == -650
    print("PASS: Sijainti (1840, -650) tallennettu options-asetuksiin onnistuneesti.")

    # 5. TESTAA SET_TRASH_BIN_LOCATION PAINIKE (map_data fallback)
    print("\n--- TESTI 5: set_trash_bin_location (map_data fallback) ---")
    mock_hass.config_entries.async_update_entry.reset_mock()
    device.status.current_map = None
    device.map_data = MagicMock(robot_position=MockPoint(x=3100, y=820))

    await button_set_loc.async_press()
    mock_hass.config_entries.async_update_entry.assert_called_once()
    call_args = mock_hass.config_entries.async_update_entry.call_args[1]
    assert call_args["options"][CONF_TRASH_BIN_X] == 3100
    assert call_args["options"][CONF_TRASH_BIN_Y] == 820
    print("PASS: map_data-sijainti (3100, 820) tallennettu onnistuneesti.")

    # 6. TESTAA DREAME_VACUUM.SET_TRASH_BIN_LOCATION PALVELU VACUUM-ENTITEETISSÄ
    print("\n--- TESTI 6: vacuum.async_set_trash_bin_location palvelu ---")
    vacuum_entity = DreameVacuum(coordinator, None)
    vacuum_entity.hass = mock_hass

    # 6a. Palvelukutsu annetuilla koordinaateilla x=999, y=888
    mock_hass.config_entries.async_update_entry.reset_mock()
    await vacuum_entity.async_set_trash_bin_location(x=999, y=888)
    mock_hass.config_entries.async_update_entry.assert_called_once()
    call_args = mock_hass.config_entries.async_update_entry.call_args[1]
    assert call_args["options"][CONF_TRASH_BIN_X] == 999
    assert call_args["options"][CONF_TRASH_BIN_Y] == 888
    print("PASS: Palvelu annetuilla koordinaateilla (999, 888) tallennettu onnistuneesti.")

    # 6b. Palvelukutsu ilman koordinaatteja (lukee nykyisen sijainnin)
    mock_hass.config_entries.async_update_entry.reset_mock()
    device.status.current_map = MockCurrentMap(robot_position=MockPoint(x=450, y=-320))
    await vacuum_entity.async_set_trash_bin_location()
    mock_hass.config_entries.async_update_entry.assert_called_once()
    call_args = mock_hass.config_entries.async_update_entry.call_args[1]
    assert call_args["options"][CONF_TRASH_BIN_X] == 450
    assert call_args["options"][CONF_TRASH_BIN_Y] == -320
    print("PASS: Palvelu ilman koordinaatteja luki ja tallensi nykyisen sijainnin (450, -320) onnistuneesti.")

    print("\n==========================================")
    print("KAIKKI ROSKAKORITESTIT HYVÄKSYTTY (6/6)!")
    print("==========================================")


if __name__ == "__main__":
    asyncio.run(run_tests())
