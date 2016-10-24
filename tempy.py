import os, glob, time, sys, datetime
import json
import gspread
from oauth2client.client import SignedJwtAssertionCredentials

json_key = json.load(open('templog-5e53afa844ab.json'))
scope = ['https://spreadsheets.google.com/feeds']

credentials = SignedJwtAssertionCredentials(json_key['client_email'], json_key['private_key'], scope)


#Google account details
spreadsheet = 'Temperature_log' #the name of the spreadsheet already created
 
 
#initiate the temperature sensor
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')
 
#set up the location of the sensor in the system
device_folder = glob.glob('/sys/bus/w1/devices/28*')
device_file = [device_folder[0] + '/w1_slave']


def read_temp_raw(): #a function that grabs the raw temperature data from the sensor
    f_1 = open(device_file[0], 'r')
    lines_1 = f_1.readlines()
    f_1.close()
    return lines_1
 
 
def read_temp(): #a function that checks that the connection was good and strips out the temperature
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    temp = float(lines[1][equals_pos+2:])/1000
    temp_f = temp * 9.0 / 5.0 + 32
    return temp_f 

while True: #infinite loop
	try:
		values = [datetime.datetime.now(), read_temp()]
		gc = gspread.authorize(credentials)
		worksheet = gc.open(spreadsheet).sheet1
		worksheet.append_row(values) #write to the spreadsheet
	except:
		values = [datetime.datetime.now(), read_temp()]
		gc = gspread.authorize(credentials)
		worksheet = gc.open(spreadsheet).sheet1
		worksheet.append_row(values) #write to the spreadsheet
	time.sleep(300) #wait in seconds 600 is 10min
