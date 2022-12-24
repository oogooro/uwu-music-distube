# UwU Muzyczny Grajek V3

Bot oparty na [DisTube](https://github.com/skick1234/DisTube) i na moim prywatnym UwU bocie <br />
Distube jest libką z którą mi się najgorzej pracowało. Połowa bota to jest bypassowanie dziwnej wewnętrznej logiki Distube <br />  <br />
Bot staje się publiczny, bo już nie chce mi się siedzieć i myśleć jak obejść tą libkę na wszystkie sposoby. Teraz robię nowego bota muzycznego robionego bez innych libek oprócz ekstraktorów z YouTube <br />
Tego bota uważam za skończonego, mimo że wcześniej planowałem jeszcze więcej do niego dodać. Będę przyjmować tylko PR naprawiające błędy, nowe funkcje nie będą przyjmowane. <br />

## Szybka instrukcja obsługi
### Potrzebne rzeczy:
- [Node.js](https://nodejs.org) LTS
- NPM (przychodzi razem z Node.js)
- [FFMPEG](https://ffmpeg.org/download.html) dodany do ścieżki (ewentualnie `ffmpeg-static` instalowany `npm i ffmpeg-static`) <br />
- [Git](https://gitforwindows.org) do pobierania aktualizacji kodu bota (opcionalne)

### Tworzenie aplikacji
1. Wchodzisz na portal [Discord Developers](https://discord.com/developers)
1. Klikasz niebieski przycisk New Application i stwórz aplikację
1. Na lewo klikasz Bot
1. Niebieki przycisk Add Bot -> Yes, do it!
1. Niebieski przycisk Reset Token <br /> <br />
Gratulację dostałeś token bota!

### Pobieranie kodu bota
Jeśli masz Git to użyj `git clone https://github.com/oogooro/uwu-music-distube` <br />
Jeśli nie to pobierz kod klikająć zielony przycisk Code -> Download ZIP, wypakuj go po pobraniu

### Uzupełnianie zmiennych środowiskowych
Skopiuj plik `.env.example` i zmień jego nazwę na `.env` <br />
Otwórz w edytorze tekstowym skopiowany plik <br />
```env
DISCORDBOT_TOKEN = ""
DISCORDBOT_DEV_TOKEN = ""
BOT_GUILD_ID = ""
PORT = "4401"
```
- `DISCORDBOT_TOKEN` dajesz swój token bota
- `DISCORDBOT_DEV_TOKEN` token bota do rozwoju aplikacji, możesz zostawić puste lub dać innego bota testowego
- `BOT_GUILD_ID` ID serwera testowego bota do developmentu
- `PORT` port serwera bota

### Instalowanie modułów i kompilacja
- Wchodzisz w konsoli ***uruchomionej jako administrator*** w ścieżkę bota (na poziom, na którym widzisz package.json)
- Wpisujesz `npm i -g --add-python-to-path --vs2015 --production windows-build-tools` (linuksiarze `sudo apt-get install build-essential`) (to może zająć długi czas)
- Następnie `npm i -g node-gyp@latest`
- Wpisujesz `npm i
- Jeśli nie masz FFMPEG to wpisujesz `npm i ffmpeg-static` <br /> <br />
Kompilacja:
- `npm run build` <br /> <br />
Uruchamianie:
- `npm run deploy` <br /> <br />
Po tym bot powinien już żyć

### Dodawanie komend
- Wchodzisz w przeglądarce na http://localhost:4401
- Manage
- Zarejestruj komendy **globalne**

### Dodawanie bota na serwery
- Wchodzisz na portal [Discord Developers](https://discord.com/developers)
- Klikasz w swoją aplikację
- OAuth2
- URL Generator
- W SCOPES klikasz `bot`
- Na dole kopiujesz `GENERATED URL` i wklejasz w przeglądarkę

### Po Tym wszystkim bot powinien być już zdatny do użytku
Bota uruchamiasz wpisująć `npm run deploy` resztę punktów nie trzeba powtarzać
