#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ESP32Servo.h>

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

#define FIREBASE_HOST "parkingapp-dali-default-rtdb.firebaseio.com"  
#define FIREBASE_AUTH "rn0biWGam6iOBXWeUr9yzrgaPz0ANaa5zVvuEW6b"

#define SERVO_PIN 13

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
Servo myServo;

int lastAngle = -1;

// Button pins and states
const int buttonPins[10] = {15, 2, 4, 5, 18, 19, 21, 22, 23, 27};
bool placeStates[10] = {false};         // Track true/false per place
bool lastButtonStates[10] = {HIGH};     // For detecting state changes
unsigned long lastDebounceTime[10] = {0};  // For debouncing
unsigned long debounceDelay = 200;           // Delay for debouncing (milliseconds)

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConnected to WiFi");

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  myServo.attach(SERVO_PIN);
  myServo.write(0);  // default closed

  for (int i = 0; i < 10; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);

    // Set initial state to false in Firebase
    String path = "/places/place" + String(i + 1);
    Firebase.setBool(fbdo, path, false);
  }
}

void loop() {
  // Check and handle each button
  for (int i = 0; i < 10; i++) {
    int currentState = digitalRead(buttonPins[i]);

    // Check if the button state has changed (falling edge)
    if (currentState == LOW && lastButtonStates[i] == HIGH) {
      // Check if debounce delay has passed
      if (millis() - lastDebounceTime[i] > debounceDelay) {
        placeStates[i] = !placeStates[i];  // Toggle occupancy

        String path = "/places/place" + String(i + 1);
        if (Firebase.setBool(fbdo, path, placeStates[i])) {
          Serial.print("Spot n°");
          Serial.print(i + 1);
          Serial.print(" is ");
          Serial.println(placeStates[i] ? "OCCUPIED" : "EMPTY");
        } else {
          Serial.print("Failed to update spot n°");
          Serial.print(i + 1);
          Serial.print(": ");
          Serial.println(fbdo.errorReason());
        }
        lastDebounceTime[i] = millis();  // Reset debounce timer
      }
    }

    lastButtonStates[i] = currentState;  // Update last state
  }

  // Servo control from Firebase
  if (Firebase.getInt(fbdo, "/servoAngle")) {
    if (fbdo.dataType() == "int") {
      int angle = fbdo.intData();
      if (angle != lastAngle) {
        myServo.write(angle);
        lastAngle = angle;
        Serial.printf("Servo Angle Updated: %d\n", angle);
      }
    } else {
      Serial.println("Unexpected data type.");
    }
  } else {
    Serial.print("Error reading Firebase: ");
    Serial.println(fbdo.errorReason());
  }

  delay(50);  // Small loop delay
}
