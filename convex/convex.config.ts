import { defineApp } from "convex/server";
import workosAuthkit from "@convex-dev/workos-authkit/convex.config";
import dodopayments from "@dodopayments/convex/convex.config";

const app = defineApp();
app.use(workosAuthkit);
app.use(dodopayments);

export default app;
