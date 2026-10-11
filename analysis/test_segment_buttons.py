"""Test suite for Dreame Vacuum Segment Button entities."""

import asyncio
import sys
from unittest.mock import MagicMock, AsyncMock

# Mock Home Assistant and 3rd party dependencies before importing component
import types
from importlib.machinery import ModuleSpec

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
        if any(fullname.startswith(p) for p in ["homeassistant", "paho", "miio", "PIL"]):
            return ModuleSpec(fullname, MockLoader(fullname), is_package=True)
        return None

sys.meta_path.insert(0, MockFinder())

import homeassistant.core
import homeassistant.components.button
homeassistant.core.callback = lambda fn: fn

import homeassistant.helpers.entity
import homeassistant.helpers.update_coordinator

class DummyEntity:
    """Mock base Entity."""
    _attr_has_entity_name = True
    _attr_translation_placeholders = None

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

from dataclasses import dataclass

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
    entity_registry_enabled_default: bool = True
    device_class: Any = None

import homeassistant.helpers.entity
homeassistant.helpers.entity.EntityDescription = DummyButtonEntityDescription

homeassistant.components.button.ButtonEntity = DummyButtonEntity
homeassistant.components.button.ButtonEntityDescription = DummyButtonEntityDescription

# Add custom_components to path
sys.path.insert(0, "/home/hermes/workspace-code/dreame-vacuum")

from custom_components.dreame_vacuum.button import (
    DreameVacuumSegmentButtonEntity,
    async_update_segment_buttons,
)


class MockSegment:
    """Mock segment representing a room on the map."""
    def __init__(self, segment_id: int, name: str = None, custom_name: str = None, icon: str = None):
        self.id = segment_id
        self.name = name
        self.custom_name = custom_name
        self.icon = icon
        self.type = 1
        self.index = 0

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "custom_name": self.custom_name,
            "icon": self.icon,
        }


class MockMapData:
    """Mock map data."""
    def __init__(self, segments=None):
        self.segments = segments or {}
        self.map_index = 1


class MockStatus:
    """Mock device status."""
    def __init__(self):
        self.draining = False
        self.self_repairing = False
        self.segments = {}
        self.current_segments = {}
        self.map_list = [1]
        self.map_data_list = {}


class MockCapability:
    """Mock device capability."""
    def __init__(self):
        self.map = True
        self.shortcuts = False


class MockDevice:
    """Mock Dreame vacuum device."""
    def __init__(self):
        self.mac = "11:22:33:44:55:66"
        self.name = "dreame_fifi"
        self.device_connected = True
        self.available = True
        self.capability = MockCapability()
        self.status = MockStatus()
        self.clean_segment = MagicMock()


class MockCoordinator:
    """Mock DataUpdateCoordinator."""
    def __init__(self, device):
        self.device = device
        self.hass = MagicMock()
        self.hass.async_add_executor_job = AsyncMock(side_effect=lambda fn, *args, **kwargs: fn(*args, **kwargs))
        self.listeners = []
        self._entry = MagicMock()
        self._entry.entry_id = "test_entry_id"

    def async_add_listener(self, listener):
        self.listeners.append(listener)

    def localize(self, key, default):
        # Emuloidaan lokalisointia
        if key == "entity.button.clean_segment.name":
            return "Clean {name}"
        return default

    def raise_error(self, exc):
        raise exc


