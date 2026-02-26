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

// Login endpoint
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
    .find({ id: user.roleId })
    .value();

  const { password: pwd, ...safeUser } = user;

  res.json({
    token,
    user: { ...safeUser, role: role?.name, permissions: role?.permissions }
  });
});

// // Get current user endpoint
// server.get("/me", (req, res) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const token = authHeader?.startsWith("Bearer ")
//     ? authHeader.split(" ")[1]
//     : null;

//   if (!token) {
//     return res.status(401).json({ error: "Invalid token format" });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     const user = db.get("users").find({ id: decoded.id }).value();
//     const role = db.get("roles").find({ id: user.roleId }).value();

//     const { password, ...safeUser } = user;

//     res.json({ ...safeUser, role: role?.name, permissions: role?.permissions });
//   } catch (err) {
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// });

// Middleware to verify token for POST, PUT, DELETE operations
server.use((req, res, next) => {
  if (req.method === "GET") {
    return next();
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
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// Custom endpoint to create user with hashed password
server.post("/users/register", (req, res) => {
  const { name, email, password, roleId } = req.body;

  // Check if user already exists
  const existingUser = db.get("users").find({ email }).value();
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create new user
  const newUser = {
    id: String(Date.now()),
    name,
    email,
    password: hashedPassword,
    roleId
  };

  db.get("users").push(newUser).write();

  const { password: pwd, ...safeUser } = newUser;

  res.status(201).json(safeUser);
});

// Custom endpoint to update user
server.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, roleId } = req.body;

  const user = db.get("users").find({ id: id }).value();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const updateData = {
    name,
    email,
    roleId
  };

  // Only hash and update password if provided
  if (password) {
    updateData.password = bcrypt.hashSync(password, 10);
  } else {
    updateData.password = user.password;
  }

  db.get("users")
    .find({ id: id })
    .assign(updateData)
    .write();

  const { password: pwd, ...safeUser } = db.get("users").find({ id: id }).value();

  res.json(safeUser);
});

// Get users with role details
server.get("/users-with-roles", (_req, res) => {
  const users = db.get("users").value();
  const roles = db.get("roles").value();

  const usersWithRoles = users.map(user => {
    const role = roles.find(r => r.id === user.roleId);
    const { password, ...safeUser } = user;
    return {
      ...safeUser,
      roleName: role?.name || "N/A"
    };
  });

  res.json(usersWithRoles);
});

server.use(router);

server.listen(3001, () => {
  console.log("JSON Server is running on port 3001");
});
