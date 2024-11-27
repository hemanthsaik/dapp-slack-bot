FROM denoland/deno

WORKDIR /app

ADD . /app

RUN deno install --entrypoint main.ts

CMD ["run", "start"]
