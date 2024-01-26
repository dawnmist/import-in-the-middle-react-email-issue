import express from "express";
import HelloWorldEmail from "./emailTemplates/index.tsx";
import { render } from "@react-email/components";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const renderedHtml = render(HelloWorldEmail());

  res.send(renderedHtml);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
