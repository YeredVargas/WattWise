#include <WiFi.h>
#include <HTTPClient.h>

// Credenciales WiFi
const char* ssid = "LAPTOP-THJSQEP3 1658";
const char* password = "12345678";

// Datos del servidor Node.js
const char* server = "192.168.137.131";
const int port = 3000;

// Pines del ESP32
const int sensorPin1 = 34;
const int sensorPin2 = 35;
const int relayPin1 = 26;
const int relayPin2 = 27;

// Variables
float corriente1 = 0;
float corriente2 = 0;
float potencia1 = 0;
float potencia2 = 0;
float potenciaTotal = 0;

// Variables de calibración
float calFactor = 30.0;
float voltaje = 127.0;

// Estado de los relés
bool relay1State = false;
bool relay2State = false;

void setup() {
  Serial.begin(115200);

  pinMode(relayPin1, OUTPUT);
  pinMode(relayPin2, OUTPUT);
  digitalWrite(relayPin1, LOW);
  digitalWrite(relayPin2, LOW);

  conectarWiFi();
}

void loop() {
  // Verificar conexión WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado, intentando reconectar...");
    conectarWiFi();
  }

  // Leer sensores y calcular potencia
  corriente1 = leerCorriente(sensorPin1);
  corriente2 = leerCorriente(sensorPin2);
  potencia1 = corriente1 * voltaje;
  potencia2 = corriente2 * voltaje;
  potenciaTotal = potencia1 + potencia2;

  // Mostrar datos en Serial
  Serial.print("Corriente 1: "); Serial.print(corriente1, 4); Serial.print(" A | ");
  Serial.print("Corriente 2: "); Serial.print(corriente2, 4); Serial.println(" A");
  Serial.print("Potencia 1: "); Serial.print(potencia1, 4); Serial.print(" W | ");
  Serial.print("Potencia 2: "); Serial.print(potencia2, 4); Serial.println(" W");
  Serial.print("Potencia Total: "); Serial.print(potenciaTotal, 4); Serial.println(" W\n");

  // Enviar datos
  enviarDatos();

  // Leer comandos del Serial
  serialEvent();

  delay(350);
}

void conectarWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 10) {
    delay(1000);
    Serial.print(".");
    intentos++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConectado a WiFi");
  } else {
    Serial.println("\nNo se pudo conectar a WiFi");
  }
}

float leerCorriente(int pin) {
  float ondac = 0;
  int muestras = 0;
  unsigned long startMillis = millis();

  while (millis() - startMillis < 1000) {
    float sensorValue = analogRead(pin) * (3.3 / 4095.0);
    float corriente = sensorValue * calFactor;
    ondac += sq(corriente);
    muestras++;
    delay(1);
  }

  ondac *= 2;
  return sqrt(ondac / muestras);
}

void enviarDatos() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("No hay conexión WiFi, no se enviarán datos.");
    return;
  }

  HTTPClient http;
  String url = "http://" + String(server) + ":" + String(port) + "/datos";
  Serial.print("Enviando datos a: "); Serial.println(url);
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"corriente1\": " + String(corriente1, 4) + ", ";
  json += "\"corriente2\": " + String(corriente2, 4) + ", ";
  json += "\"potencia1\": " + String(potencia1, 4) + ", ";
  json += "\"potencia2\": " + String(potencia2, 4) + ", ";
  json += "\"potenciaTotal\": " + String(potenciaTotal, 4) + ", ";
  json += "\"relay1State\": " + String(relay1State ? "true" : "false") + ", ";
  json += "\"relay2State\": " + String(relay2State ? "true" : "false");
  json += "}";

  Serial.println("Enviando JSON: " + json);

  int httpCode = http.POST(json);
  if (httpCode > 0) {
    Serial.print("Código HTTP: ");
    Serial.println(httpCode);
    Serial.println("Respuesta del servidor:");
    Serial.println(http.getString());
  } else {
    Serial.print("Error HTTP: ");
    Serial.println(httpCode);
  }
  http.end();
}

void serialEvent() {
  while (Serial.available()) {
    char command = Serial.read();
    if (command == '1') {
      relay1State = !relay1State;
      digitalWrite(relayPin1, relay1State);
      Serial.print("Relé 1: ");
      Serial.println(relay1State ? "Encendido" : "Apagado");
    } else if (command == '2') {
      relay2State = !relay2State;
      digitalWrite(relayPin2, relay2State);
      Serial.print("Relé 2: ");
      Serial.println(relay2State ? "Encendido" : "Apagado");
    }
  }
}
