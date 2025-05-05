#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

#define FIREBASE_HOST "parkingapp-dali-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "rn0biWGam6iOBXWeUr9yzrgaPz0ANaa5zVvuEW6b"

#define SERVO_PIN 13

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
Servo myServo;

LiquidCrystal_I2C lcd(0x27, 16, 2); // Adresse 0x27, écran 16x2
int occupiedCount = 0;
int lastAngle = -1;
String clientName = "";
String email = "";  // Variable to store email address

// Boutons
const int buttonPins[10] = {15, 2, 4, 5, 18, 19, 21, 22, 23, 27};
bool placeStates[10] = {false};
bool lastButtonStates[10] = {HIGH};
unsigned long lastDebounceTime[10] = {0};
unsigned long debounceDelay = 200;

void setup() {
  Serial.begin(115200);

  // Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConnected to WiFi");

  // Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Servo
  myServo.attach(SERVO_PIN);
  myServo.write(0);

  // LCD init
  Wire.begin(26, 25);
  lcd.begin(16, 2);
  lcd.backlight();

  // 🔄 Retrieve UID and email (assuming you use Firebase Authentication)
  String pathToEmail = "/users/" + String(auth.token.uid.c_str()) + "/email";  // Convert uid to String and append "/email"
  if (Firebase.getString(fbdo, pathToEmail)) {
    email = fbdo.stringData();  // Fetch the email from the database

    // Extract the part before '@' from the email
    String userName = email.substring(0, email.indexOf('@'));  // Extract part before '@'

    lcd.setCursor(0, 0);
    lcd.print("Welcome:        ");
    lcd.setCursor(0, 1);
    lcd.print(userName);  // Display the part before '@' on LCD
  } else {
    lcd.setCursor(0, 0);
    lcd.print("Parking ESP32");
    lcd.setCursor(0, 1);
    lcd.print("Smart System");
  }

  // Init buttons
  for (int i = 0; i < 10; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
    String path = "/places/place" + String(i + 1);
    Firebase.setBool(fbdo, path, false);
  }

  delay(2000);
  lcd.clear();
}

void loop() {
  occupiedCount = 0;

  // Boutons
  for (int i = 0; i < 10; i++) {
    int currentState = digitalRead(buttonPins[i]);

    if (currentState == LOW && lastButtonStates[i] == HIGH) {
      if (millis() - lastDebounceTime[i] > debounceDelay) {
        placeStates[i] = !placeStates[i];
        String path = "/places/place" + String(i + 1);
        if (Firebase.setBool(fbdo, path, placeStates[i])) {
          Serial.printf("Spot n°%d is %s\n", i + 1, placeStates[i] ? "OCCUPIED" : "EMPTY");
        } else {
          Serial.printf("Failed to update spot n°%d: %s\n", i + 1, fbdo.errorReason().c_str());
        }
        lastDebounceTime[i] = millis();
      }
    }

    lastButtonStates[i] = currentState;
    if (placeStates[i]) occupiedCount++;
  }

  // Ligne 0 : Nombre de places occupées
  lcd.setCursor(0, 0);
  lcd.print("Occupied: ");
  lcd.print(occupiedCount);
  lcd.print("   ");

  // Servo
  if (Firebase.getInt(fbdo, "/servoAngle")) {
    if (fbdo.dataType() == "int") {
      int angle = fbdo.intData();
      if (angle != lastAngle) {
        myServo.write(angle);
        lastAngle = angle;
        Serial.printf("Servo Angle Updated: %d\n", angle);

        lcd.setCursor(0, 1);
        if (angle == 0) {
          lcd.print("Gate is CLOSED  ");
        } else if (angle == 90) {
          lcd.print("Gate is OPENED ");
        } else {
          lcd.print("Angle: ");
          lcd.print(angle);
          lcd.print(" deg   ");
        }
      }
    }
  } else {
    Serial.print("Error reading Firebase: ");
    Serial.println(fbdo.errorReason());
  }

  delay(100);
}
