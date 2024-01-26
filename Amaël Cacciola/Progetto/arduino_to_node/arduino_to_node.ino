const int buttonPin = 2;      // Imposta il pin del pulsante
int buttonState = HIGH;        // Variabile per memorizzare lo stato del pulsante precedente
int lastButtonState = HIGH;    // Variabile per memorizzare lo stato precedente del pulsante
unsigned long lastDebounceTime = 0;  // Tempo dell'ultima lettura del pulsante
unsigned long debounceDelay = 20;    // Ritardo per il debounce (ridotto a 20 millisecondi)

void setup() {
  Serial.begin(9600);          // Inizia la comunicazione seriale
  pinMode(buttonPin, INPUT);    // Utilizza la resistenza di pull-up interna
}

void loop() {
  int reading = digitalRead(buttonPin);  // Leggi lo stato attuale del pulsante

  // Applica il debounce
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // Aggiorna lo stato solo se il valore è stabile
    if (reading != buttonState) {
      buttonState = reading;

      // Controlla se il pulsante è stato premuto
      if (buttonState == LOW) {
        Serial.println("Pulsante premuto!");  // Invia un messaggio alla porta seriale
        // Aggiungi qui il codice per eseguire azioni quando il pulsante è premuto
      }
    }
  }

  lastButtonState = reading;  // Salva lo stato attuale per il prossimo ciclo
}
