#!/usr/bin/env python
'''
**********************************************************************
* Filename    : browser.py
* Description : A module to run a headless chromium browser.
* Author      : andibraeu
* Update      : andibraeu    2021-12-05    New release
**********************************************************************
'''
from pyppeteer import launch

class Browser(object):

    async def __init__(self):
        self.browser = await launch(headless=True, chromeArgs=['--use-fake-ui-for-media-stream', '--alsa-output-device=plug:null', '--display=:1', '--no-sandbox', '--disable-extensions'], executablePath='/usr/bin/chromium-browser', handleSIGINT=False)
        page = await self.browser.newPage()
        page.goto('http://localhost:8000/static/jitsi/main.html')
