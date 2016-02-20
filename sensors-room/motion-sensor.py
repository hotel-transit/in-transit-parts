#!/usr/bin/python

##############################################
#                                            #
# Read from pir sensors and send OSC         #
# pir example found in raspberrypi-spy-co.uk #
#                                            #
# dakodeon - 19/02/2016                      #
#                                            #
##############################################

# Import required Python libraries
import RPi.GPIO as GPIO
import time
import OSC

# Setup OSC
addr = '192.168.77.23' # localhost
port = 57120 # sclang port

client = OSC.OSCClient()
client.connect( (addr, port) )

# Use BCM GPIO references
# instead of physical pin numbers
GPIO.setmode(GPIO.BCM)

# Variable to limit number of sensors -- now i have only two!
numS = 1

# Define GPIO to use on Pi
pir = [20, 21, 16, 12]

print "PIR Module Test (CTRL-C to exit)"

# Set pins as input
for i in range(numS):
  GPIO.setup(pir[i], GPIO.IN)

Current_State  = [0, 0, 0, 0]
Previous_State = [0, 0, 0, 0]

# Debouncing function
def debounce(pin, last):
    current = GPIO.input(pin)
    if last != current:
        time.sleep(0.005)
        current = GPIO.input(pin)
    return current

try:

  print "Waiting for PIRs to settle ..."

  # Loop until PIR output is 0
  for i in range(numS):
    while GPIO.input(pir[i])==1:
      Current_State[i] = 0

    print("Sensor {0:2d} ready".format(i))
    
  # Loop until users quits with CTRL-C
  while True :
   
    # Read PIR states
    for i in range(numS):
      Current_State[i] = debounce(pir[i], Previous_State[i])
   
      if Current_State[i] == 1 and Previous_State[i] == 0:
      # PIR is triggered
        print("{0:2d} :  Motion detected!".format(i))
        # Create and send OSC message
        msg = OSC.OSCMessage()
        msg.setAddress("/motion")
        msg.append(i)
        msg.append(1)
        client.send(msg)
        # Record previous state
        Previous_State[i]=1
      elif Current_State[i]==0 and Previous_State[i]==1:
      # PIR has returned to ready state
        print("{0:2d} :  Ready".format(i))
        msg = OSC.OSCMessage()
        msg.setAddress("/motion")
        msg.append(i)
        msg.append(0)
        client.send(msg)
        Previous_State[i]=0
      
      # Wait for 10 milliseconds
      time.sleep(0.01)
      
except KeyboardInterrupt:
  print "  Quit" 

finally:
  # Reset GPIO settings
  GPIO.cleanup()
