#!/usr/bin/env python
'''
**********************************************************************
* Filename    : status.py
* Description : A module to manage raspi information.
* Author      : andibraeu
* Update      : andibraeu    2021-12-05    New release
**********************************************************************
'''

from gpiozero import CPUTemperature
import json

class Status(object):

    status = dict()

    def __init__(self):
        print('initiated status module')

    def health(self):
        self.status['cpuTemp'] = CPUTemperature().temperature
        return self.status