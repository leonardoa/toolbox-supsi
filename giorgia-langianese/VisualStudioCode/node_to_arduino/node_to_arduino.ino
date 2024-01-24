/*------------------------------------------------------------------------
  Example sketch for Adafruit Thermal Printer library for Arduino.
  Demonstrates a few text styles & layouts, bitmap printing, etc.

  IMPORTANT: DECLARATIONS DIFFER FROM PRIOR VERSIONS OF THIS LIBRARY.
  This is to support newer & more board types, especially ones that don't
  support SoftwareSerial (e.g. Arduino Due).  You can pass any Stream
  (e.g. Serial1) to the printer constructor.  See notes below.
  ------------------------------------------------------------------------*/

#include "Adafruit_Thermal.h"
#include "adalogo.h"
#include "adaqrcode.h"

// Here's the new syntax when using SoftwareSerial (e.g. Arduino Uno) ----
// If using hardware serial instead, comment out or remove these lines:

#include "SoftwareSerial.h"
#define TX_PIN 6 // Arduino transmit  YELLOW WIRE  labeled RX on printer
#define RX_PIN 5 // Arduino receive   GREEN WIRE   labeled TX on printer

SoftwareSerial mySerial(RX_PIN, TX_PIN); // Declare SoftwareSerial obj first
Adafruit_Thermal printer(&mySerial);     // Pass addr to printer constructor
// Then see setup() function regarding serial & printer begin() calls.

// Here's the syntax for hardware serial (e.g. Arduino Due) --------------
// Un-comment the following line if using hardware serial:

//Adafruit_Thermal printer(&Serial1);      // Or Serial2, Serial3, etc.

// -----------------------------------------------------------------------

void setup() {

  // This line is for compatibility with the Adafruit IotP project pack,
  // which uses pin 7 as a spare grounding point.  You only need this if
  // wired up the same way (w/3-pin header into pins 5/6/7):
  pinMode(7, OUTPUT); digitalWrite(7, LOW);

  Serial.begin(9600);

  // NOTE: SOME PRINTERS NEED 9600 BAUD instead of 19200, check test page.
  mySerial.begin(19200);  // Initialize SoftwareSerial
  //Serial1.begin(19200); // Use this instead if using hardware serial
  printer.begin();        // Init printer (same regardless of serial type)

  // The following calls are in setup(), but don't *need* to be.  Use them
  // anywhere!  They're just here so they run one time and are not printed
  // over and over (which would happen if they were in loop() instead).
  // Some functions will feed a line when called, this is normal.



  // Test character double-height on & off
  //printer.doubleHeightOn();
  //printer.println(F("Go Outside!"));
  //printer.doubleHeightOff();
  

}

void loop() {

  // CHeck to see if Serial data is being received
  if (Serial.available() > 0) {

    // Create a new string variable to receive Serial data
    String receivedString = "";

    // Loop through received data and append to the receivedString variable
    while (Serial.available() > 0) {
      receivedString += char(Serial.read());
    }



    // Print something here
    if (receivedString == "1") {
        // PRINT IMG
        printer.printBitmap(adalogo_width, adalogo_height, adalogo_data);

        printer.sleep();      // Tell printer to sleep
        delay(3000L);         // Sleep for 3 seconds
        printer.wake();       // MUST wake() before printing again, even if reset
        printer.setDefault(); // Restore printer to defaults

    } else if (receivedString == "2") {
      Serial.println("B");
    } else {
      Serial.println("C");
    }
  }



}



