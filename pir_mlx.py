import RPi.GPIO as GPIO
import time
from gpiozero import LED
from smbus2 import SMBus
from mlx90614 import MLX90614
import cv2
from pyzbar import pyzbar
import base64
import pandas as pd
import requests

df = pd.read_excel (r'/home/pi/Downloads/attendance.xlsx')
print(df)
GPIO.setmode(GPIO.BCM)
PIR_PIN = 7
GPIO.setup(PIR_PIN, GPIO.IN)
green_led = LED(18)
yellow_led = LED(23)
red_led = LED(24)
def read_barcodes(frame, last_rno, temp):
    barcodes = pyzbar.decode(frame)
    exit_flag = 0
    for barcode in barcodes:
        x, y , w, h = barcode.rect
        #1
        barcode_info = barcode.data.decode('utf-8')
        cv2.rectangle(frame, (x, y),(x+w, y+h), (0, 255, 0), 2)
        
        #2
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, barcode_info, (x + 6, y - 6), font, 2.0, (255, 255, 255), 1)
        #3
        cv2.imwrite("/home/pi/Desktop/photos/frame1.png", frame)
        with open("/home/pi/Desktop/photos/frame1.png", "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
            print(encoded_string)
        print("Recognized barcode: ", barcode_info)
        yellow_led.off()
        green_led.on()
        print("Green is on")
        if(last_rno != barcode_info):
            print("First time?", last_rno)
            with open("barcode_result.txt", mode ='w') as file:
                file.write("Recognized Barcode:" + barcode_info)
            try:
                result_row = df.loc[df['rno'] == int(barcode_info)]
                res_dict = dict({
                    'rno': int(barcode_info),
                    'name': str(result_row['name'].iloc[0]),
                    'department': str(result_row['department'].iloc[0]),
                    'semester': str(result_row['semester'].iloc[0]),
                    # 'img': str(encoded_string),
                    'temperature': round(float(temp), 2)
                })
                print(res_dict)
                r = requests.post('http://192.168.105.192:5000/insert', json=res_dict)
            except Exception as e:
                print("nope", e)
            last_rno = barcode_info
            exit_flag = 1
    return frame, last_rno, exit_flag



try:
    print("PIR Module Test (CTRL+C)")
    time.sleep(2)
    print("Ready")
    i=0
    last_rno = -1
    while True:
        
        if GPIO.input(PIR_PIN):
            print("Motion Detected!", i)
            #green_led.on()
            #print("on")
            bus = SMBus(1)
            sensor = MLX90614(bus, address=0x5A)
            print("Ambient Temperature :", sensor.get_amb_temp())
            print("Object Temperature :", sensor.get_obj_temp())
            temp = float(sensor.get_obj_temp())
            bus.close()
            red_led.off()
            yellow_led.on()
            print("Yellow is on")
            
            camera = cv2.VideoCapture(0)
            ret, frame = camera.read()
            #2
            while ret:
                ret, frame = camera.read()
                frame, last_rno, exit_flag = read_barcodes(frame, last_rno, temp)
                if(exit_flag == 1):
                    break
                cv2.imshow('Barcode/QR code reader', frame)
                if cv2.waitKey(1) & 0xFF == 27:
                    break
            camera.release()
            cv2.destroyAllWindows()
            i=i+1
            time.sleep(1)
        else:
            print("Motion stopped")
            #green_led.off()
            green_led.off()
            yellow_led.off()
            red_led.on()
            #print("off")
            print("red is on")
            time.sleep(1)
except KeyboardInterrupt:
    print("Quit")
    green_led.off()
    GPIO.cleanup() 
