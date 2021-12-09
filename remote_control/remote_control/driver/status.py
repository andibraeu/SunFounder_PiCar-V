#!/usr/bin/env python
'''
**********************************************************************
* Filename    : status.py
* Description : A module to manage raspi information.
* Author      : andibraeu
* Update      : andibraeu    2021-12-05    New release
**********************************************************************
'''

from gpiozero import CPUTemperature, LoadAverage
import os

class Status(object):

    status = dict()

    def __init__(self):
        print('initiated status module')

    def health(self):
        self.status['cpuTemp'] = CPUTemperature().temperature
        self.status['load'] = LoadAverage(max_load_average=2).load_average
        return self.status

    def shutdown(self):
        os.system('sudo shutdown -h +1')

    def reboot(self):
        os.system('sudo shutdown -r +1')