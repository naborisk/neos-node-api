from neosvr_headless_api import LocalHeadlessClient
import json

hc = LocalHeadlessClient('/root/NeosVR/')

hc.wait_for_ready()

print('READY')
