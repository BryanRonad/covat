import RPi.GPIO as GPIO
import time
from gpiozero import LED
from smbus2 import SMBus
from mlx90614 import MLX90614

GPIO.setmode(GPIO.BCM)
PIR_PIN = 7
GPIO.setup(PIR_PIN, GPIO.IN)
green_led = LED(18)

try:
    print("PIR Module Test (CTRL+C)")
    time.sleep(2)
    print("Ready")
    i=0
    while True:
        if GPIO.input(PIR_PIN):
            print("Motion Detected!", i)
            green_led.on()
            print("on")
            bus = SMBus(1)
            sensor = MLX90614(bus, address=0x5A)
            print("Ambient Temperature :", sensor.get_amb_temp())
            print("Object Temperature :", sensor.get_obj_temp())
            bus.close()
            i=i+1
            time.sleep(1)
        else:
            print("Motion stopped")
            green_led.off()
            print("off")
            time.sleep(1)
except KeyboardInterrupt:
    print("Quit")
    green_led.off()
    GPIO.cleanup()

