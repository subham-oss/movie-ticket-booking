import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./configs/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRouters.js";
import adminRouter from "./routes/adminRouters.js";
import userRouter from "./routes/userRouter.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

const app = express();
const port = process.env.PORT || 5000;


app.use('/api/stripe', express.raw({ type: 'application/json'}), stripeWebhooks)

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
connectDB();
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
