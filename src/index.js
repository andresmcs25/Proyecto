import "dotenv/config";
import app from "./app.js";


async function main() {
  try {
    console.log("connection has been established successfully");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.error("Unable  to connect to the database");
  }
}

main();
