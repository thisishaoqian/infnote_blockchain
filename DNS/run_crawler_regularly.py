import time
import os


def re_exe(cmd, inc=300):
    '''
    :param cmd:
    :param inc: 300 seconds
    :return:
    '''
    while True:
        os.system(cmd)
        time.sleep(inc)


re_exe('python3 crawler.py', 300)
