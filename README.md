# init prj

npm init -y

# install ts

🔹 typescript: trình biên dịch TS
🔹 ts-node-dev: chạy TS không cần build, auto reload (giống nodemon)
🔹 @types/node: cung cấp types cho Node.js
npm install --save-dev typescript ts-node-dev @types/node

# Remove node_modules

sudo rm -rf node_modules

npm install

# run server
# run only file
npx ts-node-dev --respawn --transpile-only src/index.ts

# 1. setup pm2 with ts

npm install -g pm2 ts-node typescript

# 2. create file ecosystem.config.js

# 3. run project

pm2 start ecosystem.config.js

# error to connect database
-> 'localhost' -> 127.0.0.1	