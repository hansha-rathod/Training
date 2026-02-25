const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = router.db;


const SECRET_KEY = "secret-key"; 
const EXPIRES_IN = "1h";

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.get("users").find({ email }).value();

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passMatch = bcrypt.compareSync(password, user.password);

  if (!passMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, roleId: user.roleId },
    SECRET_KEY,
    { expiresIn: EXPIRES_IN }
  );

  const role = db.get("roles")
    .find({ id: String(user.roleId) })
    .value();

  const permissions = db.get("permissions")
    .filter(p => user.permissionIds?.includes(Number(p.id)))
    .value();

  const { password: pwd, ...safeUser } = user;

  res.json({
    token,
    user: { ...safeUser, role: role?.name },
    permissions
  });
});

server.use((req, res, next) => {
    if (req.method === "GET" || req.path === "/login") {
        return next(); // allow reads & login
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

    if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
}

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // attach user info
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});

server.use(router);

server.listen(3001, ()=> {
    console.log("Running on port 3001")
})
