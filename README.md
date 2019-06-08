# Frontend

[![Build Status](https://travis-ci.com/dsirpc/frontend.svg?branch=master)](https://travis-ci.com/dsirpc/frontend)

RPC è un progetto realizzato per il corso di [_Tecnologie e Applicazioni Web_](https://www.unive.it/data/insegnamento/212562) a.a. 2018/2019 tenuto dal Prof. Filippo Bergamasco.

**Team**
* Ettore Chinellato ([@EttoreChinellato](https://github.com/EttoreChinellato))
* Michele Pessotto ([@MichelePessotto](MichelePessotto))
* Pietro Rampazzo ([@peterampazzo](https://github.com/peterampazzo))

### Software Architecture

RPC segue il paradigma Client-Server. Troviamo due componenti principali: un client sviluppato in Angular e un backend scritto in TypeScript e che si avvale di un database MongoDB.

Il client è multipiattaforma: è stata sviluppata una web app tramite Angular il cui codice è presente nel branch `master`, una app ibrida per Android e una Desktop App con Elecron. 

Per la app ibrida sono state applicate delle modifiche al codice di Angular e si trovano nel branch `android`, ma il vero progetto è contenuto nel repository [`mobile`](https://github.com/dsirpc/mobile/) il quale eredita tutte le modifiche del branch citato tramite submodule.

Il sorgente della Desktop App è contenuto, invece, nel branch `electron`. 

### Backend

Per il completo funzionamento della SPA Angular è necessario eseguire concorrentemente il [`backend`](https://github.com/dsirpc/backend). Se viene utilizzata una copia in locale del backend bisogna modificare la variabile `url` all'interno di `user.service.ts`.

### Desktop App (powered by Electron)

Per lanciare l'applicazione desktop è necessario spostarsi sul branch `electron`, eseguire `npm install` per installare le dipendenze e successivamente lanciare `npm start`.
