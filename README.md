# UwU muzyczny grajek
Nie mam jak go hostować 24/7 więc jakby ktoś chciał to proszę bardzo tutaj jest kod. Potrzebujesz do tego podstawową wiedzę o tworzeniu botów discordowych, nodejs >16.9, dobry internet i odrobinę wolnego czasu. 

## Szybka bezsensowna instrukcja:
Jeśli używasz windowsa na początku prawdopodobnie musisz pobrać wymagane rzeczy, aby baza danych jaką używam do tego projektu działała. [Kliknij tu po instrukcję](https://enmap.evie.dev/install/#pre-requisites). Zrób wszystko pod **Pre-Requisites**. Następnie musisz pobrać FFMPEG i dodać go do ścieżki. Po probraniu wpisujesz `npm i` aby zainstalować moduły. Świetnie, teraz stwórz plik tekstowy `.env` i uzupełnij go następująco według schematu:
```env
DISCORDBOT_TOKEN = ""
DISCORDBOT_DEV_TOKEN = ""
BOT_GUILD_ID = ""
PORT = ""
```
Tam gdzie jest `DISCORDBOT_TOKEN` i `DISCORDBOT_DEV_TOKEN` dajesz token bota. `DISCORDBOT_DEV_TOKEN` jest do developmentu. Jeśli development Cię to nie interesuje to rób z tym co chcesz.
`BOT_GUILD_ID` dajesz id serwera do developmentu bota do rejestrowania komend developerskich. W `PORT` dajesz numerek na jaki ma działać serwer (zalecany numer większy niż 3000 i mniejszy niż 99999).
Jeśli uzupełnione to świetnie! Teraz możesz zbudować bota komendą `npm run build` **UŻYWASZ JĄ TYLKO RAZ**. Póżniej włączasz już bota wpisująć `npm run deploy`. Bot powienien już być online jeśli nei ma jakiś błędów. Teraz musisz wejść na stonę http://localhost:XXXX **ZAMIAST *XXXX* DAJESZ NUMER JAKI DAŁEŚ W `PORT` W `.env`**, klikasz w manage i przycisk `zarejestruj globalne komendy` (musisz to zrobić tylko raz).
Bot powiennien być już gotowy i grać śmiało

## Updatowanie bota
Jeśli jesteś zaawansowanym użytkownikiem to znaczy, że pobrałeś kod używająć gita. W takim wypadku można zupdatować bota wpisująć `git pull` zainstalować ewentualne nowe moduły `npm i` następnie budująć go ponownie `npm run build`.
W innym przypadku należy bota ponownie pobrać i skopiować `.env` z poprzedniej wersji, pobrać moduły `npm i` oraz zbudować go `npm run build`

## PR mile widziane. Jeśli coś nie działa zapraszam do otwarcia issue
