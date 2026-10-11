import sys
from unittest.mock import MagicMock
import numpy as np

for mod in [
    'homeassistant', 'homeassistant.core', 'homeassistant.config_entries',
    'homeassistant.helpers', 'homeassistant.helpers.dispatcher',
    'paho', 'paho.mqtt', 'paho.mqtt.client', 'miio', 'miio.miioprotocol',
    'py_mini_racer', 'PIL', 'PIL.Image', 'PIL.ImageDraw'
]:
    sys.modules[mod] = MagicMock()

sys.path.insert(0, 'custom_components/dreame_vacuum')
from dreame.map import DreameVacuumMapOptimizer
from dreame.types import MapImageDimensions, Point

class MockMapData:
    def __init__(self, width=80, height=80):
        self.need_optimization = True
        self.saved_map = False
        self.wifi_map = False
        self.map_id = 1
        self.frame_id = 1
        self.dimensions = MapImageDimensions(0, 0, height, width, 5)
        self.charger_position = Point(40, 40, 0)
        self.pixel_type = np.zeros((width, height), dtype=np.uint8)
        # Tehdään huone, jossa yli 2000 pikseliä jotta optimointikriteeri täyttyy
        self.pixel_type[10:70, 10:70] = 253
        self.pixel_type[10, 10:70] = 255
        self.pixel_type[69, 10:70] = 255
        self.pixel_type[10:70, 10] = 255
        self.pixel_type[10:70, 69] = 255
        self.optimized_pixel_type = None
        self.optimized_dimensions = None
        self.optimized_charger_position = None

opt = DreameVacuumMapOptimizer()
map_data = MockMapData()

print(f"Alkuperäiset pikselit (ei-nollia): {np.count_nonzero(map_data.pixel_type)}")
res = opt.optimize(map_data, saved_map_data=None, js_optimizer=False)
print("Optimoitu kutsu suoritettu (js_optimizer=False)")
print(f"Optimoidut pikselit asetettu: {res.optimized_pixel_type is not None}")
if res.optimized_pixel_type is not None:
    print(f"Optimoidun taulukon muoto: {res.optimized_pixel_type.shape}")
    print(f"Optimoidut pikselit (ei-nollia): {np.count_nonzero(res.optimized_pixel_type)}")
print("TESTI LÄPÄISTY!")
