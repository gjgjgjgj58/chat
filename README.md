# chat

<img src="https://capsule-render.vercel.app/api?type=waving&color=timeAuto&height=200&section=header&text=chat&fontSize=90" />

![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0.6-47A248)
![Node.js](https://img.shields.io/badge/Node.js-18.16.0-339933)
![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000000)
![Mongoose.js](https://img.shields.io/badge/Mongoose.js-7.2.2-880000)

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&amp;logo=JavaScript&amp;logoColor=white" /> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&amp;logo=MongoDB&amp;logoColor=white" />

react & nodejs
봇(심심이)과 채팅할 수 있는 개인 공부용 앱 개발

## Refer to
- [Codepen - React Chat](https://codepen.io/swaibu/pen/OJLZjLb)
- [CodeHim - 65+ Login Page in HTML with CSS Code](https://www.codehim.com/collections/login-page-in-html-with-css-code/)

## .env
- server 폴더 내 .env 생성 필요
- [SIMSIMI WORKSHOP](https://workshop.simsimi.com/)에서 API KEY 발급 후 작성
- client 폴더 내 .env 생성 필요
- VWorld API KEY 발급 후 작성

### example(server)
```
PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/chat
SECRET_KEY=xxx
SIMSIMI_API_URL=https://wsapi.simsimi.com/190410/talk
SIMSIMI_API_KEY=xxx
```

### example(client)
```
REACT_APP_VWORLD_API_KEY=xxx
```

### 설치법
- client/server 두 폴더 수행
1. npm init -y
2. npm install
3. npm start(package.json scripts의 start)

## TODO
- OAuth 2.0
- socket.io 실시간 채팅
