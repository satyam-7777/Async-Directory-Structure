# Async Exercise

You have a server which stores a directory structure. The task is to replicate the structure on the client.

---

## Instructions to setup the project

1. Clone the project

```sh
git clone https://github.com/pramod-io/mb-async-live-review-3 async_live_review
```

2. cd to the `async_live_review` directory

```sh
cd async_live_review
```

3. Install dependencies

```sh
npm install
```

4. Start the server

```
node server.js
```

---

## In `client.js`, Perform the below steps in the following order:

1. Fetch the root directory by making a fetch request to the `/` url.
2. Identify the directories in the root directory and fetch all the files belonging to each directory recursively.
3. Once all the files are fetched, print all the items that are files.

---
