/* global p5 trim setDiffuse setBomb setSteal atan cos sin PI windowHeight windowWidth updateLine isGameOn launch*/

// Declare a "SerialPort" object
var serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
var portName = "/dev/tty.usbmodem141101";
// let portName = 'COM4'

// We are connected and ready to go
function serverConnected() {
  print("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  print("List of Serial Ports:");
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  print(theerror);
}

// There is data available to work with from the serial port
function gotData() {
  let currentString = serial.readLine(); // read the incoming string
  // trim(currentString); // remove any trailing whitespace
  // if (!currentString) return; // if the string is empty, do no more
  // parseInt(currentString);
  // console.log(currentString); // print the string
  // latestData = currentString; // save it for the draw method

  if (currentString == null || currentString == '') {
    // console.log("string is empty")
    return; // if the string is empty, do no more
  }

  trim(currentString); // remove any trailing whitespace

  // parseInt(currentString);
  console.log(currentString); // print the string
  // latestData = currentString; // save it for the draw method

  if (currentString == "button 1 pressed") {
    setDiffuse();
    // launch();
  } else if (currentString == "button 2 pressed") {
    setBomb();
    // launch();
  } else if (currentString == "button 3 pressed") {
    setSteal();
  } else if (currentString == "button 4 pressed") {
    launch();
  } else if (currentString == "button 5 pressed") {
    isGameOn = false;
  } else if (currentString == "button 6 pressed") {
    isGameOn = true;
  } else {
    let posArray = currentString.split("|");
    // console.log(posArray);
    let xaxis = parseInt(posArray[0].split(":")[1].trim());
    let yaxis = parseInt(posArray[1].split(":")[1].trim());
    let theta = atan((xaxis - 511) / (yaxis - 511));
    if (theta < 0) {
      theta = theta + PI;
    }

    let r = windowHeight;

    // console.log("theta");
    // console.log(theta);

    // console.log("delta x");
    // console.log(r * cos(theta));
    let x = windowWidth / 2 + r * cos(theta);
    let y = windowHeight - 30 - r * sin(theta);

    console.log(x);
    console.log(y);

    console.log("updateLine");
    updateLine(x, y);
  }
}

// We got raw from the serial port
function gotRawData(thedata) {
  console.log("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device

function parse() {
  // let currentString = "X-axis: 496 | Y-axis: 526 |";
  let currentString = "button 4 pressed";
  trim(currentString); // remove any trailing whitespace
  if (!currentString) return; // if the string is empty, do no more
  // parseInt(currentString);
  console.log(currentString); // print the string
  // latestData = currentString; // save it for the draw method

  if (currentString == "button 1 pressed") {
    setDiffuse();
  } else if (currentString == "button 2 pressed") {
    setBomb();
  } else if (currentString == "button 3 pressed") {
    setSteal();
  } else if (currentString == "button 4 pressed") {
    isGameOn = false;
  } else {
    let posArray = currentString.split("|");
    // console.log(posArray);
    let xaxis = parseInt(posArray[0].split(":")[1].trim());
    let yaxis = parseInt(posArray[1].split(":")[1].trim());
    let theta = 0.25* atan((xaxis - 511) / (yaxis - 511));
    if (theta < 0) {
      theta = theta + PI;
    }

    let r = windowHeight;

    console.log("theta");
    console.log(theta);

    console.log("delta x");
    console.log(r * cos(theta));
    let x = windowWidth / 2 + r * cos(theta);
    let y = windowHeight - 30 - r * sin(theta);

    console.log(x);
    console.log(y);

    console.log("updateLine");
    updateLine(x, y);
  }
}