async def run_tests():
    print("=== TESTI 1: Instansointi ja perusattribuutit ===")
    device = MockDevice()
    coordinator = MockCoordinator(device)

    # Alustetaan kaksi segmenttiä
    seg1 = MockSegment(1, name="Kitchen", icon="mdi:silverware")
    seg2 = MockSegment(2, custom_name="Olohuone", icon="mdi:sofa")
    device.status.segments = {1: seg1, 2: seg2}

    button1 = DreameVacuumSegmentButtonEntity(coordinator, 1)
    button2 = DreameVacuumSegmentButtonEntity(coordinator, 2)

    assert button1.segment_id == 1, f"Expected 1, got {button1.segment_id}"
    assert button2.segment_id == 2, f"Expected 2, got {button2.segment_id}"
    assert button1._attr_unique_id == "11:22:33:44:55:66_segment_1_clean", f"Unique id mismatch: {button1._attr_unique_id}"
    assert button2._attr_unique_id == "11:22:33:44:55:66_segment_2_clean", f"Unique id mismatch: {button2._attr_unique_id}"
    assert button1._attr_icon == "mdi:silverware", f"Icon mismatch: {button1._attr_icon}"
    assert button2._attr_icon == "mdi:sofa", f"Icon mismatch: {button2._attr_icon}"
    assert "Kitchen" in button1._attr_name, f"Expected Kitchen in name: {button1._attr_name}"
    assert "Olohuone" in button2._attr_name, f"Expected Olohuone in name: {button2._attr_name}"
    print(f"Button 1: name='{button1._attr_name}', unique_id='{button1._attr_unique_id}', icon='{button1._attr_icon}'")
    print(f"Button 2: name='{button2._attr_name}', unique_id='{button2._attr_unique_id}', icon='{button2._attr_icon}'")
    print("PASS: Instansointi ja attribuutit toimivat oikein.")

    print("\n=== TESTI 2: Availability-tarkistukset ===")
    assert button1.available is True, "Expected available=True"
    
    # 2a: draining -> unavailable
    device.status.draining = True
    assert button1.available is False, "Expected unavailable when draining"
    device.status.draining = False

    # 2b: self_repairing -> unavailable
    device.status.self_repairing = True
    assert button1.available is False, "Expected unavailable when self_repairing"
    device.status.self_repairing = False

    # 2c: segment removed from map -> unavailable
    device.status.segments = {2: seg2}
    assert button1.available is False, "Expected unavailable when segment not in map"
    assert button2.available is True, "Expected segment 2 still available"

    # Palautetaan segments
    device.status.segments = {1: seg1, 2: seg2}
    assert button1.available is True
    print("PASS: Availability-ehdot toimivat oikein.")

    print("\n=== TESTI 3: async_press kutsuu clean_segment(segment_id) ===")
    device.clean_segment.reset_mock()
    await button1.async_press()
    device.clean_segment.assert_called_once_with(1)
    print("clean_segment kutsuttu parametrilla 1 onnistuneesti.")

    device.clean_segment.reset_mock()
    await button2.async_press()
    device.clean_segment.assert_called_once_with(2)
    print("clean_segment kutsuttu parametrilla 2 onnistuneesti.")
    print("PASS: async_press toimii oikein.")

    print("\n=== TESTI 4: _handle_coordinator_update päivittää nimen ja kuvakkeen ===")
    button1.async_write_ha_state = MagicMock()
    # Muutetaan segmentin nimeä ja kuvaketta
    seg1.custom_name = "Keittiö"
    seg1.icon = "mdi:chef-hat"
    button1._handle_coordinator_update()
    assert "Keittiö" in button1._attr_name, f"Expected Keittiö in name: {button1._attr_name}"
    assert button1._attr_icon == "mdi:chef-hat", f"Expected mdi:chef-hat: {button1._attr_icon}"
    button1.async_write_ha_state.assert_called_once()
    print(f"Päivitetty Button 1: name='{button1._attr_name}', icon='{button1._attr_icon}'")
    print("PASS: Coordinator update päivitti tiedot ja kutsui async_write_ha_state.")

    print("\n=== TESTI 5: async_update_segment_buttons dynaaminen lisäys ja poisto ===")
    current_segments = {}
    added_entities = []

    def mock_add_entities(new_entities):
        added_entities.extend(new_entities)

    # Ensimmäinen päivitys (segmentit 1 ja 2)
    async_update_segment_buttons(coordinator, current_segments, mock_add_entities)
    active_segments = [k for k in current_segments if k != "init"]
    assert len(active_segments) == 2, f"Expected 2 segments in current, got {len(active_segments)}"
    assert len(added_entities) == 2, f"Expected 2 entities added, got {len(added_entities)}"
    print(f"Lisätty dynaamisesti {len(added_entities)} entiteettiä.")

    # Lisätään uusi segmentti 3
    added_entities.clear()
    seg3 = MockSegment(3, name="Bedroom", icon="mdi:bed")
    device.status.segments = {1: seg1, 2: seg2, 3: seg3}
    async_update_segment_buttons(coordinator, current_segments, mock_add_entities)
    active_segments = [k for k in current_segments if k != "init"]
    assert len(active_segments) == 3, f"Expected 3 segments in current, got {len(active_segments)}"
    assert len(added_entities) == 1, f"Expected 1 entity added, got {len(added_entities)}"
    assert added_entities[0].segment_id == 3
    print("Segmentti 3 lisätty dynaamisesti.")

    # Poistetaan segmentti 1
    added_entities.clear()
    device.status.segments = {2: seg2, 3: seg3}
    async_update_segment_buttons(coordinator, current_segments, mock_add_entities)
    assert 1 not in current_segments, "Expected segment 1 removed from current_segments"
    active_segments = [k for k in current_segments if k != "init"]
    assert len(active_segments) == 2
    print("Segmentti 1 poistettu dynaamisesti.")
    print("PASS: Dynaaminen hallinta toimii täysin oikein.")

    print("\n==========================================")
    print("KAIKKI TESTIT SUORITETTU VIRHEETTÖMÄSTI!")
    print("==========================================")


if __name__ == "__main__":
    asyncio.run(run_tests())
